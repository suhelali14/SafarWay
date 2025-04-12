import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card } from '../../components/ui/card';
import {
  Users,
  Building2,
  CreditCard,
  Package,
  TrendingUp,
  Calendar,
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalAgencies: number;
  totalPayments: number;
  totalPackages: number;
  totalBookings: number;
  revenueStats: {
    total: number;
    currency: string;
    growth: number;
  };
}

export const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalAgencies: 0,
    totalPayments: 0,
    totalPackages: 0,
    totalBookings: 0,
    revenueStats: {
      total: 0,
      currency: 'USD',
      growth: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch('/api/admin/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const StatCard = ({ title, value, icon: Icon, description }: {
    title: string;
    value: string | number;
    icon: any;
    description?: string;
  }) => (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <h3 className="text-2xl font-semibold mt-2">{value}</h3>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className="p-3 bg-primary/10 rounded-full">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
    </Card>
  );

  return (
    <>
      <Helmet>
        <title>Dashboard | SafarWay Admin</title>
      </Helmet>

      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome to the SafarWay admin dashboard</p>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="h-20 animate-pulse bg-gray-200 rounded" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="Total Users"
              value={formatNumber(stats.totalUsers)}
              icon={Users}
              description="Active platform users"
            />
            <StatCard
              title="Total Agencies"
              value={formatNumber(stats.totalAgencies)}
              icon={Building2}
              description="Registered travel agencies"
            />
            <StatCard
              title="Total Revenue"
              value={formatCurrency(stats.revenueStats.total, stats.revenueStats.currency)}
              icon={TrendingUp}
              description={`${stats.revenueStats.growth >= 0 ? '+' : ''}${stats.revenueStats.growth}% from last month`}
            />
            <StatCard
              title="Total Packages"
              value={formatNumber(stats.totalPackages)}
              icon={Package}
              description="Available travel packages"
            />
            <StatCard
              title="Total Bookings"
              value={formatNumber(stats.totalBookings)}
              icon={Calendar}
              description="Completed bookings"
            />
            <StatCard
              title="Total Payments"
              value={formatNumber(stats.totalPayments)}
              icon={CreditCard}
              description="Processed transactions"
            />
          </div>
        )}

        {/* TODO: Add charts section */}
        <div className="grid gap-6 mt-6 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              Chart component will be added here
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Booking Trends</h3>
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              Chart component will be added here
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}; 