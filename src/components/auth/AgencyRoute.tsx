import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface AgencyRouteProps {
  children: React.ReactNode;
}

export function AgencyRoute({ children }: AgencyRouteProps) {
  const { user, isLoading } = useAuth();

  // If still loading, show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is agency
  const isAgency = user?.role === 'AGENCY_ADMIN' || user?.role === 'AGENCY_USER';
  
  // If not agency, redirect to appropriate location
  if (!isAgency) {
    // If user is admin, redirect to admin dashboard
    if (user?.role === 'SAFARWAY_ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    
    // If user is customer, redirect to customer dashboard
    if (user?.role === 'CUSTOMER') {
      return <Navigate to="/dashboard" replace />;
    }
    
    // If there's no role or the role is invalid, redirect to login
    return <Navigate to="/login" replace />;
  }

  // If agency is not approved, show pending approval page
  if (user?.agency?.status !== 'APPROVED') {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h1 className="mb-2 text-2xl font-bold">Agency Approval Pending</h1>
          <p className="mb-6 text-muted-foreground">
            Your agency account is currently {user?.agency?.status.toLowerCase()}. 
            Once approved by an administrator, you'll be able to access your agency dashboard.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="rounded-md bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // If user is agency and approved, render the children
  return <>{children}</>;
} 