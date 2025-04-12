import { createBrowserRouter, Navigate, Outlet, RouterProvider, BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../contexts/AuthContext';
import { RouteGuard } from '../components/auth/RouteGuard';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/footer';
import { AdminLayout } from '../layouts/AdminLayout';
import { HomePage } from '../pages/home/HomePage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { PackagesPage } from '../pages/packages/PackagesPage';
import { PackageDetailsPage } from '../pages/packages/PackageDetailsPage';
import { BookingsPage } from '../pages/bookings/BookingsPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { AboutPage } from '../pages/about/AboutPage';
import { ContactPage } from '../pages/contact/ContactPage';
import { SupportPage } from '../pages/support/SupportPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { UsersPage } from '../pages/admin/UsersPage';
import { AgenciesPage } from '../pages/admin/AgenciesPage';
import { PaymentsPage } from '../pages/admin/PaymentsPage';
import { ReportsPage } from '../pages/admin/ReportsPage';
import { SettingsPage } from '../pages/admin/SettingsPage';
import { AgencyPackagesPage } from '../pages/agency/PackagesPage';
import { AgencyBookingsPage } from '../pages/agency/BookingsPage';
import { AgencyUsersPage } from '../pages/agency/UsersPage';
import { AgencySupportPage } from '../pages/agency/SupportPage';

// Layout with Navbar for public routes and regular users
const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

// Define routes
export const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'register',
        element: <RegisterPage />
      },
      {
        path: 'profile',
        element: (
          <RouteGuard requiredRole={["CUSTOMER", "AGENCY_ADMIN", "AGENCY_USER", "SAFARWAY_ADMIN"]}>
            <ProfilePage />
          </RouteGuard>
        )
      },
      {
        path: 'packages',
        element: <PackagesPage />,
      },
      {
        path: 'packages/:id',
        element: <PackageDetailsPage />,
      },
      {
        path: 'bookings',
        element: (
          <RouteGuard requiredRole="CUSTOMER">
            <BookingsPage />
          </RouteGuard>
        ),
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'contact',
        element: <ContactPage />,
      },
      {
        path: 'support',
        element: <SupportPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ]
  },
  // SafarWay Admin Routes
  {
    path: '/admin',
    element: (
      <RouteGuard requiredRole="SAFARWAY_ADMIN">
        <AdminLayout>
          <Outlet />
        </AdminLayout>
      </RouteGuard>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <DashboardPage />
      },
      {
        path: 'users',
        element: <UsersPage />
      },
      {
        path: 'agencies',
        element: <AgenciesPage />
      },
      {
        path: 'bookings',
        element: <BookingsPage />
      },
      {
        path: 'payments',
        element: <PaymentsPage />
      },
      {
        path: 'reports',
        element: <ReportsPage />
      },
      {
        path: 'settings',
        element: <SettingsPage />
      }
    ]
  },
  // Agency Routes
  {
    path: '/agency',
    element: (
      <RouteGuard requiredRole={["AGENCY_ADMIN", "AGENCY_USER"]}>
        <AdminLayout>
          <Outlet />
        </AdminLayout>
      </RouteGuard>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/agency/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <DashboardPage />
      },
      {
        path: 'packages',
        element: <AgencyPackagesPage />
      },
      {
        path: 'bookings',
        element: <AgencyBookingsPage />
      },
      {
        path: 'users',
        element: (
          <RouteGuard requiredRole="AGENCY_ADMIN">
            <AgencyUsersPage />
          </RouteGuard>
        )
      },
      {
        path: 'support',
        element: <AgencySupportPage />
      }
    ]
  }
];

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="profile" element={
              <RouteGuard requiredRole={["CUSTOMER", "AGENCY_ADMIN", "AGENCY_USER", "SAFARWAY_ADMIN"]}>
                <ProfilePage />
              </RouteGuard>
            } />
            <Route path="packages" element={<PackagesPage />} />
            <Route path="packages/:id" element={<PackageDetailsPage />} />
            <Route path="bookings" element={
              <RouteGuard requiredRole="CUSTOMER">
                <BookingsPage />
              </RouteGuard>
            } />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* SafarWay Admin Routes */}
          <Route path="/admin" element={
            <RouteGuard requiredRole="SAFARWAY_ADMIN">
              <AdminLayout>
                <Outlet />
              </AdminLayout>
            </RouteGuard>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="agencies" element={<AgenciesPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Agency Routes */}
          <Route path="/agency" element={
            <RouteGuard requiredRole={["AGENCY_ADMIN", "AGENCY_USER"]}>
              <AdminLayout>
                <Outlet />
              </AdminLayout>
            </RouteGuard>
          }>
            <Route index element={<Navigate to="/agency/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="packages" element={<AgencyPackagesPage />} />
            <Route path="bookings" element={<AgencyBookingsPage />} />
            <Route path="users" element={
              <RouteGuard requiredRole="AGENCY_ADMIN">
                <AgencyUsersPage />
              </RouteGuard>
            } />
            <Route path="support" element={<AgencySupportPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

