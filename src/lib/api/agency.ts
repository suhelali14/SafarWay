import api from '../api';

export interface AgencyDetails {
  id: string;
  name: string;
  description: string;
  logo?: string;
  coverImage: string;
  contactInfo: {
    email: string;
    phone: string;
    website: string;
  };
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  address: string;
  foundedYear: number;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  badges: string[];
  location: string;
  rating: number;
  reviewCount: number;
  packageCount: number;
  isVerified: boolean;
  founded: string;
}

export interface AgencyStats {
  totalCustomersServed: number;
  totalPackagesOffered: number;
  averageRating: number;
  totalBookings: number;
  yearsActive: number;
}

export interface AgencyReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  packageName?: string; // Add this property
}

export interface AgencyPackage {
  id: string;
  title: string;
  description: string;
  price: number;
  discountedPrice?: number;
  discount?: number;
  image: string;
  location: string;
  validFrom: string;
  validTill: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  featured: boolean;
  duration: number;
  maxGroupSize: number;
}

export interface AgencySearchParams {
  query?: string;
  destination?: string;
  specialties?: string[];
  minRating?: number;
  verificationStatus?: 'VERIFIED' | 'PENDING' | 'REJECTED';
  page?: number;
  limit?: number;
  sortBy?: 'rating' | 'name' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

export interface AgencySearchResponse {
  data: AgencyDetails[];
  total: number;
  totalCount: number;
  totalPages: number;
}

export const agencyApi = {
  // Get agency details
  getAgencyDetails: (agencyId: string) => 
    api.get<AgencyDetails>(`/agency/${agencyId}/details`),
  
  // Get agency statistics
  getAgencyStats: (agencyId: string) => 
    api.get<AgencyStats>(`/agency/${agencyId}/stats`),
  
  // Get agency packages
  getAgencyPackages: (agencyId: string, status?: string, page: number = 1, limit: number = 10) => 
    api.get<{ data: AgencyPackage[], total: number }>(`/agency/${agencyId}/packages`, {
      params: { status, page, limit }
    }),
  
  // Get agency reviews
  getAgencyReviews: (agencyId: string, rating?: number, page: number = 1, limit: number = 10) => 
    api.get<{ data: AgencyReview[], total: number }>(`/agency/${agencyId}/reviews`, {
      params: { rating, page, limit }
    }),
  
  // Get package count
  getPackageCount: (agencyId: string) => 
    api.get<{ count: number }>(`/agency/${agencyId}/packages/count`),
  
  // Get average rating
  getAverageRating: (agencyId: string) => 
    api.get<{ average: number }>(`/agency/${agencyId}/ratings/average`),
  
  // Bookmark/unbookmark agency
  toggleBookmark: (agencyId: string) => 
    api.post(`/user/bookmarks/agency/${agencyId}`),
  
  // Check if agency is bookmarked
  isBookmarked: (agencyId: string) => 
    api.get<{ bookmarked: boolean }>(`/user/bookmarks/agency/${agencyId}/check`),
  
  // Report agency
  reportAgency: (agencyId: string, reason: string, details: string) => 
    api.post(`/agency/${agencyId}/report`, { reason, details }),
  
  // Search agencies - updated with new parameters
  searchAgencies: (params: AgencySearchParams) => 
    api.get<AgencySearchResponse>('/agencies/search', { params }),
  
  // Get top agencies
  getTopAgencies: (limit: number = 5) => 
    api.get<AgencyDetails[]>('/agencies/top', { params: { limit } }),
  
  // Get all agencies with filtering
  getAllAgencies: (params?: {
    page?: number;
    limit?: number;
    sortBy?: 'rating' | 'packages' | 'founded';
    sortOrder?: 'asc' | 'desc';
  }) => 
    api.get<{ data: AgencyDetails[], total: number }>('/agencies', { params }),
};

export default agencyApi;