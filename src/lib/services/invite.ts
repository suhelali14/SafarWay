import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-api-base-url.com', // Replace with your actual base URL
});

export interface InviteUserData {
  email: string;
  role: 'AGENCY_ADMIN' | 'AGENCY_USER';
  agencyId?: string;
}

export interface OnboardingData {
  token: string;
  name: string;
  phone: string;
  password: string;
}

export const inviteApi = {
  createInvite: async (data: InviteUserData) => {
    try {
      const response = await api.post('/invites', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  completeOnboarding: async (data: OnboardingData) => {
    try {
      const response = await api.post('/invites/onboard', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  resendInvite: async (userId: string) => {
    try {
      const response = await api.post(`/invites/${userId}/resend`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  revokeInvite: async (userId: string) => {
    try {
      const response = await api.delete(`/invites/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
}; 