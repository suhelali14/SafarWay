import { useAuth } from '../contexts/AuthContext';

export function useSession() {
  const auth = useAuth();
  
  return {
    session: {
      user: auth.user,
      token: auth.user ? 'authenticated' : null,
      isAuthenticated: auth.isAuthenticated
    },
    loading: auth.isLoading,
    signIn: auth.login,
    signOut: auth.logout
  };
} 