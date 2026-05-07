import type { InternalAxiosRequestConfig } from 'axios';

export interface RetryableRequest extends InternalAxiosRequestConfig {
    _retry?: boolean;
}