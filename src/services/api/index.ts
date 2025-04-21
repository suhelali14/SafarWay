import { agencyUserService } from './agencyUserService';
import { agencyService } from './agencyService';
import { packageService } from './packageService';
import { adminAPI } from './adminAPI';
import * as customerAPIModule from './customerAPI';
import { customerPackages } from './customerPackages';

// Create a complete customerAPI object with all methods
const customerAPI = {
  ...customerAPIModule.customerAPI,
  getFeaturedPackages: customerAPIModule.customerAPI.getFeaturedPackages,
  getPackageById: customerAPIModule.customerAPI.getPackageById,
  getWishlist: customerAPIModule.customerAPI.getWishlist,
  addToWishlist: customerAPIModule.customerAPI.addToWishlist,
  removeFromWishlist: customerAPIModule.customerAPI.removeFromWishlist
};

// Create a tourAPI alias from the packageService for backward compatibility
export const tourAPI = {
  getAll: () => packageService.getAgencyPackages('current', {}),
  getById: (id: string) => packageService.getPackageById('current', id),
  create: (data: any) => packageService.createPackage('current', data),
  update: (id: string, data: any) => packageService.updatePackage('current', id, data),
  delete: (id: string) => packageService.deletePackage('current', id),
};

// Create a bookingAPI for backward compatibility
export const bookingAPI = {
  getAll: () => Promise.resolve({ data: { items: [] } }),
  getById: (id: string) => Promise.resolve({ data: {} }),
  create: (data: any) => Promise.resolve({ data: {} }),
  update: (id: string, data: any) => Promise.resolve({ data: {} }),
  delete: (id: string) => Promise.resolve({ data: {} }),
};

// Export all services
export {
  agencyUserService,
  agencyService,
  packageService,
  adminAPI,
  customerAPI,
  customerPackages,
};