import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';
import {
  LayoutDashboard,
  Users,
  Building2,
  BookOpen,
  CreditCard,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Package,
  MessageSquare,
  Bell,
  User
} from 'lucide-react';
import { Button } from '../ui/button';
import { Toaster } from 'react-hot-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface DashboardLayoutProps {
  children: ReactNode;
}

interface SidebarLink {
  icon: React.ElementType;
  label: string;
  href: string;
  roles: string[];
}

const sidebarLinks: SidebarLink[] = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    href: '/admin/dashboard',
    roles: ['SAFARWAY_ADMIN']
  },
  {
    icon: Users,
    label: 'Users',
    href: '/admin/users',
    roles: ['SAFARWAY_ADMIN']
  },
  {
    icon: Building2,
    label: 'Agencies',
    href: '/admin/agencies',
    roles: ['SAFARWAY_ADMIN']
  },
  {
    icon: BookOpen,
    label: 'Bookings',
    href: '/admin/bookings',
    roles: ['SAFARWAY_ADMIN']
  },
  {
    icon: CreditCard,
    label: 'Payments',
    href: '/admin/payments',
    roles: ['SAFARWAY_ADMIN']
  },
  {
    icon: FileText,
    label: 'Reports',
    href: '/admin/reports',
    roles: ['SAFARWAY_ADMIN']
  },
  {
    icon: Settings,
    label: 'Settings',
    href: '/admin/settings',
    roles: ['SAFARWAY_ADMIN']
  },
  // Agency Admin Links
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    href: '/agency/dashboard',
    roles: ['AGENCY_ADMIN', 'AGENCY_USER']
  },
  {
    icon: Package,
    label: 'Packages',
    href: '/agency/packages',
    roles: ['AGENCY_ADMIN']
  },
  {
    icon: BookOpen,
    label: 'Bookings',
    href: '/agency/bookings',
    roles: ['AGENCY_ADMIN', 'AGENCY_USER']
  },
  {
    icon: Users,
    label: 'Agency Users',
    href: '/agency/users',
    roles: ['AGENCY_ADMIN']
  },
  {
    icon: MessageSquare,
    label: 'Support',
    href: '/agency/support',
    roles: ['AGENCY_ADMIN', 'AGENCY_USER']
  }
];

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const filteredLinks = sidebarLinks.filter(link => 
    link.roles.includes(user?.role || '')
  );

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen transition-transform bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700",
          collapsed ? "w-16" : "w-64",
          "md:translate-x-0"
        )}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-5">
            <Link
              to="/"
              className={cn(
                "flex items-center",
                collapsed ? "justify-center" : "justify-start"
              )}
            >
              {collapsed ? (
                <img src="/logo-icon.png" alt="SafarWay" className="h-8 w-8" />
              ) : (
                <img src="/logo.png" alt="SafarWay" className="h-8" />
              )}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          <nav className="space-y-2">
            {filteredLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700",
                    isActive ? "bg-blue-50 dark:bg-gray-700" : "",
                    collapsed ? "justify-center" : "justify-start"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5",
                    isActive ? "text-blue-600" : "text-gray-500 dark:text-gray-400"
                  )} />
                  {!collapsed && (
                    <span
                      className={cn(
                        "ml-3",
                        isActive ? "text-blue-600 font-medium" : "text-gray-500 dark:text-gray-400"
                      )}
                    >
                      {link.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300",
          collapsed ? "md:ml-16" : "md:ml-64"
        )}
      >
        {/* Top Navigation */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2.5 flex justify-between items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="md:hidden"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>

            <div className="flex items-center space-x-4 ml-auto">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link to="/profile" className="flex items-center">
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <span className="flex items-center text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4">
          {children}
        </main>
      </div>

      <Toaster position="top-right" />
    </div>
  );
}; 