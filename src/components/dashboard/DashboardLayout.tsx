import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  CalendarCheck,
  Users,
  BarChart2,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "../../lib/utils";
import { useState } from "react";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  badge?: number;
}

function NavItem({ href, icon, label, isActive, badge }: NavItemProps) {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors",
        isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
      )}
    >
      {icon}
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigation = [
    {
      href: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: "Dashboard",
    },
    {
      href: "/dashboard/tours",
      icon: <Map className="w-5 h-5" />,
      label: "Tour Packages",
    },
    {
      href: "/dashboard/bookings",
      icon: <CalendarCheck className="w-5 h-5" />,
      label: "Bookings",
      badge: 5,
    },
    {
      href: "/dashboard/customers",
      icon: <Users className="w-5 h-5" />,
      label: "Customers",
    },
    {
      href: "/dashboard/analytics",
      icon: <BarChart2 className="w-5 h-5" />,
      label: "Analytics",
    },
    {
      href: "/dashboard/messages",
      icon: <MessageSquare className="w-5 h-5" />,
      label: "Messages",
      badge: 3,
    },
    {
      href: "/dashboard/settings",
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50 transition-transform duration-200 ease-in-out",
          !isSidebarOpen && "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5 border-b">
          <img src="/logo.svg" alt="SafarWay" className="w-8 h-8" />
          <span className="text-xl font-semibold">SafarWay</span>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              isActive={location.pathname === item.href}
            />
          ))}
        </nav>

        {/* User */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                John Doe
              </p>
              <p className="text-xs text-gray-500 truncate">Agency Admin</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "transition-all duration-200 ease-in-out",
          isSidebarOpen ? "pl-64" : "pl-0"
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="flex items-center gap-4 px-8 py-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex-1 flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search..."
                  className="pl-9"
                />
              </div>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
} 