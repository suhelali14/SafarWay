import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AgencyLayout } from '../components/layouts/AgencyLayout';
import AgencyDashboardPage from '../pages/agency/dashboard';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { AgencyRoute } from '../components/auth/AgencyRoute';

// Define lazy-loaded routes for better performance
const AgencyProfilePage = React.lazy(() => import('../pages/agency/profile'));
const AgencyPackagesPage = React.lazy(() => import('../pages/agency/packages'));
const CreatePackagePage = React.lazy(() => import('../pages/agency/packages/create'));
const EditPackagePage = React.lazy(() => import('../pages/agency/packages/edit'));
const AgencyBookingsPage = React.lazy(() => import('../pages/agency/bookings'));
const BookingDetailPage = React.lazy(() => import('../pages/agency/bookings/detail'));
const AgencyRefundsPage = React.lazy(() => import('../pages/agency/refunds'));

export function AgencyRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AgencyRoute>
              <AgencyLayout />
            </AgencyRoute>
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route index element={<AgencyDashboardPage />} />
        
        {/* Profile */}
        <Route 
          path="profile" 
          element={
            <React.Suspense fallback={<div>Loading...</div>}>
              <AgencyProfilePage />
            </React.Suspense>
          } 
        />
        
        {/* Packages */}
        <Route 
          path="packages" 
          element={
            <React.Suspense fallback={<div>Loading...</div>}>
              <AgencyPackagesPage />
            </React.Suspense>
          } 
        />
        <Route 
          path="packages/create" 
          element={
            <React.Suspense fallback={<div>Loading...</div>}>
              <CreatePackagePage />
            </React.Suspense>
          } 
        />
        <Route 
          path="packages/edit/:id" 
          element={
            <React.Suspense fallback={<div>Loading...</div>}>
              <EditPackagePage />
            </React.Suspense>
          } 
        />
        
        {/* Bookings */}
        <Route 
          path="bookings" 
          element={
            <React.Suspense fallback={<div>Loading...</div>}>
              <AgencyBookingsPage />
            </React.Suspense>
          } 
        />
        <Route 
          path="bookings/:id" 
          element={
            <React.Suspense fallback={<div>Loading...</div>}>
              <BookingDetailPage />
            </React.Suspense>
          } 
        />
        
        {/* Refunds */}
        <Route 
          path="refunds" 
          element={
            <React.Suspense fallback={<div>Loading...</div>}>
              <AgencyRefundsPage />
            </React.Suspense>
          } 
        />
      </Route>
    </Routes>
  );
} 