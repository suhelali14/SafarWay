import api from './axios';

export interface Booking {
  id: string;
  startDate: string;
  numberOfPeople: number;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  tourPackageId: string;
  customerId: string;
  agencyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingData {
  startDate: string;
  numberOfPeople: number;
  tourPackageId: string;
}

export const bookingsApi = {
  create: (data: CreateBookingData) =>
    api.post('/bookings', data),

  getById: (id: string) =>
    api.get(`/bookings/${id}`),

  getCustomerBookings: () =>
    api.get('/bookings/customer/bookings'),

  updateStatus: (id: string, status: Booking['status']) =>
    api.patch(`/bookings/${id}/status`, { status }),

  cancel: (id: string) =>
    api.patch(`/bookings/${id}/status`, { status: 'CANCELLED' }),
}; 