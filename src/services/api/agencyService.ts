import axios from 'axios';
import { getToken } from '../../utils/session';
import { Package } from './packageService';
import { User } from '../../types/user';
import { mockDashboardSummary, mockAgencyProfile, mockReviews } from './mockAgencyService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' || true;

// Types
export interface DashboardSummary {
  totalBookings: number;
  totalRevenue: number;
  totalPackages: number;
  activePackages: number;
  upcomingPackages: number;
  pendingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  monthlyRevenue: number;
  totalCustomers: number;
  recentBookings: RecentBooking[];
  packages: PackagePerformance[];
  chartData: ChartDataPoint[];
}

export interface RecentBooking {
  id: string;
  customer: string;
  package: string;
  destination: string;
  status: string;
  amount: number;
  date: string;
}

export interface PackagePerformance {
  id: string;
  title: string;
  validFrom: string;
  validTill: string;
  bookingsCount: number;
  status: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface Booking {
  id: string;
  userId: string;
  tourPackageId: string;
  startDate: string;
  endDate: string;
  numberOfPeople: number;
  totalPrice: number;
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED';
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
  user?: User;
  tourPackage?: Package;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
  booking?: Booking;
}

export interface AgencyProfile {
  id: string;
  name: string;
  description: string;
  logo: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  city: string;
  country: string;
  website: string;
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface BookingFilters {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface PaymentFilters {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
}

// Get agency dashboard summary
export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  try {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockDashboardSummary();
    }

    const token = getToken();
    const response = await axios.get(`${API_URL}/agency/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    throw error;
  }
};

// Get agency bookings with pagination and filters
export const getBookings = async (filters: BookingFilters = {}): Promise<PaginatedResponse<Booking>> => {
  try {
    const token = getToken();
    
    // Build URL with query parameters
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.search) params.append('search', filters.search);
    
    const queryString = params.toString();
    
    const response = await axios.get(
      `${API_URL}/agency/bookings${queryString ? `?${queryString}` : ''}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching agency bookings:', error);
    throw error;
  }
};

// Get a single booking by ID
export const getBookingById = async (bookingId: string): Promise<Booking> => {
  try {
    const token = getToken();
    const response = await axios.get(
      `${API_URL}/agency/bookings/${bookingId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching booking details:', error);
    throw error;
  }
};

// Update booking status
export const updateBookingStatus = async (bookingId: string, status: string): Promise<Booking> => {
  try {
    const token = getToken();
    const response = await axios.put(
      `${API_URL}/agency/bookings/${bookingId}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data.data;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

// Get agency payments with pagination and filters
export const getPayments = async (filters: PaymentFilters = {}): Promise<PaginatedResponse<Payment>> => {
  try {
    const token = getToken();
    
    // Build URL with query parameters
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    
    const queryString = params.toString();
    
    const response = await axios.get(
      `${API_URL}/agency/payments${queryString ? `?${queryString}` : ''}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching agency payments:', error);
    throw error;
  }
};

// Get agency profile
export const getProfile = async (): Promise<AgencyProfile> => {
  try {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockAgencyProfile();
    }

    const token = getToken();
    const response = await axios.get(`${API_URL}/agency/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching agency profile:', error);
    throw error;
  }
};

// Update agency profile
export const updateProfile = async (profileData: Partial<AgencyProfile>): Promise<AgencyProfile> => {
  try {
    const token = getToken();
    const response = await axios.put(
      `${API_URL}/agency/profile`,
      profileData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data.data;
  } catch (error) {
    console.error('Error updating agency profile:', error);
    throw error;
  }
};

// Get list of all agencies (for admin users)
export const getAgenciesList = async (): Promise<{ id: string; name: string }[]> => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/agency/agencies/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching agencies list:', error);
    throw error;
  }
};

// Get agency reviews
export const getAgencyReviews = async (): Promise<Review[]> => {
  try {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockReviews();
    }

    const token = getToken();
    const response = await axios.get(`${API_URL}/agency/reviews`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching agency reviews:', error);
    throw error;
  }
};

// Export functions as a single object
export const agencyService = {
  getDashboardSummary,
  getBookings,
  getBookingById,
  updateBookingStatus,
  getPayments,
  getProfile,
  updateProfile,
  getAgenciesList,
  getAgencyReviews,
}; 