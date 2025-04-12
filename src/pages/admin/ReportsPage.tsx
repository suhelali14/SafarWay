import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Download, Calendar, TrendingUp, Users, Building2, CreditCard } from 'lucide-react';

interface ReportData {
  bookings: {
    total: number;
    byStatus: {
      confirmed: number;
      pending: number;
      cancelled: number;
    };
    byMonth: {
      month: string;
      count: number;
    }[];
  };
  revenue: {
    total: number;
    currency: string;
    byMonth: {
      month: string;
      amount: number;
    }[];
  };
  users: {
    total: number;
    byRole: {
      customer: number;
      agency: number;
    };
    growth: number;
  };
  agencies: {
    total: number;
    active: number;
    pending: number;
    byLocation: {
      location: string;
      count: number;
    }[];
  };
}

export const ReportsPage = () => {
  const [reportData, setReportData] = useState<ReportData>({
    bookings: {
      total: 0,
      byStatus: {
        confirmed: 0,
        pending: 0,
        cancelled: 0,
      },
      byMonth: [],
    },
    revenue: {
      total: 0,
      currency: 'USD',
      byMonth: [],
    },
    users: {
      total: 0,
      byRole: {
        customer: 0,
        agency: 0,
      },
      growth: 0,
    },
    agencies: {
      total: 0,
      active: 0,
      pending: 0,
      byLocation: [],
    },
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    fetchReportData();
  }, [timeRange]);

  const fetchReportData = async () => {
    try {
      const response = await fetch(`/api/admin/reports?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const handleExport = (type: string) => {
    // TODO: Implement export functionality
    console.log(`Exporting ${type} report...`);
  };

  return (
    <>
      <Helmet>
        <title>Reports | SafarWay Admin</title>
      </Helmet>

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="quarter">Last 3 Months</SelectItem>
                <SelectItem value="year">Last 12 Months</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => handleExport('all')}>
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading reports...</div>
        ) : (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="agencies">Agencies</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                      <h3 className="text-2xl font-semibold mt-2">
                        {formatNumber(reportData.bookings.total)}
                      </h3>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <h3 className="text-2xl font-semibold mt-2">
                        {formatCurrency(reportData.revenue.total, reportData.revenue.currency)}
                      </h3>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-full">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <h3 className="text-2xl font-semibold mt-2">
                        {formatNumber(reportData.users.total)}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {reportData.users.growth >= 0 ? '+' : ''}{reportData.users.growth}% growth
                      </p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Agencies</p>
                      <h3 className="text-2xl font-semibold mt-2">
                        {formatNumber(reportData.agencies.total)}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {reportData.agencies.active} active
                      </p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </Card>
              </div>

              {/* TODO: Add charts for overview */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Booking Trends</h3>
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    Chart component will be added here
                  </div>
                </Card>
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    Chart component will be added here
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="bookings">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Booking Statistics</h2>
                  <Button variant="outline" onClick={() => handleExport('bookings')}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Confirmed</p>
                    <p className="text-2xl font-semibold mt-1">
                      {formatNumber(reportData.bookings.byStatus.confirmed)}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-semibold mt-1">
                      {formatNumber(reportData.bookings.byStatus.pending)}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Cancelled</p>
                    <p className="text-2xl font-semibold mt-1">
                      {formatNumber(reportData.bookings.byStatus.cancelled)}
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Monthly Bookings</h3>
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    Chart component will be added here
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="revenue">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Revenue Analysis</h2>
                  <Button variant="outline" onClick={() => handleExport('revenue')}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Monthly Revenue</h3>
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    Chart component will be added here
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">User Statistics</h2>
                  <Button variant="outline" onClick={() => handleExport('users')}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Customers</p>
                    <p className="text-2xl font-semibold mt-1">
                      {formatNumber(reportData.users.byRole.customer)}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Agency Users</p>
                    <p className="text-2xl font-semibold mt-1">
                      {formatNumber(reportData.users.byRole.agency)}
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">User Growth</h3>
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    Chart component will be added here
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="agencies">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Agency Statistics</h2>
                  <Button variant="outline" onClick={() => handleExport('agencies')}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Active Agencies</p>
                    <p className="text-2xl font-semibold mt-1">
                      {formatNumber(reportData.agencies.active)}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                    <p className="text-2xl font-semibold mt-1">
                      {formatNumber(reportData.agencies.pending)}
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Agencies by Location</h3>
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    Chart component will be added here
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  );
}; 