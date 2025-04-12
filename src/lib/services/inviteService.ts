import axios from 'axios';
import { API_URL } from '../config';

const inviteService = {
  createInvite: async (data: { email: string; role: string; agencyId?: string }) => {
    return axios.post(`${API_URL}/invites`, data);
  },

  getInvites: async () => {
    return axios.get(`${API_URL}/invites`);
  },

  getInviteByToken: async (token: string) => {
    return axios.get(`${API_URL}/invites/token/${token}`);
  },

  completeOnboarding: async (data: {
    token: string;
    name: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }) => {
    return axios.post(`${API_URL}/invites/onboarding`, data);
  },

  cancelInvite: async (inviteId: string) => {
    return axios.delete(`${API_URL}/invites/${inviteId}`);
  },
};

export { inviteService }; 