import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { inviteService } from '../../services/inviteService';
import { RootState } from '../index';

interface InviteState {
  loading: boolean;
  error: string | null;
  invites: any[];
  currentInvite: any | null;
}

const initialState: InviteState = {
  loading: false,
  error: null,
  invites: [],
  currentInvite: null,
};

export const createInvite = createAsyncThunk(
  'invite/create',
  async (data: { email: string; role: string; agencyId?: string }) => {
    const response = await inviteService.createInvite(data);
    return response.data;
  }
);

export const getInvites = createAsyncThunk('invite/getAll', async () => {
  const response = await inviteService.getInvites();
  return response.data;
});

export const getInviteByToken = createAsyncThunk(
  'invite/getByToken',
  async (token: string) => {
    const response = await inviteService.getInviteByToken(token);
    return response.data;
  }
);

export const completeOnboarding = createAsyncThunk(
  'invite/completeOnboarding',
  async (data: {
    token: string;
    name: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }) => {
    const response = await inviteService.completeOnboarding(data);
    return response.data;
  }
);

export const cancelInvite = createAsyncThunk(
  'invite/cancel',
  async (inviteId: string) => {
    const response = await inviteService.cancelInvite(inviteId);
    return response.data;
  }
);

const inviteSlice = createSlice({
  name: 'invite',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentInvite: (state) => {
      state.currentInvite = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Invite
      .addCase(createInvite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvite.fulfilled, (state, action) => {
        state.loading = false;
        state.invites.push(action.payload);
      })
      .addCase(createInvite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create invite';
      })
      // Get Invites
      .addCase(getInvites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInvites.fulfilled, (state, action) => {
        state.loading = false;
        state.invites = action.payload;
      })
      .addCase(getInvites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch invites';
      })
      // Get Invite By Token
      .addCase(getInviteByToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInviteByToken.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInvite = action.payload;
      })
      .addCase(getInviteByToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch invite';
      })
      // Complete Onboarding
      .addCase(completeOnboarding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeOnboarding.fulfilled, (state) => {
        state.loading = false;
        state.currentInvite = null;
      })
      .addCase(completeOnboarding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to complete onboarding';
      })
      // Cancel Invite
      .addCase(cancelInvite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelInvite.fulfilled, (state, action) => {
        state.loading = false;
        state.invites = state.invites.filter(
          (invite) => invite.id !== action.payload.id
        );
      })
      .addCase(cancelInvite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to cancel invite';
      });
  },
});

export const { clearError, clearCurrentInvite } = inviteSlice.actions;

export const selectInviteState = (state: RootState) => state.invite;

export default inviteSlice.reducer; 