import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getToken, setToken, removeToken, getUserData, setUserData, removeUserData, clearSession, isValid, UserData } from '../utils/session';

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (data: any) => Promise<void>;
  navigateTo: (path: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getDashboardPathByRole = (role: string): string => {
  switch (role) {
    case 'SAFARWAY_ADMIN':
    case 'SAFARWAY_USER':
      return '/admin/dashboard';
    case 'AGENCY_ADMIN':
    case 'AGENCY_USER':
      return '/agency/dashboard';
    case 'CUSTOMER':
      return '/customer/dashboard';
    default:
      console.warn('Unknown user role:', role);
      return '/dashboard';
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Custom navigation function that can be used safely
  const navigateTo = (path: string) => {
    try {
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.location if navigate fails
      window.location.href = path;
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (isValid()) {
        const storedUser = getUserData();
        if (storedUser) {
          setUser(storedUser);
          try {
            // Verify token with backend
            await authAPI.getCurrentUser();
          } catch (error: any) {
            // Only clear session for auth errors (401), not server errors (500)
            if (error.response?.status === 401) {
              console.log('Auth verification failed, clearing session');
              clearSession();
              setUser(null);
            } else {
              console.warn('Non-auth error during verification:', error);
              // Keep the session for non-auth errors
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in checkAuth:', error);
      // Only clear session for critical errors
      if (error instanceof Error && error.message.includes('auth')) {
        clearSession();
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      
      if (!response.data || !response.data.data) {
        throw new Error('No data received from server');
      }
      
      const { user, token } = response.data.data;
      
      if (!user || !token) {
        throw new Error('Invalid response from server: missing user or token');
      }
      
      // Store session data
      await Promise.all([
        new Promise<void>((resolve) => {
          setToken(token);
          resolve();
        }),
        new Promise<void>((resolve) => {
          setUserData(user);
          resolve();
        }),
        new Promise<void>((resolve) => {
          setUser(user);
          resolve();
        })
      ]);
      
      toast.success('Login successful!');
      
      // Force a small delay to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Get the appropriate dashboard path based on user role
      const dashboardPath = getDashboardPathByRole(user.role);
      console.log('Navigating to dashboard:', dashboardPath);
      
      // Use the from path from location state if available, otherwise use the dashboard path
      const from = (location.state as any)?.from || dashboardPath;
      navigateTo(from);
      
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 
        error.message || 
        'Login failed. Please check your credentials and try again.';
      toast.error(errorMessage);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await authAPI.registerCustomer(userData);
      
      if (!response.data || !response.data.data) {
        throw new Error('Invalid response from server');
      }

      const { user, token } = response.data.data;
      
      if (!user || !token) {
        throw new Error('Invalid response from server: missing user or token');
      }
      
      // Store session data
      setToken(token);
      setUserData(user);
      setUser(user);
      
      toast.success('Registration successful!');
      
      // Get the appropriate dashboard path based on user role
      const dashboardPath = getDashboardPathByRole(user.role);
      navigateTo(dashboardPath);
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
        error.message || 
        'Registration failed. Please try again.';
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    clearSession();
    setUser(null);
    navigateTo('/login');
    toast.success('Logged out successfully');
  };

  const updateProfile = async (data: any) => {
    try {
      const response = await authAPI.updateProfile(data);
      const updatedUser = response.data;
      
      setUserData(updatedUser);
      setUser(updatedUser);
      
      toast.success('Profile updated successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        navigateTo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 