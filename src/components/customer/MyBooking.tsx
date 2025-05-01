import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Calendar, Users, Filter, SortAsc, SortDesc } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { customerAPI } from '../../services/api';
import { Booking } from '../../types/index';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    async function fetchBookings() {
      try {
        const params = {
          status: statusFilter !== 'all' ? statusFilter : undefined,
          sort: sortOrder,
        };
        const response = await customerAPI.getMyBookings(params);
        if (response.data && response.data.data) {
          setBookings(response.data.data);
        } else {
          throw new Error('Invalid response structure');
        }
      } catch (err: any) {
        console.error('Error fetching bookings:', err);
        setError(err.response?.data?.message || 'Failed to load bookings.');
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, [statusFilter, sortOrder]);

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setLoading(true);
  };

  const handleSortChange = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    setLoading(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

        {/* Filters and Sorting */}
        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="PENDING_APPROVAL">Pending Approval</SelectItem>
                <SelectItem value="PENDING_PAYMENT">Pending Payment</SelectItem>
                <SelectItem value="RESERVED">Reserved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={handleSortChange} className="flex items-center gap-2">
            {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            Sort by Date
          </Button>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-600">No bookings found.</p>
              <Button asChild className="mt-4">
                <Link to="/tours">Explore Tours</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={booking.tourPackage.coverImage || '/placeholder.jpg'}
                        alt={booking.tourPackage.title}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">{booking.tourPackage.title}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(booking.startDate)} - {booking.endDate ? formatDate(booking.endDate) : 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {booking.numberOfPeople} {booking.numberOfPeople === 1 ? 'Person' : 'People'}
                        </p>
                        <p className="text-sm text-gray-600">Status: <span className={`font-medium ${booking.status === 'CONFIRMED' ? 'text-green-600' : booking.status === 'CANCELLED' ? 'text-red-600' : 'text-blue-600'}`}>{booking.status}</span></p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-lg font-semibold">{formatCurrency(booking.totalPrice, 'INR')}</p>
                      <Button asChild variant="default">
                        <Link to={`/bookings/${booking.id}`}>View Details</Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link to={`/bookings/${booking.id}/manage`}>Manage Booking</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}