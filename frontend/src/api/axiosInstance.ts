import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});
// Response interceptor acting as an automatic session-expiry watchdog
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    // Bypass redirect rules during explicit login calls so validation error states parse correctly
    if (originalRequest.url?.includes('/auth/login')) {
      return Promise.reject(error);
    }

    // Intercept 401 Unauthorized errors returned by backend security guards
    if (error.response?.status === 401) {
      console.warn("Unauthorized access detected. Session invalid or expired.");
      
      // Wipe stale persistent storage elements immediately
      localStorage.removeItem('at_ctx');
      localStorage.removeItem('rt_ctx');
      localStorage.removeItem('user_email');

      // Break out to login page with an explicit reason tag if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?session=expired';
      }
    }

    return Promise.reject(error);
  }

);