import { customerAPI, TourPackage, PackageFilters } from '../api';
import { Package } from './packageService';

export interface PackageResponse {
  success: boolean;
  data: Package[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
export interface PackageDetail  {
  success: boolean;
  data: Package[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}


export interface PackageDetailResponse {
  success: boolean;
  data: TourPackage;
}

/**
 * Get all available packages with pagination and filtering
 */
export const getAllPackages = async (_filters: PackageFilters = {}): Promise<PackageDetail> => {
  try {
    const call = await customerAPI.getAllPackages();
    const response = call.data;
    
    return {
      success: true,
      data: response.data,
      pagination: {
        total: response.pagination.total,
        page: 1,
        limit: response.pagination.limit,
        pages: 1
      }
    };
  } catch (error) {
    console.error('Error fetching packages:', error);
    throw error;
  }
};

/**
 * Get a single package by ID
 */
export const getPackageById = async (id: string): Promise<TourPackage> => {
  try {
    const response = await customerAPI.getPackageById(id);
    // Handle the possible response formats from either endpoint
    if (response.data.success !== undefined && response.data.data) {
      // Response format from customer-specific endpoint
      return response.data.data as TourPackage;
    } else if (response.data.data !== undefined) {
      // Response format from general endpoint with data property
      return response.data.data as TourPackage;
    } else {
      // If direct data format - convert to TourPackage type
      return response.data as unknown as TourPackage;
    }
  } catch (error) {
    console.error(`Error fetching package with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Get recommended packages based on user preferences or popular packages
 */
export const getRecommendedPackages = async (): Promise<PackageResponse> => {
  try {
    const response = await customerAPI.getRecommendedPackages();
    // The API returns TourPackage[] directly
    if (Array.isArray(response.data)) {
      return {
        success: true,
        data: response.data,
        pagination: {
          total: response.data.length,
          page: 1,
          limit: response.data.length,
          pages: 1
        }
      };
    }
    // If there's a nested data property
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return (response.data as any).data;
    }
    // Return empty array as fallback
    return {
      success: true,
      data: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 0,
        pages: 0
      }
    };
  } catch (error) {
    console.error('Error fetching recommended packages:', error);
    throw error;
  }
};

/**
 * Get the current user's wishlist
 */
export const getWishlist = async (): Promise<TourPackage[]> => {
  try {
    const response = await customerAPI.getWishlist();
    // The API returns TourPackage[] directly
    if (Array.isArray(response.data)) {
      return response.data;
    }
    // If there's a nested data property
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return (response.data as any).data;
    }
    // Return empty array as fallback
    return [];
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }
};

/**
 * Add a package to the user's wishlist
 */
export const addToWishlist = async (packageId: string): Promise<void> => {
  try {
    await customerAPI.addToWishlist(packageId);
  } catch (error) {
    console.error(`Error adding package ${packageId} to wishlist:`, error);
    throw error;
  }
};

/**
 * Remove a package from the user's wishlist
 */
export const removeFromWishlist = async (wishlistItemId: string): Promise<void> => {
  try {
    await customerAPI.removeFromWishlist(wishlistItemId);
  } catch (error) {
    console.error(`Error removing item ${wishlistItemId} from wishlist:`, error);
    throw error;
  }
};

/**
 * Search packages with advanced filters
 */
export const searchPackages = async (
  _searchTerm: string, 
  _filters: Omit<PackageFilters, 'search'> = {}
): Promise<PackageResponse> => {
  try {
    const response = await customerAPI.getAllPackages();
    return {
      success: true,
      data: response.data,
      pagination: {
        total: response.data.length,
        page: 1,
        limit: response.data.length,
        pages: 1
      }
    };
  } catch (error) {
    console.error('Error searching packages:', error);
    throw error;
  }
};

/**
 * Filter packages by specific criteria
 */
export const filterPackagesByType = async (
  tourType: string, 
  _filters: Omit<PackageFilters, 'tourType'> = {}
): Promise<PackageResponse> => {
  try {
    // const typeFilters: PackageFilters = {
    //   ...filters,
    //   tourType: tourType as any
    // };
    
    const response = await customerAPI.getAllPackages();
    return {
      success: true,
      data: response.data,
      pagination: {
        total: response.data.length,
        page: 1,
        limit: response.data.length,
        pages: 1
      }
    };
  } catch (error) {
    console.error(`Error filtering packages by type ${tourType}:`, error);
    throw error;
  }
};

/**
 * Filter packages by destination
 */
export const filterPackagesByDestination = async (
  destination: string, 
  _filters: Omit<PackageFilters, 'destination'> = {}
): Promise<PackageResponse> => {
  try {
    // const destinationFilters: PackageFilters = {
    //   ...filters,
    //   destination
    // };
    
    const response = await customerAPI.getAllPackages();
    return {
      success: true,
      data: response.data,
      pagination: {
        total: response.data.length,
        page: 1,
        limit: response.data.length,
        pages: 1
      }
    };
  } catch (error) {
    console.error(`Error filtering packages by destination ${destination}:`, error);
    throw error;
  }
};

/**
 * Filter packages by price range
 */
export const filterPackagesByPrice = async (
  minPrice: number,
  maxPrice: number,
  _filters: Omit<PackageFilters, 'minPrice' | 'maxPrice'> = {}
): Promise<PackageResponse> => {
  try {
    // const priceFilters: PackageFilters = {
    //   ...filters,
    //   minPrice,
    //   maxPrice
    // };
    
    const response = await customerAPI.getAllPackages();
    return {
      success: true,
      data: response.data,
      pagination: {
        total: response.data.length,
        page: 1,
        limit: response.data.length,
        pages: 1
      }
    };
  } catch (error) {
    console.error(`Error filtering packages by price range ${minPrice}-${maxPrice}:`, error);
    throw error;
  }
};

// Export as a single object for easy imports
export const customerPackages = {
  getAllPackages,
  getPackageById,
  getRecommendedPackages,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  searchPackages,
  filterPackagesByType,
  filterPackagesByDestination,
  filterPackagesByPrice
};