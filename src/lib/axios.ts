import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor for auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from local storage or wherever you store it
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const response = error.response;
    
    if (response) {
      // Handle different status codes
      switch (response.status) {
        case 401:
          // Unauthorized - log out user
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          toast.error('Session expired. Please log in again.');
          break;
          
        case 403:
          // Forbidden
          toast.error('You do not have permission to perform this action.');
          break;
          
        case 404:
          // Not found
          toast.error('Resource not found.');
          break;
          
        case 422:
          // Validation error
          const validationErrors = response.data?.errors;
          if (validationErrors) {
            // Handle validation errors
            Object.values(validationErrors).forEach((error: any) => {
              if (Array.isArray(error)) {
                error.forEach((e) => toast.error(e));
              } else {
                toast.error(error);
              }
            });
          } else {
            toast.error(response.data?.message || 'Validation failed.');
          }
          break;
          
        case 500:
          // Server error
          toast.error('Server error. Please try again later.');
          break;
          
        default:
          // Other errors
          toast.error(response.data?.message || 'An error occurred. Please try again.');
      }
    } else {
      // Network error
      toast.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance; 