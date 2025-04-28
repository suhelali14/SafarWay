import axios from 'axios';
import { TourPackage } from '../api';

import { packageCache } from '../../lib/cache/redis';
import { getToken } from '../../utils/session';
import { compress, decompress } from '../../utils/compression';
import { PackageFilters } from './packageService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Response types
export interface PackageBasicResponse {
  id: string;
  title: string;
  subtitle?: string;
  summary: string;
  description: string;
  price: number;
  discountPrice?: number;
  destination: string;
  duration: number;
  tourType: string;
  coverImage?: string;
  startDate: string;
  endDate: string;
  agencyId: string;
  images: string[];
}

export interface PackageDetailsResponse {
  inclusions: string[];
  exclusions: string[];
  itinerary: any[];
  highlights: string[];
  minCapacity: number;
  maxGroupSize: number;
  cancellationPolicy: string;
  additionalInfo: string;
  difficultyLevel: string;
  isFlexible: boolean;
}

export interface PackageReview {
  id: string;
  userId: string;
  packageId: string;
  rating: number;
  comment: string;
  userName: string;
  userAvatar?: string;
  createdAt: string;
}

export interface AgencyInfo {
  id: string;
  name: string;
  logo?: string;
  description: string;
  rating: number;
  reviewCount: number;
  contactInfo: {
    email: string;
    phone: string;
    whatsapp?: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// Create axios instance with improved config for better performance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Encoding': 'gzip, deflate, br',
  },
  timeout: 15000, // Increased from 10s to 15s to prevent premature timeouts
  // Enable keep-alive for connection reuse
  withCredentials: true, 
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add timestamp to prevent browser caching
    config.params = { 
      ...config.params,
      _t: Date.now() 
    };
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Implement retry logic for network errors or 5xx errors
    const { config, response } = error;
    
    // Don't retry if we've already tried once or if it's not a server/network error
    if (config.__isRetry || (response && response.status < 500)) {
      return Promise.reject(error);
    }
    
    // Retry once for server errors or network issues
    config.__isRetry = true;
    
    // Wait a bit before retrying
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return api(config);
  }
);

/**
 * Convert API filters to a string for cache key
 */
const getFilterString = (filters: PackageFilters): string => {
  return Object.entries(filters)
    .filter(([_, value]) => value !== undefined)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
};

/**
 * Optimized Package Service
 */
