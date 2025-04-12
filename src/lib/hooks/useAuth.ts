import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { login, registerCustomer, getCurrentUser, logout } from '../store/slices/authSlice';
import { useCallback } from 'react';
import { LoginCredentials, RegisterCustomerData } from '../api/auth';

export const useAuth = () => {
  const dispatch = useDispatch();
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
      await dispatch(registerCustomer(data)).unwrap();
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
        await dispatch(getCurrentUser()).unwrap();
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