import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Spinner } from '../ui/spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';


type BookingType = {
  id: string;
  packageName: string;
  customerName: string;
  bookingDate: string;
  startDate: string;
  endDate: string;
  amount: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
};

type AgencyBookingsListProps = {
  agencyId: string;
};

export function AgencyBookingsList({ agencyId }: AgencyBookingsListProps) {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Mock data for development
        const mockBookings: BookingType[] = [
          {
            id: "booking123",
            packageName: "Bali Adventure",
            customerName: "John Smith",
            bookingDate: "2023-06-10T08:30:00Z",
            startDate: "2023-07-15T00:00:00Z",
            endDate: "2023-07-22T00:00:00Z",
            amount: 1299.99,
            status: "CONFIRMED"
          },
          {
            id: "booking456",
            packageName: "Paris Getaway",
            customerName: "Sarah Johnson",
            bookingDate: "2023-06-15T14:45:00Z",
            startDate: "2023-08-05T00:00:00Z",
            endDate: "2023-08-12T00:00:00Z",
            amount: 2499.99,
            status: "PENDING"
          },
          {
            id: "booking789",
            packageName: "Tokyo Explorer",
            customerName: "David Williams",
            bookingDate: "2023-06-05T11:20:00Z",
            startDate: "2023-06-25T00:00:00Z",
            endDate: "2023-07-05T00:00:00Z",
            amount: 3199.99,
            status: "COMPLETED"
          }
        ];
        
        setBookings(mockBookings);
        setFilteredBookings(mockBookings);
        
        // Uncomment when API is ready
        // const response = await adminAPI.getBookings({ agencyId });
        // setBookings(response.data.bookings);
        // setFilteredBookings(response.data.bookings);
      } catch (err) {
        console.error('Error fetching agency bookings:', err);
        setError('Failed to load bookings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [agencyId]);

  useEffect(() => {
    let filtered = [...bookings];
    
    // Apply status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        booking =>
          booking.packageName.toLowerCase().includes(lowercaseQuery) ||
          booking.customerName.toLowerCase().includes(lowercaseQuery) ||
          booking.id.toLowerCase().includes(lowercaseQuery)
      );
    }
    
    setFilteredBookings(filtered);
  }, [searchQuery, statusFilter, bookings]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
  };

  // Status badge color mapping
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'REFUNDED':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-red-50 rounded-lg">
        <p className="text-red-600 mb-4">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Bookings
            </CardTitle>
            <CardDescription>
              {bookings.length > 0
                ? `${bookings.length} bookings for this agency`
                : 'No bookings found for this agency'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by booking ID, package or customer..."
              className="pl-10"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="REFUNDED">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredBookings.length > 0 ? (
          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Travel Dates</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm text-gray-900">#{booking.id.substring(0, 8)}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm">{booking.packageName}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm">{booking.customerName}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm">{formatDate(booking.bookingDate)}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm">{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm">${booking.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge className={getStatusBadgeClass(booking.status)}>{booking.status}</Badge>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/admin/bookings/${booking.id}`)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-md">
            {searchQuery || statusFilter !== 'ALL' ? (
              <>
                <Filter className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-gray-500 mb-4">No bookings match your current filters.</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('ALL');
                  }}
                >
                  Clear Filters
                </Button>
              </>
            ) : (
              <>
                <Calendar className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-gray-500 mb-4">This agency doesn't have any bookings yet.</p>
              </>
            )}
          </div>
        )}
      </CardContent>
      {filteredBookings.length > 0 && (
        <CardFooter>
          <Button 
            variant="outline" 
            onClick={() => navigate(`/admin/bookings?agencyId=${agencyId}`)}
            className="w-full"
          >
            View All Bookings
          </Button>
        </CardFooter>
      )}
    </Card>
  );
} 