export const optimizedPackageService = {
  /**
   * Get all packages with caching, compression, and pagination
   */
  async getAllPackages(filters: PackageFilters = {}): Promise<PaginatedResponse<TourPackage>> {
    const filterString = getFilterString(filters);
    
    // Try to get from cache first
    const cachedData = await packageCache.getPackageList(filterString);
    if (cachedData) {
      return decompress(cachedData);
    }
    
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
      
      // Expanded field selection to be more specific about what we need
      params.append('fields', 'id,title,summary,price,discountPrice,destination,duration,tourType,coverImage,startDate,endDate,agencyId,images,minCapacity,maxCapacity');
      
      // Set a smaller limit if not specified to reduce payload size
      if (!params.has('limit')) {
        params.append('limit', '12');
      }
      
      // Add request timeout to abort long-running requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const response = await api.get('/packages', { 
        params,
        signal: controller.signal 
      });
      
      clearTimeout(timeoutId);
      const result = response.data;
      
      // Cache the compressed result
      await packageCache.setPackageList(filterString, compress(result));
      
      return result;
    } catch (error) {
      console.error('Error fetching packages:', error);
      
      
      
      throw error;
    }
  },
  
  /**
   * Get basic package information
   */
  async getPackageBasic(id: string): Promise<TourPackage> {
    // Try to get from cache first
    const cachedData = await packageCache.getPackage(id);
    if (cachedData) {
      return decompress(cachedData);
    }
    
    try {
      // Only request essential fields with expanded field selection
      const params = new URLSearchParams();
      params.append('fields', 'id,title,subtitle,summary,description,price,discountPrice,destination,duration,tourType,coverImage,startDate,endDate,agencyId,images,minCapacity,maxCapacity,inclusions,exclusions');
      
      // Add request timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const response = await api.get(`/packages/${id}`, { 
        params,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const packageData = response.data.data;
      
      // Cache the compressed data
      await packageCache.setPackage(id, compress(packageData));
      
      return packageData;
    } catch (error) {
      console.error(`Error fetching package with ID ${id}:`, error);
      
      // If AbortError, give more specific message
     
      
      throw error;
    }
  },
  
  /**
   * Get detailed package information (separate endpoint)
   */
  async getPackageDetails(id: string): Promise<PackageDetailsResponse> {
    // Try to get from cache first
    const cachedData = await packageCache.getPackageDetails(id);
    if (cachedData) {
      return decompress(cachedData);
    }
    
    try {
      const response = await api.get(`/packages/${id}/details`);
      const detailsData = response.data.data;
      
      // Cache the compressed data
      await packageCache.setPackageDetails(id, compress(detailsData));
      
      return detailsData;
    } catch (error) {
      console.error(`Error fetching package details with ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Get package reviews (separate endpoint with pagination)
   */
  async getPackageReviews(id: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<PackageReview>> {
    const cacheKey = `${id}:${page}:${limit}`;
    
    // Try to get from cache first
    const cachedData = await packageCache.getPackageReviews(cacheKey);
    if (cachedData) {
      return decompress(cachedData);
    }
    
    try {
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('limit', String(limit));
      
      const response = await api.get(`/packages/${id}/reviews`, { params });
      const reviewsData = response.data;
      
      // Cache the compressed data
      await packageCache.setPackageReviews(cacheKey, compress(reviewsData));
      
      return reviewsData;
    } catch (error) {
      console.error(`Error fetching package reviews for ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Get agency information for a package (separate endpoint)
   */
  async getPackageAgency(id: string): Promise<AgencyInfo> {
    // Try to get from cache first
    const cachedData = await packageCache.getPackageAgency(id);
    if (cachedData) {
      return decompress(cachedData);
    }
    
    try {
      const response = await api.get(`/packages/${id}/agency`);
      const agencyData = response.data.data;
      
      // Cache the compressed data
      await packageCache.setPackageAgency(id, compress(agencyData));
      
      return agencyData;
    } catch (error) {
      console.error(`Error fetching agency for package ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Get similar packages (separate endpoint with lazy loading)
   */
  async getSimilarPackages(id: string, limit: number = 4): Promise<TourPackage[]> {
    const cacheKey = `${id}:${limit}`;
    
    // Try to get from cache first
    const cachedData = await packageCache.getSimilarPackages(cacheKey);
    if (cachedData) {
      return decompress(cachedData);
    }
    
    try {
      const params = new URLSearchParams();
      params.append('limit', String(limit));
      
      // Only request essential fields
      params.append('fields', 'id,title,summary,price,discountPrice,destination,duration,tourType,coverImage');
      
      const response = await api.get(`/packages/${id}/similar`, { params });
      const similarPackages = response.data.data;
      
      // Cache the compressed data
      await packageCache.setSimilarPackages(cacheKey, compress(similarPackages));
      
      return similarPackages;
    } catch (error) {
      console.error(`Error fetching similar packages for ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Add a review to a package
   */
  async addPackageReview(id: string, rating: number, comment: string): Promise<void> {
    try {
      await api.post(`/packages/${id}/reviews`, { rating, comment });
      
      // Invalidate the package reviews cache
      const keys = await packageCache.getPackageReviews(`${id}:*`);
      if (keys) {
        await packageCache.invalidatePackage(id);
      }
    } catch (error) {
      console.error(`Error adding review to package ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Book a package
   */
  async bookPackage(id: string, bookingData: any): Promise<{ bookingId: string }> {
    try {
      const response = await api.post(`/packages/${id}/book`, bookingData);
      return response.data.data;
    } catch (error) {
      console.error(`Error booking package ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Prefetch packages for improved user experience
   * Call this when you anticipate the user might browse packages soon
   */
  async prefetchPopularPackages(): Promise<void> {
    try {
      // Only need to prefetch if not already in cache
      const filterString = getFilterString({ limit: 12, page: 1, status: 'PUBLISHED' });
      const cachedData = await packageCache.getPackageList(filterString);
      
      if (!cachedData) {
        console.info('Prefetching popular packages');
        
        const params = new URLSearchParams();
        params.append('limit', '12');
        params.append('page', '1');
        params.append('status', 'PUBLISHED');
        params.append('fields', 'id,title,summary,price,discountPrice,destination,duration,tourType,coverImage');
        
        // Lower priority prefetching (can be aborted)
        const controller = new AbortController();
        
        // Use a longer timeout for prefetching as it's not critical
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        
        const response = await api.get('/packages', { 
          params,
          signal: controller.signal,
          headers: {
            'X-Priority': 'low'
          }
        });
        
        clearTimeout(timeoutId);
        const result = response.data;
        
        // Cache the compressed result
        await packageCache.setPackageList(filterString, compress(result));
      }
    } catch (error) {
      // Silently handle prefetch errors (don't disrupt the user)
      console.warn('Package prefetching failed:', error);
    }
  }
};

export default optimizedPackageService; 