import axios from 'axios';
import { setupInterceptors } from './interceptors';

// Main API instance (used everywhere)
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:5000/api/v1',

  withCredentials: true, // send HttpOnly cookies
  timeout: 10000, // prevent hanging requests

  headers: {
    'Content-Type': 'application/json',
  },
});

// Separate client for refresh (no interceptors → avoids loops)
export const refreshClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:5000/api/v1',

  withCredentials: true,
});

// Attach interceptors
setupInterceptors(api, refreshClient);

export default api;