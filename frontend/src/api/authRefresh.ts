import type { AxiosError } from 'axios';

// Track refresh state to avoid multiple calls
export let isRefreshing = false;

// Queue requests that fail during refresh
export let failedQueue: {
    resolve: () => void;
    reject: (reason?: unknown) => void;
}[] = [];

// Resolve/reject all queued requests after refresh
export const processQueue = (error: AxiosError | null) => {
    console.log(
        `[Auth] Processing queue of ${failedQueue.length} requests. Error:`,
        error ? error.message : 'none'
    );

    failedQueue.forEach((p) => {
        error ? p.reject(error) : p.resolve();
    });

    failedQueue = [];
};

// Setter helpers (important because exported let bindings should not be mutated directly everywhere)
export const setIsRefreshing = (value: boolean) => {
    isRefreshing = value;
};