import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor to add token to every request
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor for handling authentication errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Do not auto-redirect for authentication endpoints (login/register)
      const reqUrl = error.config?.url || '';
      const isAuthEndpoint = reqUrl.includes('/users/login') || reqUrl.includes('/users/register');
      if (!isAuthEndpoint) {
        // Token expired or invalid - clear localStorage and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } else if (error.response?.status === 403) {
      // Insufficient permissions
      console.error('Access denied:', error.response.data?.message || 'You do not have permission to access this resource');
    }
    return Promise.reject(error);
  }
);

export default api;
