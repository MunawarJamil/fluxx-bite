import type { AxiosError, AxiosInstance } from 'axios';

import {
    failedQueue,
    isRefreshing,
    processQueue,
    setIsRefreshing,
} from './authRefresh';

import type { RetryableRequest } from './types';

export const setupInterceptors = (
    api: AxiosInstance,
    refreshClient: AxiosInstance
) => {
    // Request interceptor 
    api.interceptors.request.use(
        (config) => config, // cookies auto-handled by browser
        (error) => Promise.reject(error)
    );

    // Response interceptor (handles token refresh)
    api.interceptors.response.use(
        (response) => response,

        async (error: AxiosError) => {
            if (!error.config) return Promise.reject(error); // safety guard

            const originalRequest = error.config as RetryableRequest;

            const is401 = error.response?.status === 401;
            const isRetry = originalRequest._retry === true;

            const isRefreshEndpoint =
                originalRequest.url === '/auth/refresh-token';

            const isAuthEndpoint =
                originalRequest.url === '/auth/login' ||
                originalRequest.url === '/auth/register' ||
                originalRequest.url === '/auth/social-login';

            // Only retry valid 401 cases
            if (!is401 || isRetry || isRefreshEndpoint || isAuthEndpoint) {
                if (is401) {
                    console.warn(
                        '[Auth] 401 detected but skipping retry (Auth entry point or retry limit reached):',
                        {
                            url: originalRequest.url,
                            isRetry,
                            isAuthEndpoint,
                        }
                    );
                }

                return Promise.reject(error);
            }

            console.log(
                '[Auth] 401 detected. Attempting token refresh for:',
                originalRequest.url
            );

            originalRequest._retry = true; // prevent infinite loop

            // If refresh already running → wait
            if (isRefreshing) {
                console.log(
                    '[Auth] Refresh already in progress. Queueing request:',
                    originalRequest.url
                );

                return new Promise<void>((resolve, reject) => {
                    failedQueue.push({ resolve, reject }); // queue request
                })
                    .then(() => {
                        console.log(
                            '[Auth] Retrying queued request:',
                            originalRequest.url
                        );

                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            setIsRefreshing(true); // lock refresh

            try {
                console.log('[Auth] Starting token refresh call...');

                // Call refresh endpoint (no interceptor attached)
                await refreshClient.post('/auth/refresh-token');

                console.log('[Auth] Token refresh successful.');

                processQueue(null); // retry all queued requests

                console.log(
                    '[Auth] Retrying original request:',
                    originalRequest.url
                );

                return api(originalRequest); // retry original request
            } catch (refreshError) {
                console.error(
                    '[Auth] Token refresh failed:',
                    (refreshError as Error).message
                );

                processQueue(refreshError as AxiosError); // fail all queued

                // Notify app to logout (decoupled approach)
                window.dispatchEvent(new Event('auth:logout'));

                return Promise.reject(refreshError);
            } finally {
                setIsRefreshing(false); // release lock
            }
        }
    );
};