import axios from 'axios';
import { getToken } from '../../utils/session';
import { isApiAvailable, safeApiCall } from '../../utils/apiUtils';

// Use environment variable if available, otherwise fallback to a hardcoded URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Cache API availability check result
let apiAvailableCache: boolean | null = null;

// Check if API is available (with caching)
const checkApiAvailability = async (): Promise<boolean> => {
  if (apiAvailableCache === null) {
    apiAvailableCache = await isApiAvailable(API_URL);
  }
  return apiAvailableCache;
};

export interface Package {
  id: string;
  title: string;
  destination: string;
  description: string;
  imageUrl: string;
  images: string[];
  price: number;
  currency: string;
  rating: number;
  reviews: Array<{
    author: string;
    date: string;
    rating: number;
    comment: string;
  }>;
  features: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: Array<{
    title: string;
    description: string;
    activities?: string[];
  }>;
  duration: number;
  startDates: string[];
  availableSeats: number;
  discount?: number;
  isPopular?: boolean;
  agency: {
    id: string;
    name: string;
    logo: string;
    rating: number;
    contact: {
      email: string;
      phone: string;
    }
  };
}

export const customerAPI = {
  getDashboardSummary: async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(`${API_URL}/customers/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  },

  getMyBookings: async (params = {}) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(`${API_URL}/bookings/my-bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  getFeaturedPackages: async () => {
    try {
      // Check if API is available
      const apiAvailable = await checkApiAvailability();
      if (!apiAvailable) {
        throw new Error('API not available');
      }
      
      // For public endpoints, token is optional
      const token = getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(`${API_URL}/packages/featured`, {
        headers,
      });

      // If the API request succeeds, return the data
      return {
        data: response.data?.data || response.data || []
      };
    } catch (error) {
      console.error('Error fetching featured packages:', error);
      // Fall back to mock data for development/testing
      const mockData = [
        {
          id: 'pkg-1',
          title: 'Bali Adventure: Ultimate Island Experience',
          destination: 'Bali, Indonesia',
          description: 'Experience the ultimate Bali adventure with this 7-day all-inclusive package.',
          imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
          images: [],
          price: 1299,
          currency: 'INR',
          rating: 4.8,
          reviews: [],
          features: ['All Inclusive', 'Beach', 'Guided Tours'],
          inclusions: ['Airport transfers', 'All accommodations'],
          exclusions: ['International airfare', 'Travel insurance'],
          itinerary: [],
          duration: 7,
          startDates: ['2023-12-06', '2023-12-13'],
          availableSeats: 20,
          discount: 15,
          isPopular: true,
          agency: {
            id: 'agency-1',
            name: 'Bali Travel Experts',
            logo: 'https://via.placeholder.com/150',
            rating: 4.9,
            contact: {
              email: 'contact@example.com',
              phone: '+1234567890'
            }
          }
        },
        {
          id: 'pkg-2',
          title: 'Tokyo Explorer: The Japanese Experience',
          destination: 'Tokyo, Japan',
          description: 'Explore the vibrant city of Tokyo with this 5-day cultural tour.',
          imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26',
          images: [],
          price: 1599,
          currency: 'INR',
          rating: 4.7,
          reviews: [],
          features: ['Cultural', 'City Tour', 'Food Experience'],
          inclusions: ['Guided tours', 'Hotel accommodations'],
          exclusions: ['International flights', 'Personal expenses'],
          itinerary: [],
          duration: 5,
          startDates: ['2023-12-10', '2023-12-24'],
          availableSeats: 15,
          agency: {
            id: 'agency-1',
            name: 'Asian Adventures',
            logo: 'https://via.placeholder.com/150',
            rating: 4.8,
            contact: {
              email: 'contact@example.com',
              phone: '+1234567890'
            }
          }
        }
      ];
      return { data: mockData };
    }
  },

  getPackageById: async (id: string) => {
    try {
      // Check if API is available
      const apiAvailable = await checkApiAvailability();
      if (!apiAvailable) {
        throw new Error('API not available');
      }
      
      // For public endpoints, token is optional
      const token = getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(`${API_URL}/packages/${id}`, {
        headers,
      });

      // Return the data directly to be consistent with other API functions
      return {
        data: response.data?.data || response.data || {}
      };
    } catch (error) {
      console.error(`Error fetching package with ID ${id}:`, error);
      
      // Provide fallback mock data for development/testing
      return {
        data: {
          id,
          title: 'Bali Adventure: Ultimate Island Experience',
          destination: 'Bali, Indonesia',
          description: 'Experience the ultimate Bali adventure with this 7-day all-inclusive package. Explore stunning beaches, ancient temples, lush rice terraces, and vibrant cultural experiences.',
          imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
          images: [
            'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
            'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b'
          ],
          price: 1299,
          currency: 'INR',
          rating: 4.8,
          reviews: [
            {
              author: 'Jane Smith',
              date: '2023-08-15',
              rating: 5,
              comment: 'Amazing experience!'
            }
          ],
          features: ['All Inclusive', 'Beach', 'Guided Tours', 'Meals Included'],
          inclusions: [
            'Airport transfers',
            'All accommodations (6 nights)',
            'Daily breakfast, 4 lunches, 3 dinners'
          ],
          exclusions: [
            'International airfare',
            'Travel insurance',
            'Personal expenses'
          ],
          itinerary: [
            {
              title: 'Arrival & Welcome Dinner',
              description: 'Arrive at Ngurah Rai International Airport. Transfer to your hotel in Seminyak.'
            },
            {
              title: 'Beaches & Sunset',
              description: 'Morning at Seminyak Beach. Afternoon visit to Tanah Lot Temple.'
            }
          ],
          duration:
          7,
          startDates: [
            '2023-12-06',
            '2023-12-13',
            '2023-12-20',
            '2024-01-10'
          ],
          availableSeats: 20,
          discount: 15,
          isPopular: true,
          agency: {
            id: 'agency-1',
            name: 'Bali Travel Experts',
            logo: 'https://via.placeholder.com/150',
            rating: 4.9,
            contact: {
              email: 'contact@balitravelexperts.com',
              phone: '+1234567890'
            }
          }
        }
      };
    }
  },

  getPopularDestinations: async () => {
    try {
      const response = await axios.get(`${API_URL}/destinations/popular`);
      return response;
    } catch (error) {
      console.error('Error fetching popular destinations:', error);
      throw error;
    }
  },

  getWishlist: async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(`${API_URL}/customers/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response;
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      throw error;
    }
  },

  addToWishlist: async (packageId: string) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.post(
        `${API_URL}/customers/wishlist`,
        { packageId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  },

  removeFromWishlist: async (packageId: string) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.delete(`${API_URL}/customers/wishlist/${packageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  }
}; 