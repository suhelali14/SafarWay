import axios from 'axios';
import { Agency, TourPackage, PackageStatus } from '../api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Types

export interface AgencyPublicDetails extends Agency {
  image?: string | null; // Alias for logo
  website?: string; // Not in API response, kept as optional
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  }; // Not in API response, kept as optional
  isVerified?: boolean; // Can be derived from verifiedAt
  isFeatured?: boolean; // Not in API response, kept as optional
  isFollowed?: boolean; // Not in API response, kept as optional
  isSubscribed?: boolean; // Not in API response, kept as optional
  foundedYear?: number; // Not in API response, kept as optional
  serviceRegions?: string[]; // Not in API response, kept as optional
  license?: string; // Not in API response, kept as optional
  users?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
    profileImage?: string | null;
    provider: string;
    deviceTokens: string[];
    agencyId: string;
    inviteToken?: string | null;
    invitedByUserId?: string;
    invitedAt?: string;
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
  }[]; // Added from API response
  tourPackages?: {
    id: string;
    title: string;
    subtitle?: string | null;
    summary?: string | null;
    duration: number;
    maxGroupSize: number;
    pricePerPerson: number;
    price: number;
    discountPrice?: number | null;
    priceType?: string | null;
    tourType: string;
    description: string;
    highlights: string[];
    includedItems: string[];
    excludedItems: string[];
    minimumAge: number;
    maximumPeople: number;
    isFlexible: boolean;
    difficultyLevel?: string | null;
    startDate: string;
    endDate: string;
    validFrom: string;
    validTill: string;
    coverImage: string;
    galleryImages: string[];
    phoneNumber: string;
    email: string;
    whatsapp: string;
    cancelationPolicy?: string | null;
    additionalInfo: string;
    status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
    destination: string;
    createdAt: string;
    updatedAt: string;
    agencyId: string;
  }[]; // Added from API response
}
export interface PackageFilter {
  status?: PackageStatus;
  page?: number;
  limit?: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  isVerifiedBooking: boolean;
  createdAt: string;
  agencyResponse?: {
    response: string;
    respondedAt: string;
  }
}

export interface MediaItem {
  id: string;
  type: 'IMAGE' | 'VIDEO' | 'ANNOUNCEMENT';
  url: string;
  caption?: string;
  createdAt: string;
  likes: number;
  hasUserLiked?: boolean;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: Pagination;
}

// Get agency details
const getAgencyDetails = async (agencyId: string): Promise<AgencyPublicDetails> => {
  try {
    const response = await axios.get<ApiResponse<AgencyPublicDetails>>(
      `${API_URL}/customers/agency-public/${agencyId}/details`
    );
    const agencyDetails = response.data;
    console.log("agencyDetails",agencyDetails,response.data);
    return agencyDetails;
  } catch (error) {
    console.error('Error fetching agency details:', error);
    throw error;
  }
};

// Get agency packages with filter
const getAgencyPackages = async (
  agencyId: string, 
  filter: PackageFilter = {}
): Promise<{packages: TourPackage[]; pagination: Pagination}> => {
  try {
    // Build URL with query parameters
    const params = new URLSearchParams();
    
    if (filter.page) params.append('page', filter.page.toString());
    if (filter.limit) params.append('limit', filter.limit.toString());
    if (filter.status) params.append('status', filter.status);
    
    const queryString = params.toString();
    const url = `${API_URL}/customers/agency-public/${agencyId}/packages${queryString ? `?${queryString}` : ''}`;
    
    const response = await axios.get<ApiResponse<TourPackage[]>>(url);
    
    return {
      packages: response.data.data,
      pagination: response.data.pagination || {
        total: 0,
        page: 1,
        limit: 10,
        pages: 0
      }
    };
  } catch (error) {
    console.error('Error fetching agency packages:', error);
    throw error;
  }
};

// Get agency reviews with optional star filter
const getAgencyReviews = async (
  agencyId: string,
  starFilter?: number,
  page: number = 1,
  limit: number = 10
): Promise<{reviews: Review[]; pagination: Pagination}> => {
  try {
    const params = new URLSearchParams();
    
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (starFilter) {
      params.append('rating', starFilter.toString());
    }
    
    const response = await axios.get<ApiResponse<Review[]>>(
      `${API_URL}/customers/agency-public/${agencyId}/reviews?${params.toString()}`
    );
    
    return {
      reviews: response.data.data,
      pagination: response.data.pagination || {
        total: 0,
        page: 1,
        limit: 10,
        pages: 0
      }
    };
  } catch (error) {
    console.error('Error fetching agency reviews:', error);
    throw error;
  }
};

// Get agency media (Instagram-like wall)
const getAgencyMedia = async (
  agencyId: string,
  page: number = 1,
  limit: number = 12
): Promise<{media: MediaItem[]; pagination: Pagination}> => {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    const response = await axios.get<ApiResponse<MediaItem[]>>(
      `${API_URL}/customers/agency-public/${agencyId}/media?${params.toString()}`
    );
    
    return {
      media: response.data.data,
      pagination: response.data.pagination || {
        total: 0,
        page: 1,
        limit: 12,
        pages: 0
      }
    };
  } catch (error) {
    console.error('Error fetching agency media:', error);
    throw error;
  }
};

// Subscribe to agency updates
const subscribeToAgency = async (agencyId: string): Promise<{success: boolean; message: string}> => {
  try {
    const response = await axios.post<{success: boolean; message: string}>(
      `${API_URL}/customers/agency-public/${agencyId}/subscribe`
    );
    
    return response.data;
  } catch (error) {
    console.error('Error subscribing to agency:', error);
    throw error;
  }
};

// Unsubscribe from agency updates
const unsubscribeFromAgency = async (agencyId: string): Promise<{success: boolean; message: string}> => {
  try {
    const response = await axios.post<{success: boolean; message: string}>(
      `${API_URL}/customers/agency-public/${agencyId}/unsubscribe`
    );
    
    return response.data;
  } catch (error) {
    console.error('Error unsubscribing from agency:', error);
    throw error;
  }
};

// Like agency media item
const likeMediaItem = async (
  agencyId: string, 
  mediaId: string
): Promise<{success: boolean; likes: number}> => {
  try {
    const response = await axios.post<{success: boolean; likes: number}>(
      `${API_URL}/customers/agency-public/${agencyId}/media/${mediaId}/like`
    );
    
    return response.data;
  } catch (error) {
    console.error('Error liking media item:', error);
    throw error;
  }
};

// Unlike agency media item
const unlikeMediaItem = async (
  agencyId: string, 
  mediaId: string
): Promise<{success: boolean; likes: number}> => {
  try {
    const response = await axios.post<{success: boolean; likes: number}>(
      `${API_URL}/customers/agency-public/${agencyId}/media/${mediaId}/unlike`
    );
    
    return response.data;
  } catch (error) {
    console.error('Error unliking media item:', error);
    throw error;
  }
};

// Main export
export const agencyPublicService = {
  getAgencyDetails,
  getAgencyPackages,
  getAgencyReviews,
  getAgencyMedia,
  subscribeToAgency,
  unsubscribeFromAgency,
  likeMediaItem,
  unlikeMediaItem
}; 