import axios from 'axios';
import { handleApiError } from '../lib/errorHandling';

const API_URL = import.meta.env.VITE_API_URL;

export interface Agency {
  name: string;
  email: string;
  phone: string;
}

export interface Destination {
  id: string;
  name: string;
  description?: string;
}

export interface Inclusion {
  id: string;
  name: string;
  description?: string;
}

export interface Exclusion {
  id: string;
  name: string;
  description?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals: any;
  accommodation: any;
  activities: any;
}

export interface PackageExportData {
  packageDetails: {
    title: string;
    description: string;
    summary?: string;
    price: number;
    duration: number;
    priceType?: string;
    minimumAge?: number;
    maximumPeople?: number;
    startDate?: string;
    endDate?: string;
    isFlexible?: boolean;
    status: string;
    difficultyLevel?: string;
    cancelationPolicy?: string;
  };
  agency: Agency;
  destinations: Destination[];
  inclusions: Inclusion[];
  exclusions: Exclusion[];
  itinerary: ItineraryDay[];
}

export const agencyService = {
  processRefundRequest: async (refundId: string, status: string, remarks?: string) => {
    try {
      const response = await axios.patch(
        `${API_URL}/agency/refunds/${refundId}`,
        { status, remarks },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data.refundRequest;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Export package data
   */
  exportPackage: async (packageId: string): Promise<PackageExportData> => {
    try {
      const response = await axios.get(
        `${API_URL}/agency/packages/${packageId}/export`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};