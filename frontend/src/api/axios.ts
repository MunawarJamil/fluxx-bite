import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Extend request config to track retries
interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Main API instance (used everywhere)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  withCredentials: true, // send HttpOnly cookies
  timeout: 10000, // prevent hanging requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Separate client for refresh (no interceptors → avoids loops)
const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
});

// Track refresh state to avoid multiple calls
let isRefreshing = false;

// Queue requests that fail during refresh
let failedQueue: {
  resolve: () => void;
  reject: (reason?: unknown) => void;
}[] = [];

// Resolve/reject all queued requests after refresh
const processQueue = (error: AxiosError | null) => {
  console.log(`[Auth] Processing queue of ${failedQueue.length} requests. Error:`, error ? error.message : 'none');
  failedQueue.forEach((p) => {
    error ? p.reject(error) : p.resolve();
  });
  failedQueue = [];
};

// Request interceptor (kept minimal intentionally)
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
    const isRefreshEndpoint = originalRequest.url === '/auth/refresh-token';

    // Only retry valid 401 cases
    if (!is401 || isRetry || isRefreshEndpoint) {
      if (is401) {
        console.warn('[Auth] 401 detected but skipping retry:', { isRetry, isRefreshEndpoint });
      }
      return Promise.reject(error);
    }

    console.log('[Auth] 401 detected. Attempting token refresh for:', originalRequest.url);
    originalRequest._retry = true; // prevent infinite loop

    // If refresh already running → wait
    if (isRefreshing) {
      console.log('[Auth] Refresh already in progress. Queueing request:', originalRequest.url);
      return new Promise<void>((resolve, reject) => {
        failedQueue.push({ resolve, reject }); // queue request
      })
        .then(() => {
          console.log('[Auth] Retrying queued request:', originalRequest.url);
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true; // lock refresh

    try {
      console.log('[Auth] Starting token refresh call...');
      // Call refresh endpoint (no interceptor attached)
      await refreshClient.post('/auth/refresh-token');
      console.log('[Auth] Token refresh successful.');

      processQueue(null); // retry all queued requests

      console.log('[Auth] Retrying original request:', originalRequest.url);
      return api(originalRequest); // retry original request
    } catch (refreshError) {
      console.error('[Auth] Token refresh failed:', (refreshError as Error).message);
      processQueue(refreshError as AxiosError); // fail all queued

      // Notify app to logout (decoupled approach)
      window.dispatchEvent(new Event('auth:logout'));

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false; // release lock
    }
  }
);

export default api;