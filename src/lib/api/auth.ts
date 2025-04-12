import api from './axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCustomerData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface RegisterAgencyData {
  name: string;
  description: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
}

export interface RegisterAgencyUserData {
  name: string;
  email: string;
  password: string;
  phone: string;
  agencyId: string;
}

export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post('/auth/login', credentials),

  registerCustomer: (data: RegisterCustomerData) =>
    api.post('/auth/register/customer', data),

  registerAgency: (data: RegisterAgencyData) =>
    api.post('/auth/register/agency', data),

  registerAgencyUser: (data: RegisterAgencyUserData) =>
    api.post('/auth/register/agency-user', data),

  getCurrentUser: () =>
    api.get('/auth/me'),

  updateProfile: (data: Partial<RegisterCustomerData>) =>
    api.patch('/auth/profile', data),

  resetPassword: (email: string) =>
    api.post('/auth/reset-password', { email }),

  verifyResetToken: (token: string) =>
    api.post('/auth/verify-reset-token', { token }),

  updatePassword: (token: string, password: string) =>
    api.post('/auth/update-password', { token, password }),
}; 