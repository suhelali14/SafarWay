import { getToken } from '../../utils/session';
import { Booking } from '../../components/home/RecentBookings';
import axios from 'axios';

// Use window.env if available, otherwise fallback to a hardcoded URL
const API_URL = 'http://localhost:3000/api';

export interface BookingFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface PaginatedBookingResponse {
  data: Booking[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export const bookingService = {
  async getMyBookings(filters: BookingFilters = {}): Promise<PaginatedBookingResponse> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(`${API_URL}/bookings/my-bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          ...filters,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  async getRecentBookings(limit = 5): Promise<Booking[]> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(`${API_URL}/bookings/my-bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          limit,
          page: 1,
          sort: 'bookingDate',
          order: 'desc',
        },
      });

      return response.data.data;
    } catch (error) {
      console.error('Error fetching recent bookings:', error);
      throw error;
    }
  },

  async getBookingById(bookingId: string): Promise<Booking> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(`${API_URL}/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error(`Error fetching booking with ID ${bookingId}:`, error);
      throw error;
    }
  },

  async cancelBooking(bookingId: string): Promise<Booking> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.patch(
        `${API_URL}/bookings/${bookingId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(`Error cancelling booking with ID ${bookingId}:`, error);
      throw error;
    }
  },

  async createBooking(bookingData: {
    packageId: string;
    startDate: string;
    endDate: string;
    participants: number;
    specialRequests?: string;
  }): Promise<Booking> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.post(
        `${API_URL}/bookings`,
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }
}; 