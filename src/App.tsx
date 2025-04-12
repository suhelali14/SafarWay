import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import ToursPage from './pages/dashboard/ToursPage';
import { BookingsPage } from './pages/dashboard/BookingsPage';
import CustomersPage from './pages/dashboard/CustomersPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Role Constants
const ADMIN_ROLES = ['SAFARWAY_ADMIN', 'SAFARWAY_USER'];
const AGENCY_ROLES = ['AGENCY_ADMIN', 'AGENCY_USER'];
const ALL_DASHBOARD_ROLES = [...ADMIN_ROLES, ...AGENCY_ROLES, 'CUSTOMER'];

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={ALL_DASHBOARD_ROLES}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Agency Routes */}
          <Route
            path="/agency/dashboard"
            element={
              <ProtectedRoute allowedRoles={AGENCY_ROLES}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agency/tours"
            element={
              <ProtectedRoute allowedRoles={AGENCY_ROLES}>
                <ToursPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agency/bookings"
            element={
              <ProtectedRoute allowedRoles={AGENCY_ROLES}>
                <BookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agency/customers"
            element={
              <ProtectedRoute allowedRoles={AGENCY_ROLES}>
                <CustomersPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/agencies"
            element={
              <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                <CustomersPage />
              </ProtectedRoute>
            }
          />

          {/* Customer Routes */}
          <Route
            path="/customer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/bookings"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <BookingsPage />
              </ProtectedRoute>
            }
          />

          {/* Shared Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={ALL_DASHBOARD_ROLES}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
