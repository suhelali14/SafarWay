import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Helmet } from 'react-helmet-async';
import { useToast } from '../../hooks/use-toast';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Package, 
  
  CreditCard, 
  Calendar, 
  TrendingUp, 
 
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { agencyService } from '../../services/api/agencyService';
import { Booking } from '../../services/api/agencyService';
import { Link } from 'react-router-dom';

interface DashboardMetrics {
  totalPackages: number;
  activePackages: number;
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  monthlyRevenue: number;
  latestBookings: Booking[];
  pendingApprovals: number;
}

export const AgencyDashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalPackages: 0,
    activePackages: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    latestBookings: [],
    pendingApprovals: 0,
  });
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch data from the backend API
        const response = await agencyService.getDashboardSummary();
        
        // Map the API response to our dashboard metrics format
        setMetrics({
          totalPackages: response.totalPackages || 0,
          activePackages: response.activePackages || 0,
          totalBookings: response.totalBookings || 0,
          pendingBookings: response.pendingBookings || 0,
          completedBookings: response.completedBookings || 0,
          cancelledBookings: response.cancelledBookings || 0,
          totalRevenue: response.totalRevenue || 0,
          monthlyRevenue: response.monthlyRevenue || 0,
          latestBookings: response.recentBookings || [],
          pendingApprovals: 0, // Set default if not provided by API
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data.',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <Helmet>
        <title>Agency Dashboard | SafarWay</title>
      </Helmet>

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Agency Dashboard</h1>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="h-32">
                <CardContent className="flex justify-center items-center h-full">
                  <div className="w-full h-16 bg-gray-200 animate-pulse rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="flex flex-col justify-between p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tour Packages</p>
                      <div className="flex items-center gap-2">
                        <h2 className="text-3xl font-bold">{metrics.totalPackages}</h2>
                        <span className="text-sm font-medium text-green-600">
                          {metrics.activePackages} active
                        </span>
                      </div>
                    </div>
                    <Package className="h-10 w-10 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-col justify-between p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                      <div className="flex items-center gap-2">
                        <h2 className="text-3xl font-bold">{metrics.totalBookings}</h2>
                        <span className="text-sm font-medium text-amber-600">
                          {metrics.pendingBookings} pending
                        </span>
                      </div>
                    </div>
                    <Calendar className="h-10 w-10 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-col justify-between p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                      <div className="flex items-center gap-2">
                        <h2 className="text-3xl font-bold">{formatCurrency(metrics.totalRevenue)}</h2>
                      </div>
                    </div>
                    <CreditCard className="h-10 w-10 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-col justify-between p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                      <div className="flex items-center gap-2">
                        <h2 className="text-3xl font-bold">{formatCurrency(metrics.monthlyRevenue)}</h2>
                      </div>
                    </div>
                    <TrendingUp className="h-10 w-10 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="py-3 text-left font-medium">ID</th>
                          <th className="py-3 text-left font-medium">Customer</th>
                          <th className="py-3 text-left font-medium">Package</th>
                          <th className="py-3 text-left font-medium">Date</th>
                          <th className="py-3 text-right font-medium">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {metrics.latestBookings.length > 0 ? (
                          metrics.latestBookings.map((booking) => (
                            <tr key={booking.id} className="border-b">
                              <td className="py-3">{booking.id.substring(0, 8)}</td>
                              <td className="py-3">{booking.user?.name || 'Unknown'}</td>
                              <td className="py-3">{booking.tourPackage?.name || 'Unknown'}</td>
                              <td className="py-3">{new Date(booking.createdAt).toLocaleDateString()}</td>
                              <td className="py-3 text-right">{formatCurrency(booking.totalPrice)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="py-4 text-center text-gray-500">
                              No bookings found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/agency/bookings">View All Bookings</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Booking Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Pending</p>
                        <p className="text-sm font-medium">{metrics.pendingBookings} / {metrics.totalBookings}</p>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-500" 
                          style={{ width: `${metrics.totalBookings ? (metrics.pendingBookings / metrics.totalBookings) * 100 : 0}%` }}>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Completed</p>
                        <p className="text-sm font-medium">{metrics.completedBookings} / {metrics.totalBookings}</p>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500" 
                          style={{ width: `${metrics.totalBookings ? (metrics.completedBookings / metrics.totalBookings) * 100 : 0}%` }}>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Cancelled</p>
                        <p className="text-sm font-medium">{metrics.cancelledBookings} / {metrics.totalBookings}</p>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-500" 
                          style={{ width: `${metrics.totalBookings ? (metrics.cancelledBookings / metrics.totalBookings) * 100 : 0}%` }}>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </>
  );
}; 