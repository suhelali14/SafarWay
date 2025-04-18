import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Skeleton } from '../ui/skeleton';

type UserRole = "CUSTOMER" | "AGENCY_ADMIN" | "AGENCY_USER" | "SAFARWAY_ADMIN";

interface RouteGuardProps {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[];
  redirectTo?: string;
}

export function RouteGuard({ children, requiredRole, redirectTo = '/' }: RouteGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('RouteGuard effect:', { 
      user, 
      isAuthenticated,
      isLoading, 
      requiredRole, 
      path: location.pathname 
    });
    
    // Don't redirect while still loading
    if (isLoading) {
      return;
    }
    
    // If user is not authenticated, redirect to login
    if (!isAuthenticated || !user) {
      console.log('User not authenticated, redirecting to login');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    
    // If specific roles are required, check that the user has one of them
    if (requiredRole) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      console.log('Checking roles:', { userRole: user.role, requiredRoles: roles });
      if (!roles.includes(user.role)) {
        console.log('User role not authorized, redirecting to:', redirectTo);
        navigate(redirectTo);
      }
    }
  }, [user, isAuthenticated, isLoading, requiredRole, navigate, location.pathname, redirectTo]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    );
  }

  // Don't render anything if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  // Check role-based access
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(user.role)) {
      return null;
    }
  }

  // User is authenticated and has the required role
  return <>{children}</>;
} 