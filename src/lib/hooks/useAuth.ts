import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { login, registerCustomer, getCurrentUser, logout } from '../store/slices/authSlice';
import { useCallback } from 'react';
import { LoginCredentials, RegisterCustomerData } from '../api/auth';

export const useAuth = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user, token, loading, error } = useSelector((state: RootState) => state.auth);

  const handleLogin = useCallback(async (credentials: LoginCredentials) => {
    try {
      await dispatch(login(credentials)).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  }, [dispatch]);

  const handleRegister = useCallback(async (data: RegisterCustomerData) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value as string | Blob);
      });
      await dispatch(registerCustomer(formData)).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  }, [dispatch]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const checkAuth = useCallback(async () => {
    if (token) {
      try {
        await dispatch(getCurrentUser(true)).unwrap();
        return true;
      } catch (error) {
        return false;
      }
    }
    return false;
  }, [dispatch, token]);

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    checkAuth,
  };
}; 