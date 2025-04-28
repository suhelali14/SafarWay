import axios, { AxiosInstance } from 'axios';
import { API_URL } from '../config/constants';
import { getToken } from '../utils/session';
import { toast } from 'react-hot-toast';
import { Package } from './api/packageService';

// Types

export type PackageStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type TourType = 'ADVENTURE' | 'CULTURAL' | 'WILDLIFE' | 'BEACH' | 'MOUNTAIN' | 'CITY' | 'CRUISE' | 'OTHER';

export interface LoginCredentials {
  email: string;
  password: string;
}


interface PasswordResetData {
  id: string;
  email: string;
  oldPassword: string;
  newPassword: string;
}
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'CUSTOMER' | 'AGENCY_ADMIN' | 'AGENCY_USER';
  agencyId?: string;
}
export interface PackageDetail  {
  success: boolean;
  data: {
    data:Package[];
  };
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
export interface TourPackage {
  location: string;
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
export interface Review {
  id: string;
  userId: string;
  tourId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  tour: TourPackage;
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
  agency?: Agency;
  bookings?: Booking[];
  recentBookings?: Booking[];
  subscribedAgencies?: Agency[];
  reviews?: Review[];
  address?: string;
}

export interface Agency {
  id: string;
  name: string;
  email: string; // From contactEmail in API response
  phone: string; // From contactPhone in API response
  address: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  logo?: string | null; // Updated to allow null as per API response
  description?: string; // Can be empty string as per API response
  createdAt: string;
  updatedAt: string;
  coverImage?: string | null; // Added from API response
  verifiedBy?: string | null; // Added from API response
  verifiedAt?: string | null; // Added from API response
  media?: string[]; // Added from API response
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

// Define PackageFilters type
export interface PackageFilters {
  page?: number; // Add page property if 
  limit?: number; // Add limit property if needed
  agencyId?: string;
  tourType?: TourType;
  specialties?: string[];
  status?: string;
  destination?: string;
  priceRange?: [number, number];
  duration?: number;
  searchQuery?: string;
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
  

  inviteUser: (data: { email: string; role: string }) => api.post('/auth/invite', data),

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

  verifyTempPassword: (tempPassword: string) => 
    api.post('/auth/verify-temp-password', { tempPassword }),

  acceptInvitation: (inviteToken: string, password: string) => 
    api.post('/auth/accept-invitation', { inviteToken, password }),

  setNewPassword: (userId: string, password: string) => 
    api.post(`/auth/users/${userId}/set-password`, { password }),

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
    api.get(`/agency/packages/`, { params: filters }),
  
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
  
  getAllBookings: (filters?: string) => 
    api.get(`/agency/bookings/${filters}`),
  
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
  
  resetUserPassword: (id: string, data:PasswordResetData) =>
    api.post(`/admin/users/${id}/reset-password`, { data }),
  
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

  getReportsAdmin:(filters:string)=>
    api.get(`/admin/reports/${filters}`),

  rejectAgency: (id: string) =>
    api.patch(`/admin/agencies/${id}/reject`),
};


// Customer API
export const customerAPI = {
  // Admin-level customer management routes
  getAllCustomers: () => 
    api.get<User[]>('/customers/all'),
  
  getCustomerById: (id: string) => 
    api.get<User>(`/customers/details/${id}`),
  
  createCustomer: (customerData: Partial<User>) => 
    api.post<User>('/customers', customerData),
  
  updateCustomer: (id: string, customerData: Partial<User>) => 
    api.put<User>(`/customers/${id}`, customerData),
  
  deleteCustomer: (id: string) => 
    api.delete(`/customers/${id}`),
  
  // Customer dashboard routes
  getProfile: () => 
    api.get<User>('/customers/profile'),
  
  getMyBookings: () => 
    api.get<Booking[]>('/customers/bookings'),
  
  getOngoingTrips: () => 
    api.get<Booking[]>('/customers/trips/ongoing'),
  
  getUpcomingTrips: () => 
    api.get<Booking[]>('/customers/trips/upcoming'),
  
  getRecommendedPackages: () => 
    api.get<TourPackage[]>('/customers/packages/recommended'),
  
  getWishlist: () => 
    api.get<TourPackage[]>('/customers/wishlist'),
  
  getValidOffers: () => 
    api.get<any[]>('/customers/offers'), // Replace 'any' with specific Offer type if defined
  
  getDashboardStats: () => 
    api.get<DashboardStats>('/customers/dashboard/stats'),

  getAllPackages: () => 
    api.get('/customers/packages'),

  getPackageById: (id: string) => 
    api.get(`/packages/${id}`),

  addToWishlist: (packageId: string) => api.post(`/wishlist/${packageId}`),
  removeFromWishlist: (wishlistItemId: string) => api.delete(`/wishlist/${wishlistItemId}`),
  getFeaturedPackages: () => api.get('/packages/featured'),
};

// Tour API
export const tourAPI = {
  getAll: () => api.get('/tours'),
  create: (tourData: any) => api.post('/tours', tourData),
  update: (id: string, tourData: any) => api.put(`/tours/${id}`, tourData),
  delete: (id: string) => api.delete(`/tours/${id}`),
};

export default api;
