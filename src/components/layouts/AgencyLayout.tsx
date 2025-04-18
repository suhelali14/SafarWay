import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Calendar,
  RefreshCcw,
  Settings,
  User,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Sidebar, NavItem } from '../common/Sidebar';

export function AgencyLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navigation: NavItem[] = [
    {
      icon: <LayoutDashboard className="h-4 w-4" />,
      label: 'Dashboard',
      href: '/agency',
    },
    {
      icon: <Package className="h-4 w-4" />,
      label: 'Packages',
      href: '/agency/packages',
      badge: {
        content: 'New',
        variant: 'default' as const
      }
    },
    {
      icon: <Calendar className="h-4 w-4" />,
      label: 'Bookings',
      href: '/agency/bookings',
      badge: {
        content: '5',
        variant: 'secondary' as const
      }
    },
    {
      icon: <RefreshCcw className="h-4 w-4" />,
      label: 'Refunds',
      href: '/agency/refunds',
      badge: {
        content: '2',
        variant: 'destructive' as const
      }
    },
    {
      icon: <User className="h-4 w-4" />,
      label: 'Profile',
      href: '/agency/profile',
    },
    {
      icon: <Settings className="h-4 w-4" />,
      label: 'Settings',
      href: '/agency/settings',
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar
        brandInfo={{
          name: user?.agency?.name || 'Agency Portal',
          logo: user?.agency?.logo,
        }}
        navigation={navigation}
        userInfo={{
          name: user?.name || 'Agency User',
          email: user?.email,
          avatar: user?.profilePicture,
        }}
        onLogout={handleLogout}
        defaultCollapsed={false}
      />
      
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
} 