import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserData } from '../utils/session';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from '../lib/store/slices/authSlice';
import { AppDispatch, RootState } from '../lib/store';

/**
 * A custom hook that provides optimized access to user data
 * - First tries to get data from context
 * - Then falls back to session storage
 * - Then falls back to Redux
 * - Optionally can force a refresh from the API
 */
export const useUser = (options: { forceRefresh?: boolean } = {}) => {
  const { forceRefresh = false } = options;
  const dispatch = useDispatch<AppDispatch>();
  const { user: contextUser, isLoading: authLoading } = useAuth() || { user: null, isLoading: false };
  const reduxUser = useSelector((state: RootState) => state.auth?.user);
  
  const [user, setUser] = useState(contextUser || getUserData() || reduxUser || null);
  const [isLoading, setIsLoading] = useState(authLoading);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      // If we already have user data and don't need to force refresh, use it
      if (user && !forceRefresh) {
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // Try to get from context first (which is already optimized)
        if (contextUser) {
          setUser(contextUser);
          return;
        }
        
        // Try to get from session
        const sessionUser = getUserData();
        if (sessionUser && !forceRefresh) {
          setUser(sessionUser);
          return;
        }
        
        // If all else fails or forceRefresh is true, dispatch Redux action
        const resultAction = await dispatch(getCurrentUser(forceRefresh));
        if (getCurrentUser.fulfilled.match(resultAction)) {
          setUser(resultAction.payload);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch user data'));
        console.error('Error fetching user data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [contextUser, forceRefresh, dispatch]);

  return {
    user,
    isLoading,
    error,
    refetch: () => dispatch(getCurrentUser(true)),
  };
};

export default useUser; 