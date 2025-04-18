import { AxiosResponse } from 'axios';
import { Package } from './customerAPI';
import { Booking } from '../../components/home/RecentBookings';

export interface CustomerAPI {
  getDashboardSummary: () => Promise<AxiosResponse<any>>;
  getMyBookings: (params?: any) => Promise<any>;
  getFeaturedPackages: () => Promise<{ data: Package[] }>;
  getPackageById: (id: string) => Promise<{ data: Package }>;
  getPopularDestinations: () => Promise<AxiosResponse<any>>;
  getWishlist: () => Promise<{ data: Package[] }>;
  addToWishlist: (packageId: string) => Promise<AxiosResponse<any>>;
  removeFromWishlist: (packageId: string) => Promise<AxiosResponse<any>>;
}

export const customerAPI: CustomerAPI;
export const tourAPI: any;
export const bookingAPI: any;
export const agencyUserService: any;
export const agencyService: any;
export const packageService: any;
export const adminAPI: any; 