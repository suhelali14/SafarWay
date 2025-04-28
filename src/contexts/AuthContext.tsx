import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import  { AxiosError } from 'axios';

import { authAPI } from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  getToken, 
  getUserData, 
  clearSession, 
  isValid, 
  UserData,
  initializeSession 
} from '../utils/session';

// Update User interface to match UserData
// interface User extends Omit<UserData, 'profileImage'> {
//   profilePicture?: string | undefined;
// }

interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: any) => Promise<void>;
  inviteUser: (email: string, role: string) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create the context with a default value
export const AuthContext = createContext<AuthContextType | null>(null);

// Convert UserData to User
// const convertUserDataToUser = (userData: UserData | null): User | null => {
//   if (!userData) return null;
  
//   // Using optional chaining and nullish coalescing to handle missing property
//   const { profileImage, ...rest } = userData as any;
//   return {
//     ...rest,
//     profilePicture: profileImage ?? undefined
//   };
// };

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Custom navigation function that can be used safely
  const navigateTo = (path: string) => {
    console.log('navigateTo called with path:', path);
    try {
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.location if navigate fails
      window.location.href = path;
    }
  };

  // Check authentication status - optimized to use cached data first
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      
      // First check if we have a valid session in cookies/localStorage
      if (!isValid()) {
        console.log('Session is not valid, clearing session');
        clearSession();
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      const token = getToken();
      if (!token) {
        console.log('No token found');
        setIsAuthenticated(false);
        return;
      }

      // Get user data from cookies first to avoid immediate API call
      const cachedUserData = getUserData();
      if (cachedUserData && cachedUserData.id) {
        console.log('Using cached user data from cookies');
        setUser(cachedUserData);
        setIsAuthenticated(true);
        
        // Optionally refresh data in background after a delay
        setTimeout(() => {
          refreshUserDataInBackground(token);
        }, 5000); // Delay background refresh to prioritize UI rendering
        
        return;
      }

      // If no cached data, fetch from API
      try {
        // Try to verify token with backend
        console.log('No cached data, verifying token with backend...');
        const response = await authAPI.getCurrentUser();
        console.log('getCurrentUser response full:', response);
        
        // Extract user data from the correct response structure
        const userData = response.data.data;
        
        console.log('Extracted user data:', userData);
        
        if (!userData || !userData.id) {
          console.error('Invalid or missing user data in response');
          clearSession();
          setUser(null);
          setIsAuthenticated(false);
          return;
        }
        
        console.log('Setting user and authenticated state');
        
        // Update user state with verified data
        setUser(userData);
        setIsAuthenticated(true);
        
        // Re-initialize session with fresh data
        initializeSession(token, userData);
        
      } catch (error: any) {
        console.error('Auth verification error:', error);
        
        // Handle different error scenarios
        if (error.response?.status === 401) {
          console.log('Auth verification failed (401), clearing session');
          clearSession();
          setUser(null);
          setIsAuthenticated(false);
          navigateTo('/login');
        } else if (error.response?.status === 403) {
          console.log('User is forbidden (403), clearing session');
          clearSession();
          setUser(null);
          setIsAuthenticated(false);
          navigateTo('/login');
        } else {
          console.warn('Non-auth error during verification:', error);
          // Keep existing session for non-auth errors
          const existingUser = getUserData();
          if (existingUser) {
            setUser(existingUser);
            setIsAuthenticated(true);
          } else {
            clearSession();
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      }
    } catch (error) {
      console.error('Error in checkAuth:', error);
      clearSession();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // New function to refresh user data in background without blocking UI
  const refreshUserDataInBackground = async (token: string) => {
    try {
      console.log('Refreshing user data in background...');
      const response = await authAPI.getCurrentUser();
      const userData = response.data.data;
      
      if (userData && userData.id) {
        // Silently update the user data
        setUser(userData);
        // Re-initialize session with updated data
        initializeSession(token, userData);
        console.log('Background user data refresh successful');
      }
    } catch (error) {
      // Don't disrupt user experience if background refresh fails
      console.warn('Background user data refresh failed:', error);
    }
  };

  // Check auth on mount
  useEffect(() => {
    console.log('AuthProvider mounted, checking auth...');
    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(email, password);
      console.log('Login API response:', response);
      
      const { data } = response.data; // Extract the data object from response
      const { token, user: userData } = data; // Extract token and user from data

      console.log('Login response processed:', { token: !!token, userData });
      
      if (!token || !userData || !userData.id) {
        throw new Error('Invalid response from server');
      }

      // Initialize session with new token and user data
      initializeSession(token, userData);
      
      // Update state
      setUser(userData);
      setIsAuthenticated(true);
      
      toast.success('Login successful!');
      
      // Force a small delay to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Get the appropriate dashboard path based on user role
      const dashboardPath = getDashboardPathByRole(userData.role);
      console.log('Navigating to dashboard:', dashboardPath);
      
      // Use the from path from location state if available, otherwise use the dashboard path
      const from = (location.state as any)?.from || dashboardPath;
      console.log('Redirecting to:', from);
      navigateTo(from);
      
    } catch (error: unknown) {
      console.error('Login failed:', error);
      clearSession();
      setUser(null);
      setIsAuthenticated(false);
      
      const errorMessage = error instanceof AxiosError && error.response?.data?.message 
        ? error.response.data.message 
        : error instanceof Error 
          ? error.message 
          : 'Login failed. Please check your credentials and try again.';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      clearSession();
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
      navigateTo('/login');
    } catch (error: unknown) {
      console.error('Logout failed:', error);
      toast.error('Failed to logout. Please try again.');
    }
  };

  // Get dashboard path based on user role
  const getDashboardPathByRole = (role: string): string => {
    console.log('Getting dashboard path for role:', role);
    switch (role) {
      case 'SAFARWAY_ADMIN':
      case 'SAFARWAY_USER':
        return '/admin/dashboard';
      case 'AGENCY_ADMIN':
      case 'AGENCY_USER':
        return '/agency/dashboard';
      case 'CUSTOMER':
        return '/';
      default:
        return '/';
    }
  };

  // Register function
  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await authAPI.registerCustomer(data);
      const { token, user: userData } = response.data.data;

      // Initialize session with new token and user data
      initializeSession(token, userData);
      
      // Update state
      setUser(userData);
      setIsAuthenticated(true);
      
      toast.success('Registration successful!');
      
      // Navigate to dashboard
      const dashboardPath = getDashboardPathByRole(userData.role);
      navigateTo(dashboardPath);
      
    } catch (error: unknown) {
      console.error('Registration failed:', error);
      const errorMessage = error instanceof AxiosError && error.response?.data?.message 
        ? error.response.data.message 
        : error instanceof Error 
          ? error.message 
          : 'Registration failed. Please try again.';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Invite user function
  const inviteUser = async (email: string, role: string) => {
    try {
      const response = await authAPI.inviteUser({ email, role });
      console.log('User invited successfully:', response.data);
      toast.success('User invited successfully!');
    } catch (error: unknown) {
      console.error('Failed to invite user:', error);
      const errorMessage = error instanceof AxiosError && error.response?.data?.message
        ? error.response.data.message
        : error instanceof Error
          ? error.message
          : 'Failed to invite user. Please try again.';
      toast.error(errorMessage);
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    register,
    inviteUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 