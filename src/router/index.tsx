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
import { BookingsPage as AdminBookingsPage } from '../pages/bookings/BookingsPage';
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
import { AgencyPackagesPage } from '../pages/agency/packages/index';
import { AgencyBookingsPage } from '../pages/agency/BookingsPage';
import { AgencyUsersPage } from '../pages/agency/UsersPage';
import { AgencySupportPage } from '../pages/agency/SupportPage';
// Import agency profile page
import AgencyProfilePage from '../pages/agency/ProfilePage';
// Customer specific pages
import BookingsPage from '../pages/customer/bookings';
import BookingDetailsPage from '../pages/customer/booking-details';
import CustomerLayout from '../layouts/CustomerLayout';
import CreateAgencyPage from '../pages/admin/agencies/create';
import AgencyDetailsPage from '../pages/admin/agencies/[id]';
import EditAgencyPage from '../pages/admin/agencies/edit/[id]';
// Import the onboarding page
import OnboardPage from '../pages/onboard';
// Import the AgencyDashboardPage component
import AgencyDashboardPage from '../pages/agency/dashboard';
import { AgencyLayout } from '../components/layouts/AgencyLayout';
import { PackageCreatePage } from '../pages/agency/packages/PackageCreatePage';
import { PackageEditPage } from '../pages/agency/packages/PackageEditPage';

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
        path: 'onboard',
        element: <OnboardPage />
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
  // Customer Routes
  {
    path: '/customer',
    element: (
      <RouteGuard requiredRole="CUSTOMER">
        <CustomerLayout>
          <Outlet />
        </CustomerLayout>
      </RouteGuard>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/customer/bookings" replace />
      },
      {
        path: 'bookings',
        element: <BookingsPage />
      },
      {
        path: 'bookings/:id',
        element: <BookingDetailsPage />
      },
      {
        path: 'profile',
        element: <ProfilePage />
      }
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
        path: 'agencies/create',
        element: <CreateAgencyPage />
      },
      {
        path: 'agencies/:id',
        element: <AgencyDetailsPage />
      },
      {
        path: 'agencies/edit/:id',
        element: <EditAgencyPage />
      },
      {
        path: 'bookings',
        element: <AdminBookingsPage />
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
        element: <AgencyDashboardPage />
      },
      {
        path: 'packages',
        element: <AgencyPackagesPage />
      },
      {
        path: 'packages/new',
        element: <PackageCreatePage />
      },
      {
        path: 'packages/edit/:id',
        element: <PackageEditPage />
      },
      {
        path: 'bookings',
        element: <AgencyBookingsPage />
      },
      {
        path: 'profile',
        element: <AgencyProfilePage />
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
            <Route path="onboard" element={<OnboardPage />} />
            <Route path="profile" element={
              <RouteGuard requiredRole={["CUSTOMER", "AGENCY_ADMIN", "AGENCY_USER", "SAFARWAY_ADMIN"]}>
                <ProfilePage />
              </RouteGuard>
            } />
            <Route path="packages" element={<PackagesPage />} />
            
            <Route path="packages/:id" element={<PackageDetailsPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Customer Routes */}
          <Route path="/customer" element={
            <RouteGuard requiredRole="CUSTOMER">
              <CustomerLayout>
                <Outlet />
              </CustomerLayout>
            </RouteGuard>
          }>
            <Route index element={<Navigate to="/customer/bookings" replace />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="bookings/:id" element={<BookingDetailsPage />} />
            <Route path="profile" element={<ProfilePage />} />
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
            <Route path="agencies/create" element={<CreateAgencyPage />} />
            <Route path="agencies/:id" element={<AgencyDetailsPage />} />
            <Route path="agencies/edit/:id" element={<EditAgencyPage />} />
            <Route path="bookings" element={<AdminBookingsPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Agency Routes */}
          <Route path="/agency" element={
            <RouteGuard requiredRole={["AGENCY_ADMIN", "AGENCY_USER"]}>
              <AgencyLayout>
                <Outlet />
              </AgencyLayout>
            </RouteGuard>
          }>
            <Route index element={<Navigate to="/agency/dashboard" replace />} />
            <Route path="dashboard" element={<AgencyDashboardPage />} />
            <Route path="packages" element={<AgencyPackagesPage />} />
            <Route path="packages/new" element={<PackageCreatePage />} />
            <Route path="packages/edit/:id" element={<PackageEditPage />} />
            <Route path="bookings" element={<AgencyBookingsPage />} />
            <Route path="profile" element={<AgencyProfilePage />} />
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

