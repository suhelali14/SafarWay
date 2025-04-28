import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../../services/auth';
interface ProfileUpdateData {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  profileImage?: File;
}

interface PasswordResetData {
  id: string;
  email: string;
  oldPassword: string;
  newPassword: string;
}

interface AgencyUserRegistrationData {
  name: string;
  email: string;
  role: 'AGENCY_ADMIN' | 'AGENCY_USER';
  agencyId: string;
}
import { STORAGE_KEYS } from '../../config';
import { getUserData as getCookieUserData } from '../../cookies';
import { adminAPI } from '../../../services/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'AGENCY_ADMIN' | 'AGENCY_USER' | 'SAFARWAY_ADMIN' | 'SAFARWAY_USER';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  profileImage?: string;
  agencyId?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  registrationStep: number;
  registrationData: any;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem(STORAGE_KEYS.TOKEN),
  isAuthenticated: !!localStorage.getItem(STORAGE_KEYS.TOKEN),
  loading: false,
  error: null,
  registrationStep: 0,
  registrationData: {},
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    const response = await authApi.login(credentials);
    const { token, user } = response.data;
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    return user;
  }
);

export const registerCustomer = createAsyncThunk(
  'auth/registerCustomer',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await authApi.registerCustomer(formData);
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const registerAgency = createAsyncThunk(
  'auth/registerAgency',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await authApi.registerAgency(formData);
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const registerAgencyUser = createAsyncThunk(
  'auth/registerAgencyUser',
  async (data: AgencyUserRegistrationData, { rejectWithValue }) => {
    try {
      const response = await adminAPI.createUser(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await authApi.logout();
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
});

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser', 
  async (forceRefresh: boolean = false, { }) => {
    // Try to get data from cookies first if not force refreshing
    if (!forceRefresh) {
      const cachedUser = getCookieUserData();
      if (cachedUser) {
        // Return cached data immediately for faster UI response
        return cachedUser;
      }
    }
    
    // Otherwise fetch from API
    const response = await authApi.getCurrentUser();
    return response.data;
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data: ProfileUpdateData, { rejectWithValue }) => {
    try {
      if (!data?.id) {
        throw new Error('User ID is required for profile update');
      }
      const response = await adminAPI.updateUser(data.id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Profile update failed');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data: PasswordResetData, { rejectWithValue }) => {
    try {
      if (!data.id) {
        throw new Error('User ID is required for password reset');
      }
      
      const response = await adminAPI.resetUserPassword(data.id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Password reset failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRegistrationStep: (state, action: PayloadAction<number>) => {
      state.registrationStep = action.payload;
    },
    setRegistrationData: (state, action: PayloadAction<any>) => {
      state.registrationData = { ...state.registrationData, ...action.payload };
    },
    clearRegistrationData: (state) => {
      state.registrationData = {};
      state.registrationStep = 0;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      // Register Customer
      .addCase(registerCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.registrationData = {};
        state.registrationStep = 0;
      })
      .addCase(registerCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register Agency
      .addCase(registerAgency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAgency.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.registrationData = {};
        state.registrationStep = 0;
      })
      .addCase(registerAgency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register Agency User
      .addCase(registerAgencyUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAgencyUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerAgencyUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.registrationData = {};
        state.registrationStep = 0;
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get user data';
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setRegistrationStep,
  setRegistrationData,
  clearRegistrationData,
  clearError,
} = authSlice.actions;

export default authSlice.reducer; 