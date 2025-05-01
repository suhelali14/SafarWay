declare module 'pako';

import type { ReactNode } from "react"

export interface TravelPackage {
  id: string
  title: string
  location: string
  price: string
  image: string
  duration?: string
  rating?: number
}

export interface Destination {
  id: number
  name: string
  price: string
  image: string
  badge?: string
}

export interface Feature {
  id: number
  title: string
  description: string
  icon: ReactNode
}

export interface Testimonial {
  id: number
  name: string
  photo: string
  rating: number
  text: string
}



export interface Booking {
  id: string;
  startDate: string;
  endDate?: string;
  numberOfPeople: number;
  totalPrice: number;
  platformFee: number;
  agencyPayoutAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'PENDING_APPROVAL' | 'PENDING_PAYMENT' | 'RESERVED';
  paymentStatus: 'PENDING' | 'SUCCESS' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
  paymentMethod: string;
  cashfreeOrderId: string;
  transactionId: string;
  payoutStatus: string;
  refundRequested: boolean;
  refundStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  paymentMode: 'PARTIAL' | 'FULL';
  agencyApproval: boolean;
  partialAmountPaid: boolean;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  tourPackage: {
    id: string;
    title: string;
    duration: number;
    pricePerPerson: number;
    coverImage?: string;
    tourType: 'ADVENTURE' | 'CULTURAL' | 'WILDLIFE' | 'BEACH' | 'MOUNTAIN' | 'CITY' | 'CRUISE' | 'OTHER';
  };
  agency: {
    id: string;
    name: string;
    contactEmail: string;
    contactPhone: string;
  };
  customer: {
    id: string;
    user: {
      name: string;
      email: string;
      phone?: string;
    };
  };
  travelers: BookingPerson[];
  payments: Payment[];
}

export interface BookingPerson {
  id: string;
  fullName: string;
  dateOfBirth: string;
  email?: string;
  phoneNumber?: string;
  documents: PersonDocument[];
}

export interface PersonDocument {
  id: string;
  documentType: string;
  documentNumber: string;
  fileUrl?: string;
}

export interface Payment {
  id: string;
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
  paymentType: 'PARTIAL' | 'FULL';
  createdAt: string;
}