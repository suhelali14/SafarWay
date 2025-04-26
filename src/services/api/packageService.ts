import axios from 'axios';
import { getToken } from '../../utils/session';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Types
export type PackageStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type TourType = 'ADVENTURE' | 'CULTURAL' | 'WILDLIFE' | 'BEACH' | 'MOUNTAIN' | 'CITY' | 'CRUISE' | 'OTHER';

export interface Destination {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export interface Package {
  id: string;
  title: string;
  name?: string; // Kept for backward compatibility
  subtitle?: string;
  summary?: string;
  description: string;
  price?: number; // For compatibility with existing code
  pricePerPerson: number;
  discountPrice?: number;
  priceType?: string; // PER_PERSON, TOTAL
  duration: number;
  destination?: string; // Kept for backward compatibility
  destinations?: Destination[]; // Added for proper relation
  validFrom?: string;
  validTill?: string;
  startDate?: string;
  endDate?: string;
  minCapacity?: number;
  minimumAge?: number;
  maxGroupSize: number;
  maximumPeople?: number;
  tourType: TourType;
  packageType?: string; // Kept for backward compatibility
  status: PackageStatus;
  inclusions?: string[]; // Kept for backward compatibility
  exclusions?: string[]; // Kept for backward compatibility
  includedItems?: string[];
  excludedItems?: string[];
  highlights?: string[];
  coverImage?: string;
  images?: string[]; // Kept for backward compatibility
  galleryImages?: string[];
  phoneNumber?: string;
  email?: string;
  whatsapp?: string;
  cancellationPolicy?: string; // Backwards compatibility - note the spelling difference
  cancelationPolicy?: string; // As in Prisma schema
  additionalInfo?: string;
  difficultyLevel?: string;
  isFlexible?: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  agencyId: string;
  itinerary?: any[];
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

export interface PackageFilters {
  page?: number;
  limit?: number;
  status?: PackageStatus;
  package_type?: TourType;
  destination?: string;
  search?: string;
  priceMin?: number;
  priceMax?: number;
  duration?: number;
  durationMin?: number;
  durationMax?: number;
  difficultyLevel?: string;
  isFlexible?: boolean;
  startDateFrom?: string;
  startDateTo?: string;
}

// Get packages for an agency with pagination and filters
export const getAgencyPackages = async (
  agencyId: string, 
  filters: PackageFilters = {}
): Promise<PaginatedResponse<Package>> => {
  try {
    const token = getToken();
    
    // Build URL with query parameters
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.package_type) params.append('package_type', filters.package_type);
    if (filters.destination) params.append('destination', filters.destination);
    if (filters.search) params.append('search', filters.search);
    if (filters.priceMin) params.append('priceMin', filters.priceMin.toString());
    if (filters.priceMax) params.append('priceMax', filters.priceMax.toString());
    if (filters.duration) params.append('duration', filters.duration.toString());
    if (filters.durationMin) params.append('durationMin', filters.durationMin.toString());
    if (filters.durationMax) params.append('durationMax', filters.durationMax.toString());
    if (filters.difficultyLevel) params.append('difficultyLevel', filters.difficultyLevel);
    if (filters.isFlexible !== undefined) params.append('isFlexible', filters.isFlexible.toString());
    if (filters.startDateFrom) params.append('startDateFrom', filters.startDateFrom);
    if (filters.startDateTo) params.append('startDateTo', filters.startDateTo);
    
    const url = `${API_URL}/agency/packages`;
    const queryString = params.toString();
    console.log('Agency ID:', agencyId);
    console.log('Fetching packages from:', url + (queryString ? `?${queryString}` : ''));
    
    const response = await axios.get(
      url + (queryString ? `?${queryString}` : ''),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching agency packages:', error);
    throw error;
  }
};

// Get a single package by ID
export const getPackageById = async (agencyId: string, packageId: string): Promise<Package> => {
  try {
    const token = getToken();
    const response = await axios.get(
      `${API_URL}/agency/packages/${packageId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('Agency ID:', agencyId);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching package details:', error);
    throw error;
  }
};

// Create a new package
export const createPackage = async (agencyId: string, packageData: Partial<Package>): Promise<Package> => {
  try {
    const token = getToken();
    console.log("Creating package with token:", token ? "Token exists" : "No token found");
    console.log("API URL:", `${API_URL}/agency/packages`);
    
    // Create a copy to avoid modifying the original data
    const processedData = { ...packageData };
    console.log('Agency ID:', agencyId);
    // Ensure galleryImages is processed properly
    if (typeof processedData.galleryImages === 'string') {
      try {
        // If it's a JSON string, parse it
        processedData.galleryImages = JSON.parse(processedData.galleryImages);
      } catch (e) {
        console.warn("Failed to parse galleryImages string:", e);
      }
    }
    
    console.log("Processed package data:", JSON.stringify(processedData).substring(0, 200) + "...");
    
    const response = await axios.post(
      `${API_URL}/agency/packages`,
      processedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log("Package created successfully, response:", response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error creating package:', error);
    if (axios.isAxiosError(error)) {
      console.error('API Error Response:', error.response?.data);
      console.error('API Error Status:', error.response?.status);
      console.error('API Error Headers:', error.response?.headers);
    }
    throw error;
  }
};

// Update an existing package
export const updatePackage = async (
  agencyId: string, 
  packageId: string, 
  packageData: Partial<Package>
): Promise<Package> => {
  try {
    const token = getToken();
    console.log('Agency ID:', agencyId);
    // Create a copy to avoid modifying the original data
    const processedData = { ...packageData };
    
    // Ensure galleryImages is processed properly
    if (typeof processedData.galleryImages === 'string') {
      try {
        // If it's a JSON string, parse it
        processedData.galleryImages = JSON.parse(processedData.galleryImages);
      } catch (e) {
        console.warn("Failed to parse galleryImages string:", e);
      }
    }
    
    const response = await axios.put(
      `${API_URL}/agency/packages/${packageId}`,
      processedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data.data;
  } catch (error) {
    console.error('Error updating package:', error);
    throw error;
  }
};

// Delete a package
export const deletePackage = async (agencyId: string, packageId: string): Promise<void> => {
  try {
    console.log('Agency ID:', agencyId);
    const token = getToken();
    await axios.delete(
      `${API_URL}/agency/packages/${packageId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error('Error deleting package:', error);
    throw error;
  }
};

// Change package status
export const changePackageStatus = async (
  agencyId: string,
  packageId: string,
  status: PackageStatus
): Promise<Package> => {
  try {
    console.log('Agency ID:', agencyId);
    const token = getToken();
    const response = await axios.patch(
      `${API_URL}/agency/packages/${packageId}/status`,
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
    console.error('Error changing package status:', error);
    throw error;
  }
};

// Export functions as a single object
export const packageService = {
  getAgencyPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
  changePackageStatus,
}; 