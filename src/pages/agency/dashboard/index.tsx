import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Package, 
  Users, 
  CreditCard, 
  CalendarDays, 
  TrendingUp, 
  Star,
  Plus,
  UserRound,
  BarChart3,
  Settings,
  ArrowRight,
  ChevronRight,
  CalendarCheck,
  DollarSign,
  AlertTriangle,
  Calendar
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Skeleton } from '../../../components/ui/skeleton';
import { useToast } from '../../../hooks/use-toast';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  agencyService, 
  DashboardSummary, 
  Booking, 
  AgencyProfile 
} from '../../../services/api/agencyService';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'CONFIRMED':
      return 'bg-green-100 text-green-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    case 'COMPLETED':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Skeleton for loading state
const StatCardSkeleton = () => (
  <Card>
    <CardContent className="p-6">
      <div className="space-y-3">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-10 w-1/2" />
      </div>
    </CardContent>
  </Card>
);

// Stat Card Component
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  color = "text-blue-600",
  bgColor = "bg-blue-100"
}: { 
  title: string; 
  value: string | number; 
  icon: any; 
  change?: number;
  color?: string;
  bgColor?: string;
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {change !== undefined && (
            <p className={`text-xs mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className={`${bgColor} p-3 rounded-full`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Review Card Component
interface ReviewProps {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

const ReviewCard = ({ review }: { review: ReviewProps }) => (
  <div className="border-b border-gray-200 last:border-0 pb-4 mb-4 last:pb-0">
    <div className="flex justify-between items-start">
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium text-sm">
          {review.customerName.charAt(0)}
        </div>
        <div className="ml-2">
          <p className="text-sm font-medium">{review.customerName}</p>
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                className={`h-3 w-3 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-500">{formatDate(review.date)}</p>
    </div>
    <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
  </div>
);

// Main Dashboard Component
export default function AgencyDashboardPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [refreshInterval, setRefreshInterval] = useState(600000); // 10 minutes
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  // Fetch dashboard summary
  const { 
    data: dashboardData, 
    isLoading: isDashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard
  } = useQuery({
    queryKey: ['agencyDashboard'],
    queryFn: () => agencyService.getDashboardSummary(),
    refetchInterval: refreshInterval,
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    }
  });

  // Fetch agency profile
  const { 
    data: profileData, 
    isLoading: isProfileLoading 
  } = useQuery({
    queryKey: ['agencyProfile'],
    queryFn: () => agencyService.getProfile(),
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to load agency profile',
        variant: 'destructive',
      });
    }
  });

  // Mock data for reviews - in a real application, you would fetch this from the API
  const reviews = [
    {
      id: "rev1",
      customerName: "Priya Singh",
      rating: 5,
      comment: "Excellent service! The tour was perfectly organized and the guide was knowledgeable.",
      date: "2023-05-15T10:30:00Z"
    },
    {
      id: "rev2",
      customerName: "Rahul Sharma",
      rating: 4,
      comment: "Great experience overall, but the transportation was slightly delayed.",
      date: "2023-05-10T14:20:00Z"
    },
    {
      id: "rev3",
      customerName: "Meera Patel",
      rating: 5,
      comment: "Amazing destinations and very good customer service. Will book again!",
      date: "2023-05-05T09:15:00Z"
    },
    {
      id: "rev4",
      customerName: "Vikram Malhotra",
      rating: 3,
      comment: "The tour was good but the accommodation wasn't up to the promised standards.",
      date: "2023-04-28T16:45:00Z"
    },
    {
      id: "rev5",
      customerName: "Aisha Khan",
      rating: 5,
      comment: "Perfect holiday! Every detail was taken care of. Highly recommended!",
      date: "2023-04-20T11:10:00Z"
    }
  ];

  // Calculate average rating
  const avgRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  // Get rating distribution
  const ratingDistribution = Array.from({ length: 5 }, (_, i) => {
    const starCount = i + 1;
    const count = reviews.filter(r => r.rating === starCount).length;
    const percentage = (count / reviews.length) * 100;
    return { star: starCount, count, percentage };
  }).reverse();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await agencyService.getDashboardSummary(timeRange);
        setSummary(data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange]);

  const bookingsChartData = {
    labels: summary?.bookingStats.labels || [],
    datasets: [
      {
        label: 'Bookings',
        data: summary?.bookingStats.datasets.bookings || [],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const revenueChartData = {
    labels: summary?.bookingStats.labels || [],
    datasets: [
      {
        label: 'Revenue',
        data: summary?.bookingStats.datasets.revenue || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const getBookingStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      'CONFIRMED': 'success',
      'PENDING': 'warning',
      'CANCELLED': 'destructive',
      'COMPLETED': 'default',
    };
    return statusMap[status] || 'default';
  };

  return (
    <>
      <Helmet>
        <title>Agency Dashboard | SafarWay</title>
      </Helmet>

      <div className="p-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Agency Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Welcome back, {user?.name || 'Admin'}!
            </p>
          </div>
          
          {!isProfileLoading && profileData && (
            <div className="flex items-center mt-4 md:mt-0">
              {profileData.logo ? (
                <img 
                  src={profileData.logo} 
                  alt={profileData.name} 
                  className="h-10 w-10 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {profileData.name.charAt(0)}
                </div>
              )}
              <div className="ml-3">
                <h2 className="font-semibold">{profileData.name}</h2>
                <Badge 
                  variant={profileData.status === 'VERIFIED' ? 'success' : profileData.status === 'PENDING' ? 'warning' : 'secondary'}
                  className="text-xs"
                >
                  {profileData.status}
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* KPI Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {isDashboardLoading ? (
            <>
              {Array.from({ length: 6 }).map((_, i) => (
                <StatCardSkeleton key={i} />
              ))}
            </>
          ) : dashboardError ? (
            <Card className="col-span-full">
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <p className="text-red-500 mb-4">Failed to load dashboard data</p>
                <Button onClick={() => refetchDashboard()}>Retry</Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <StatCard 
                title="Total Customers" 
                value={dashboardData?.totalCustomers || 0}
                icon={Users}
                color="text-indigo-600"
                bgColor="bg-indigo-100"
              />
              
              <StatCard 
                title="Active Packages" 
                value={dashboardData?.activePackages || 0}
                icon={Package}
                color="text-emerald-600"
                bgColor="bg-emerald-100"
              />
              
              <StatCard 
                title="Upcoming Trips" 
                value={dashboardData?.upcomingPackages || 0}
                icon={CalendarDays}
                color="text-amber-600"
                bgColor="bg-amber-100"
              />
              
              <StatCard 
                title="Completed Bookings" 
                value={dashboardData?.completedBookings || 0}
                icon={TrendingUp}
                color="text-blue-600"
                bgColor="bg-blue-100"
              />
              
              <StatCard 
                title="Total Revenue" 
                value={formatCurrency(dashboardData?.totalRevenue || 0)}
                icon={CreditCard}
                color="text-purple-600"
                bgColor="bg-purple-100"
              />
              
              <StatCard 
                title="Customer Rating" 
                value={avgRating.toFixed(1) + ' / 5.0'}
                icon={Star}
                color="text-yellow-600"
                bgColor="bg-yellow-100"
              />
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Package Performance Table */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Package Performance</CardTitle>
                <CardDescription>
                  Your top performing packages and their status
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="h-8">
                <Link to="/agency/packages" className="flex items-center">
                  View All <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {isDashboardLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : dashboardData?.packages?.length ? (
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="px-4 py-3 text-left font-medium">Package Name</th>
                          <th className="px-4 py-3 text-left font-medium">Validity</th>
                          <th className="px-4 py-3 text-center font-medium">Bookings</th>
                          <th className="px-4 py-3 text-left font-medium">Status</th>
                          <th className="px-4 py-3 text-right font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.packages.map((pkg) => (
                          <tr key={pkg.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap">{pkg.title}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {formatDate(pkg.validFrom)} - {formatDate(pkg.validTill)}
                              {new Date(pkg.validTill) < new Date() && (
                                <Badge variant="destructive" className="ml-2">Expired</Badge>
                              )}
                              {new Date(pkg.validTill) > new Date() && 
                                new Date(pkg.validTill) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
                                <Badge variant="warning" className="ml-2">Expiring Soon</Badge>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center whitespace-nowrap">{pkg.bookingsCount}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <Badge className={
                                pkg.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                                pkg.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }>
                                {pkg.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-right whitespace-nowrap">
                              <Button variant="ghost" size="sm" asChild>
                                <Link to={`/agency/packages/${pkg.id}/edit`}>
                                  Edit
                                </Link>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Package className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No Packages Created</h3>
                  <p className="text-gray-500 mb-4">Start by creating your first tour package</p>
                  <Button asChild>
                    <Link to="/agency/packages/create">
                      Create Package <Plus className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Activity Feed */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Recent Customer Activity</CardTitle>
                <CardDescription>
                  Latest bookings and interactions
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="h-8">
                <Link to="/agency/bookings" className="flex items-center">
                  View All <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {isDashboardLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-start space-x-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : dashboardData?.recentBookings?.length ? (
                <div className="space-y-6">
                  {dashboardData.recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-start space-x-4">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium">
                        {booking.customer.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium">{booking.customer}</p>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          Booked {booking.package} for {formatDate(booking.date)}
                        </p>
                        <div className="flex justify-between mt-2">
                          <span className="text-xs text-gray-500">{formatDate(booking.date)}</span>
                          <span className="text-xs font-medium">₹{booking.amount}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Users className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No Recent Bookings</h3>
                  <p className="text-gray-500">Customer bookings will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Reviews and Revenue Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Monthly revenue over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              {isDashboardLoading ? (
                <Skeleton className="h-80 w-full" />
              ) : dashboardData?.chartData ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dashboardData.chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`₹${value}`, 'Revenue']}
                        cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                      />
                      <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-80 text-center">
                  <BarChart3 className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No Revenue Data</h3>
                  <p className="text-gray-500">Revenue data will be displayed here</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ratings & Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Ratings & Reviews</CardTitle>
              <CardDescription>
                Average rating: <span className="font-medium">{avgRating.toFixed(1)} out of 5</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Rating distribution */}
                <div className="space-y-2">
                  {ratingDistribution.map((item) => (
                    <div key={item.star} className="flex items-center">
                      <div className="flex items-center w-20">
                        <span className="text-sm font-medium mr-2">{item.star}</span>
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 ml-2 w-10">{item.count}</span>
                    </div>
                  ))}
                </div>

                {/* Recent reviews */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-4">Recent Reviews</h4>
                  <div className="space-y-4">
                    {reviews.slice(0, 3).map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/agency/reviews">
                  View All Reviews <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="fixed bottom-6 right-6 z-10">
          <div className="bg-white shadow-lg rounded-full p-4 flex space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild className="rounded-full h-12 w-12 bg-blue-600">
                <Link to="/agency/packages/create" title="Add New Package">
                  <Plus className="h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild variant="outline" className="rounded-full h-12 w-12">
                <Link to="/agency/users" title="Manage Users">
                  <UserRound className="h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild variant="outline" className="rounded-full h-12 w-12">
                <Link to="/agency/reports" title="View Reports">
                  <BarChart3 className="h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild variant="outline" className="rounded-full h-12 w-12">
                <Link to="/agency/settings" title="Agency Settings">
                  <Settings className="h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
} 