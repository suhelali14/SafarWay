import axios from 'axios';
import { getToken } from '../../utils/session';
import { User } from '../../types/user';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  role?: string;
}

export interface AddUserRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  role: string;
}

export interface InviteUserRequest {
  email: string;
  name: string;
  role: string;
  agencyId?: string;
}

// Get all users for the current agency with pagination and filtering
export const getAgencyUsers = async (filters: UserFilters = {}): Promise<PaginatedResponse<User>> => {
  try {
    const token = getToken();
    
    // Build URL with query parameters
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.role) params.append('role', filters.role);
    
    const queryString = params.toString();
    
    console.log('Fetching agency users with params:', queryString);
    
    const response = await axios.get(
      `${API_URL}/agency/users${queryString ? `?${queryString}` : ''}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching agency users:', error);
    throw error;
  }
};

// Get a single user by ID
export const getAgencyUser = async (userId: string): Promise<User> => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/agency/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching agency user:', error);
    throw error;
  }
};

// Add a new user to the agency
export const addAgencyUser = async (userData: AddUserRequest): Promise<User> => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/agency/users`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Error adding agency user:', error);
    throw error;
  }
};

// Update an existing user
export const updateAgencyUser = async (userId: string, userData: UpdateUserRequest): Promise<User> => {
  try {
    const token = getToken();
    const response = await axios.put(`${API_URL}/agency/users/${userId}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Error updating agency user:', error);
    throw error;
  }
};

// Delete a user
export const deleteAgencyUser = async (userId: string): Promise<void> => {
  try {
    const token = getToken();
    await axios.delete(`${API_URL}/agency/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Error deleting agency user:', error);
    throw error;
  }
};

// Invite a new user to the agency
export const inviteAgencyUser = async (inviteData: InviteUserRequest): Promise<void> => {
  try {
    const token = getToken();
    await axios.post(`${API_URL}/auth/invite-user`, inviteData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error inviting user:', error);
    throw error;
  }
};

// Resend invitation to a user
export const resendInvitation = async (userId: string): Promise<void> => {
  try {
    const token = getToken();
    await axios.post(`${API_URL}/agency/users/${userId}/resend-invite`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Error resending invitation:', error);
    throw error;
  }
};

// Suspend a user
export const suspendUser = async (userId: string): Promise<User> => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/agency/users/${userId}/suspend`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Error suspending user:', error);
    throw error;
  }
};

// Activate a suspended user
export const activateUser = async (userId: string): Promise<User> => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/agency/users/${userId}/activate`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Error activating user:', error);
    throw error;
  }
};

// Update user role
export const updateUserRole = async (userId: string, role: string): Promise<User> => {
  try {
    const token = getToken();
    const response = await axios.patch(`${API_URL}/agency/users/${userId}/role`, { role }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

// Export all functions as a single object
export const agencyUserService = {
  getAgencyUsers,
  getAgencyUser,
  addAgencyUser,
  updateAgencyUser,
  deleteAgencyUser,
  inviteAgencyUser,
  resendInvitation,
  suspendUser,
  activateUser,
  updateUserRole,
}; 