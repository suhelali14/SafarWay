import axios from 'axios';
import { getToken } from '../../utils/session';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

// Send an invitation to a user
export const sendInvite = async (inviteData: {
  email: string;
  role: 'AGENCY_ADMIN' | 'AGENCY_USER' | 'SAFARWAY_ADMIN' | 'SAFARWAY_USER';
  agencyId?: string;
}) => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/invites`, inviteData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error sending invitation:', error);
    toast.error(error.response?.data?.message || 'Failed to send invitation');
    throw error;
  }
};

// Verify invite token
export const verifyInviteToken = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/invites/verify/${token}`);
    return response.data;
  } catch (error: any) {
    console.error('Error verifying invitation token:', error);
    toast.error(error.response?.data?.message || 'Invalid or expired invitation token');
    throw error;
  }
};

// Resend an invitation
export const resendInvite = async (userId: string) => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/invites/${userId}/resend`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error resending invitation:', error);
    toast.error(error.response?.data?.message || 'Failed to resend invitation');
    throw error;
  }
};

// Revoke an invitation
export const revokeInvite = async (userId: string) => {
  try {
    const token = getToken();
    const response = await axios.delete(`${API_URL}/invites/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error revoking invitation:', error);
    toast.error(error.response?.data?.message || 'Failed to revoke invitation');
    throw error;
  }
};

// Complete onboarding (for invited users)
export const completeOnboarding = async (onboardingData: {
  token: string;
  name: string;
  phone: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/invites/onboard`, onboardingData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error completing onboarding:', error);
    toast.error(error.response?.data?.message || 'Failed to complete onboarding');
    throw error;
  }
};

// Get pending invitations
export const getPendingInvitations = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/admin/users?status=INVITED`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.users || [];
  } catch (error: any) {
    console.error('Error fetching pending invitations:', error);
    toast.error(error.response?.data?.message || 'Failed to fetch pending invitations');
    throw error;
  }
};

// Export all functions as a single object
export const inviteAPI = {
  sendInvite,
  verifyInviteToken,
  resendInvite,
  revokeInvite,
  completeOnboarding,
  getPendingInvitations,
}; 