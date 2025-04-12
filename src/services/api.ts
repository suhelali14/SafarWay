import axios from 'axios';
import { getToken, clearSession } from '../utils/session';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'CUSTOMER' | 'AGENCY_ADMIN' | 'AGENCY_USER';
  agencyId?: string;
}

export interface TourPackage {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  location: string;
  startDate: string;
  maxParticipants: number;
  currentParticipants: number;
  status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED';
  images: string[];
}

export interface Booking {
  id: string;
  tourId: string;
  userId: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  numberOfParticipants: number;
  totalAmount: number;
  bookingDate: string;
  tourDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tour: TourPackage;
}

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
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
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
      url: error.config?.url
    });

    if (error.response?.status === 401) {
      clearSession();
      window.location.href = '/login';
    } else if (error.response?.status === 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error('An error occurred. Please try again.');
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials: LoginCredentials) => 
    api.post('/auth/login', credentials),
  registerCustomer: (userData: Omit<RegisterData, 'role'>) => 
    api.post('/auth/register/customer', userData),
  registerAgency: (userData: Omit<RegisterData, 'role'>) => 
    api.post('/auth/register/agency', userData),
  registerAgencyUser: (userData: Omit<RegisterData, 'role'>) => 
    api.post('/auth/register/agency-user', userData),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data: Partial<RegisterData>) => api.patch('/auth/profile', data),
};

// Tour Package APIs
export const tourAPI = {
  getAll: (params?: any) => api.get('/packages', { params }),
  getById: (id: string) => api.get(`/packages/${id}`),
  create: (data: Partial<TourPackage>) => api.post('/packages', data),
  update: (id: string, data: Partial<TourPackage>) => api.put(`/packages/${id}`, data),
  delete: (id: string) => api.delete(`/packages/${id}`),
  search: (params: any) => api.get('/packages/search', { params }),
};

// Booking APIs
export const bookingAPI = {
  getAll: (params?: any) => api.get('/bookings', { params }),
  getById: (id: string) => api.get(`/bookings/${id}`),
  create: (data: Partial<Booking>) => api.post('/bookings', data),
  update: (id: string, data: Partial<Booking>) => api.put(`/bookings/${id}`, data),
  updateStatus: (id: string, status: Booking['status']) => 
    api.patch(`/bookings/${id}/status`, { status }),
  getCustomerBookings: () => api.get('/bookings/customer/bookings'),
};

// Customer APIs
export const customerAPI = {
  getAll: (params?: any) => api.get('/customers', { params }),
  getById: (id: string) => api.get(`/customers/${id}`),
  create: (data: any) => api.post('/customers', data),
  update: (id: string, data: any) => api.put(`/customers/${id}`, data),
  delete: (id: string) => api.delete(`/customers/${id}`),
  getBookings: (id: string, params?: any) => api.get(`/customers/${id}/bookings`, { params }),
};

// Upload APIs
export const uploadAPI = {
  uploadImage: (formData: FormData) => api.post('/uploads', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

// Invite APIs
export const inviteAPI = {
  create: (data: any) => api.post('/invites', data),
  completeOnboarding: (data: any) => api.post('/invites/onboard', data),
  resend: (userId: string) => api.post(`/invites/${userId}/resend`),
  revoke: (userId: string) => api.delete(`/invites/${userId}`),
};

// Message APIs
export const messageAPI = {
  getAll: (params?: any) => api.get('/messages', { params }),
  getById: (id: string) => api.get(`/messages/${id}`),
  send: (data: any) => api.post('/messages', data),
  markAsRead: (id: string) => api.put(`/messages/${id}/read`),
};

// Analytics APIs
export const analyticsAPI = {
  getDashboardStats: () => api.get('/analytics/dashboard'),
  getBookingStats: (params: any) => api.get('/analytics/bookings', { params }),
  getRevenueStats: (params: any) => api.get('/analytics/revenue', { params }),
};

// Team APIs
export const teamAPI = {
  getAll: () => api.get('/team'),
  getById: (id: string) => api.get(`/team/${id}`),
  create: (data: any) => api.post('/team', data),
  update: (id: string, data: any) => api.put(`/team/${id}`, data),
  delete: (id: string) => api.delete(`/team/${id}`),
};

// Settings APIs
export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (data: any) => api.put('/settings', data),
};

export default api; 