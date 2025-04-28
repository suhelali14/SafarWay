import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  Users,
  Building2,
  BookOpen,
  CreditCard,
  Bell,
  Settings,
  Package,
  MessageSquare,
  Star,
  Clock,
  CheckCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';

// Types for different dashboard data
interface DashboardMetrics {
  totalUsers?: number;
  totalAgencies?: number;
  totalBookings: number;
  totalPackages?: number;
  revenue?: number;
  pendingApprovals?: number;
  upcomingTrips?: Array<any>;
  recentTransactions?: Array<any>;
  assignedPackages?: Array<any>;
}

interface ChartData {
  name: string;
  value: number;
}

export const DashboardPage = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalBookings: 0,
    upcomingTrips: []
  });
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, [user?.role]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardSummary();
      setMetrics(response.data);
      setChartData(response.data.chartData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const renderMetricCard = (title: string, value: number | string, icon: React.ReactNode) => (
    <Card className="p-6 flex items-center justify-between bg-white dark:bg-gray-800 shadow-lg rounded-xl">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        {loading ? (
          <Skeleton className="h-8 w-24 mt-1" />
        ) : (
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        )}
      </div>
      <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
        {icon}
      </div>
    </Card>
  );

  const renderSafarwayAdminMetrics = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {renderMetricCard('Total Users', metrics.totalUsers || 0, <Users className="w-6 h-6 text-blue-600" />)}
        {renderMetricCard('Total Agencies', metrics.totalAgencies || 0, <Building2 className="w-6 h-6 text-blue-600" />)}
        {renderMetricCard('Active Bookings', metrics.totalBookings || 0, <BookOpen className="w-6 h-6 text-blue-600" />)}
        {renderMetricCard('Revenue', `$${metrics.revenue || 0}`, <CreditCard className="w-6 h-6 text-blue-600" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Booking Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Pending Approvals</h3>
          {/* Add pending approvals list here */}
        </Card>
      </div>
    </>
  );

  const renderUserDashboard = () => (
    <>
      <div className="mb-6">
        <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <h2 className="text-2xl font-bold">Welcome back, {user?.name}!</h2>
          <p className="mt-2">Ready for your next adventure?</p>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {renderMetricCard('Upcoming Trips', metrics.upcomingTrips?.length || 0, <Clock className="w-6 h-6 text-blue-600" />)}
        {renderMetricCard('Past Trips', metrics.totalBookings || 0, <CheckCircle className="w-6 h-6 text-blue-600" />)}
        {renderMetricCard('Saved Packages', metrics.totalPackages || 0, <Star className="w-6 h-6 text-blue-600" />)}
      </div>
      {/* Add upcoming trips and booking history sections */}
    </>
  );

  const renderAgencyAdminDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {renderMetricCard('Total Packages', metrics.totalPackages || 0, <Package className="w-6 h-6 text-blue-600" />)}
        {renderMetricCard('Active Bookings', metrics.totalBookings || 0, <BookOpen className="w-6 h-6 text-blue-600" />)}
        {renderMetricCard('Revenue', `$${metrics.revenue || 0}`, <CreditCard className="w-6 h-6 text-blue-600" />)}
        {renderMetricCard('Support Tickets', metrics.pendingApprovals || 0, <MessageSquare className="w-6 h-6 text-blue-600" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
          {/* Add recent bookings list here */}
        </Card>
      </div>
    </>
  );

  const renderAgencyUserDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {renderMetricCard('Assigned Packages', metrics.assignedPackages?.length || 0, <Package className="w-6 h-6 text-blue-600" />)}
        {renderMetricCard('Active Bookings', metrics.totalBookings || 0, <BookOpen className="w-6 h-6 text-blue-600" />)}
        {renderMetricCard('Support Tickets', metrics.pendingApprovals || 0, <MessageSquare className="w-6 h-6 text-blue-600" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Assigned Tasks</h3>
          {/* Add assigned tasks list here */}
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Updates</h3>
          {/* Add recent updates list here */}
        </Card>
      </div>
    </>
  );

  const renderDashboardContent = () => {
    switch (user?.role) {
      case 'SAFARWAY_ADMIN':
        return renderSafarwayAdminMetrics();
      case 'CUSTOMER':
        return renderUserDashboard();
      case 'AGENCY_ADMIN':
        return renderAgencyAdminDashboard();
      case 'AGENCY_USER':
        return renderAgencyUserDashboard();
      default:
        return <div>Invalid role</div>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Dashboard | SafarWay</title>
        <meta name="description" content="View your SafarWay dashboard" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <div className="flex space-x-4">
            <Button variant="outline" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {renderDashboardContent()}
      </div>
    </>
  )
};