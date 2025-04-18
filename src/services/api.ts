import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_URL } from '../config/constants';
import { getToken } from '../utils/session';
import { toast } from 'react-hot-toast';

// Types

export type PackageStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type TourType = 'ADVENTURE' | 'CULTURAL' | 'WILDLIFE' | 'BEACH' | 'MOUNTAIN' | 'CITY' | 'CRUISE' | 'OTHER';

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
  name?: string;
  subtitle?: string;
  summary?: string;
  description: string;
  price?: number;
  pricePerPerson: number;
  discountPrice?: number;
  duration: number;
  destination: string;
  validFrom?: string;
  validTill?: string;
  startDate: string;
  endDate: string;
  minCapacity: number;
  minimumAge?: number;
  maxPeople: number;
  maxGroupSize?: number;
  maximumPeople?: number;
  tourType: TourType;
  packageType?: string;
  status: PackageStatus;
  inclusions: string[];
  exclusions: string[];
  includedItems?: string[];
  excludedItems?: string[];
  highlights?: string[];
  coverImage?: string;
  images: string[];
  galleryImages?: string[];
  phoneNumber?: string;
  email?: string;
  whatsapp?: string;
  cancellationPolicy?: string;
  cancelationPolicy?: string;
  additionalInfo?: string;
  difficultyLevel?: string;
  isFlexible?: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  agencyId: string;
  itinerary?: any[];
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
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
  refundRequested: boolean;
  refundStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'CUSTOMER' | 'AGENCY_ADMIN' | 'AGENCY_USER' | 'SAFARWAY_ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Agency {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  logo?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RefundRequest {
  id: string;
  bookingId: string;
  userId: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalAgencies: number;
  totalBookings: number;
  totalRevenue: number;
  totalPackages: number;
  refundRequests: number;
  supportTickets: number;
  recentBookings: Booking[];
  recentUsers: User[];
}

export interface AgencyDashboardStats {
  totalPackages: number;
  totalBookings: number;
  totalRevenue: number;
  recentBookings: Booking[];
  recentCustomers: User[];
}

export interface RevenueData {
  total: number;
  daily: { date: string; amount: number }[];
  weekly: { week: string; amount: number }[];
  monthly: { month: string; amount: number }[];
  currency: string;
}

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Add request interceptor to add auth token
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

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Redirect to login page
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

// Auth API
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  registerCustomer: (userData: any) => 
    api.post('/auth/register/customer', userData),
  
  registerAgency: (agencyData: any) => 
    api.post('/auth/register/agency', agencyData),
  
  registerAgencyUser: (userData: any) => 
    api.post('/auth/register/agency-user', userData),
  
  getCurrentUser: async () => {
    console.log('Fetching current user...');
    try {
      const response = await api.get('/auth/me');
      console.log('Current user response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },
  
  verifyToken: () => 
    api.get('/auth/verify'),
  
  updateProfile: (userData: any) => 
    api.patch('/auth/profile', userData),
};

// Agency API
export const agencyAPI = {
  getProfile: () => 
    api.get('/agency/profile'),
  
  updateProfile: (profileData: any) => 
    api.put('/agency/profile', profileData),
  
  getDashboardSummary: (timeRange: string = 'week') => 
    api.get('/agency/dashboard/summary', { params: { timeRange } }),
  
  getAllPackages: (filters: PackageFilters) => 
    api.get('/agency/packages', { params: filters }),
  
  getPackageById: (id: string) => 
    api.get(`/agency/packages/${id}`),
  
  createPackage: (packageData: FormData) => 
    api.post('/agency/packages', packageData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  updatePackage: (id: string, packageData: FormData) => 
    api.put(`/agency/packages/${id}`, packageData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  deletePackage: (id: string) => 
    api.delete(`/agency/packages/${id}`),
  
  getAllBookings: (status?: string) => 
    api.get('/agency/bookings', { params: { status } }),
  
  getBookingById: (id: string) => 
    api.get(`/agency/bookings/${id}`),
  
  updateBookingStatus: (id: string, status: string) => 
    api.patch(`/agency/bookings/${id}/status`, { status }),
  
  getRefundRequests: (status?: string) => 
    api.get('/agency/refunds', { params: { status } }),
  
  processRefundRequest: (id: string, status: string, remarks?: string) => 
    api.patch(`/agency/refunds/${id}`, { status, remarks }),
};

// Admin API
export const adminAPI = {
  getDashboardSummary: () => 
    api.get('/admin/dashboard/summary'),
  
  getAllUsers: () => 
    api.get('/admin/users'),
  
  getUserById: (id: string) => 
    api.get(`/admin/users/${id}`),
  
  createUser: (userData: any) => 
    api.post('/admin/users', userData),
  
  updateUser: (id: string, userData: any) => 
    api.put(`/admin/users/${id}`, userData),
  
  deleteUser: (id: string) => 
    api.delete(`/admin/users/${id}`),
  
  getAllAgencies: () => 
    api.get('/admin/agencies'),
  
  getAgencyById: (id: string) => 
    api.get(`/admin/agencies/${id}`),
  
  createAgency: (agencyData: any) => 
    api.post('/admin/agencies', agencyData),
  
  updateAgency: (id: string, agencyData: any) => 
    api.put(`/admin/agencies/${id}`, agencyData),
  
  approveAgency: (id: string) => 
    api.patch(`/admin/agencies/${id}/approve`),
  
  suspendAgency: (id: string) => 
    api.patch(`/admin/agencies/${id}/suspend`),
  
  getAllBookings: () => 
    api.get('/admin/bookings'),
  
  getBookingById: (id: string) => 
    api.get(`/admin/bookings/${id}`),
  
  updateBookingStatus: (id: string, status: string) => 
    api.patch(`/admin/bookings/${id}/status`, { status }),
  
  getRefundRequests: () => 
    api.get('/admin/refunds'),
  
  approveRefund: (id: string, remarks?: string) => 
    api.patch(`/admin/refunds/${id}/approve`, { remarks }),
  
  rejectRefund: (id: string, remarks?: string) => 
    api.patch(`/admin/refunds/${id}/reject`, { remarks }),
};

export default api; 
