import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../lib/store';
import { ROUTES } from '../../lib/config';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login page with return URL
      navigate(ROUTES.LOGIN + '?returnUrl=' + encodeURIComponent(location.pathname));
      return;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      // User's role is not authorized
      navigate(ROUTES.HOME);
    }
  }, [isAuthenticated, user, allowedRoles, navigate, location]);

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
} 