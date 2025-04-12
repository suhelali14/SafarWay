import api from './axios';

export interface TourPackage {
  id: string;
  title: string;
  subtitle: string;
  duration: number;
  maxGroupSize: number;
  pricePerPerson: number;
  tourType: 'ADVENTURE' | 'CULTURAL' | 'WILDLIFE' | 'BEACH' | 'MOUNTAIN' | 'CITY' | 'CRUISE';
  description: string;
  highlights: string[];
  includedItems: string[];
  excludedItems: string[];
  coverImage: string;
  galleryImages: string[];
  phoneNumber: string;
  email: string;
  whatsapp: string;
  cancellationPolicy: string;
  additionalInfo: string;
  agencyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TourPackageFilters {
  type?: TourPackage['tourType'];
  minPrice?: number;
  maxPrice?: number;
  duration?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export const toursApi = {
  getAll: (filters?: TourPackageFilters) =>
    api.get('/tour-packages', { params: filters }),

  getById: (id: string) =>
    api.get(`/tour-packages/${id}`),

  create: (data: Omit<TourPackage, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post('/tour-packages', data),

  update: (id: string, data: Partial<TourPackage>) =>
    api.put(`/tour-packages/${id}`, data),

  delete: (id: string) =>
    api.delete(`/tour-packages/${id}`),

  uploadImage: (formData: FormData) =>
    api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
}; 