import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/footer';
import { Calendar, User, Camera, Compass, Play, Home } from 'lucide-react';
import NewBadge from '../components/ui/NewBadge';

interface CustomerLayoutProps {
  children: React.ReactNode;
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  const location = useLocation();

  const sidebarItems = [
    { label: 'Dashboard', href: '/customer', icon: Home },
    { label: 'My Bookings', href: '/customer/bookings', icon: Calendar },
    { label: 'Travel Posts', href: '/customer/posts', icon: Camera, badge: <NewBadge /> },
    { label: 'Explore', href: '/customer/explore', icon: Compass, badge: <NewBadge /> },
    { label: 'Profile', href: '/customer/profile', icon: User },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-grow">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm border-r">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Portal</h2>
            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                    location.pathname === item.href || (item.href === '/customer' && location.pathname === '/customer')
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Quick Actions */}
          <div className="border-t p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                to="/posts"
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Camera className="w-4 h-4" />
                Share Your Trip
              </Link>
              <Link
                to="/explore"
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Compass className="w-4 h-4" />
                Discover Places
              </Link>
              <Link
                to="/packages"
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Play className="w-4 h-4" />
                Browse Packages
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow bg-gray-50 p-6">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerLayout; 