import axios from '../axios';

export const api = {
  // Auth
  login: (data: { email: string; password: string }) => 
    axios.post('/auth/login', data),
  
  register: (data: { name: string; email: string; password: string }) => 
    axios.post('/auth/register', data),
  
  forgotPassword: (data: { email: string }) => 
    axios.post('/auth/forgot-password', data),
  
  resetPassword: (data: { token: string; password: string; password_confirmation: string }) => 
    axios.post('/auth/reset-password', data),
  
  // Admin - Agencies
  getAgencies: (params?: any) => 
    axios.get('/admin/agencies', { params }),
  
  getAgencyById: (id: string) => 
    axios.get(`/admin/agencies/${id}`),
  
  createAgency: (data: any) => 
    axios.post('/admin/agencies', data),
  
  updateAgency: (id: string, data: any) => 
    axios.put(`/admin/agencies/${id}`, data),
  
  inviteAgency: (data: any) => 
    axios.post('/admin/agencies/invite', data),
  
  // Admin - Users
  getUsers: (params?: any) => 
    axios.get('/admin/users', { params }),
  
  getUserById: (id: string) => 
    axios.get(`/admin/users/${id}`),
  
  createUser: (data: any) => 
    axios.post('/admin/users', data),
  
  updateUser: (id: string, data: any) => 
    axios.put(`/admin/users/${id}`, data),
  
  // Admin - Packages
  getPackages: (params?: any) => 
    axios.get('/admin/packages', { params }),
  
  getPackageById: (id: string) => 
    axios.get(`/admin/packages/${id}`),
  
  createPackage: (data: any) => 
    axios.post('/admin/packages', data),
  
  updatePackage: (id: string, data: any) => 
    axios.put(`/admin/packages/${id}`, data),
  
  // Admin - Bookings
  getBookings: (params?: any) => 
    axios.get('/admin/bookings', { params }),
  
  getBookingById: (id: string) => 
    axios.get(`/admin/bookings/${id}`),
  
  updateBookingStatus: (id: string, status: string) => 
    axios.patch(`/admin/bookings/${id}/status`, { status }),
  
  // Admin - Dashboard
  getDashboardSummary: () => 
    axios.get('/admin/dashboard/summary'),
}; 