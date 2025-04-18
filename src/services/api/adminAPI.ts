import axios from 'axios';
import { getToken } from '../../utils/session';
import { User } from '../../types/user';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface UserFilters {
  search?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

// Get all users with pagination
export const getUsers = async (filters: UserFilters = {}): Promise<PaginatedResponse<User>> => {
  try {
    const token = getToken();
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset) params.append('offset', filters.offset.toString());
    
    const response = await axios.get(`${API_URL}/admin/users?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // Properly format the response
    const users = response.data.users || [];
    const total = response.data.total || 0;
    const limit = filters.limit || 10;
    const page = Math.floor((filters.offset || 0) / limit) + 1;
    const pages = Math.ceil(total / limit);
    
    return {
      data: users,
      total,
      page,
      limit,
      pages,
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Get a single user by ID
export const getUser = async (userId: string): Promise<User> => {
  const token = getToken();
  const response = await axios.get(`${API_URL}/admin/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Create a new user
export const createUser = async (userData: any): Promise<User> => {
  const token = getToken();
  const response = await axios.post(`${API_URL}/admin/users`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

// Update an existing user
export const updateUser = async (userId: string, userData: any): Promise<User> => {
  const token = getToken();
  const response = await axios.put(`${API_URL}/admin/users/${userId}`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

// Delete a user
export const deleteUser = async (userId: string): Promise<void> => {
  const token = getToken();
  await axios.delete(`${API_URL}/admin/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Block a user
export const blockUser = async (userId: string): Promise<User> => {
  const token = getToken();
  const response = await axios.patch(
    `${API_URL}/admin/users/${userId}/block`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Unblock a user
export const unblockUser = async (userId: string): Promise<User> => {
  const token = getToken();
  const response = await axios.patch(
    `${API_URL}/admin/users/${userId}/unblock`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Get all agencies for dropdown lists
export const getAllAgenciesList = async (): Promise<any[]> => {
  const token = getToken();
  const response = await axios.get(`${API_URL}/admin/agencies`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.agencies || [];
};

// Export all functions as a single object
export const adminAPI = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  blockUser,
  unblockUser,
  getAllAgenciesList,
}; 