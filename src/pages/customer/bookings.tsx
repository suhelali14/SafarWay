import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import CustomerBookingCard from '../../components/customer/BookingCard';
import CustomerLayout from '../../layouts/CustomerLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Calendar, Search, Filter, AlertCircle, Plus, FileText } from 'lucide-react';
import { useToast } from '../../components/ui/use-toast';
import { Spinner } from '../../components/ui/spinner';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { getBookings } from '../../services/api';
import BookingList from '../../components/customer/BookingList';
import { PageHeader } from '../../components/ui/page-header';

// Mock data - replace with actual API calls
const mockBookings = [
  {
    id: '123456',
    destination: 'Bali, Indonesia',
    startDate: '2023-12-10',
    endDate: '2023-12-17',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
    price: 1200,
    currency: 'USD',
    travelers: 2,
    status: 'upcoming' as const,
    agency: {
      name: 'Paradise Travels'
    },
    bookingReference: 'BKG-12345',
    paymentStatus: 'paid' as const
  },
  {
    id: '123457',
    destination: 'Paris, France',
    startDate: '2023-11-05',
    endDate: '2023-11-12',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
    price: 1800,
    currency: 'USD',
    travelers: 2,
    status: 'completed' as const,
    agency: {
      name: 'Europe Explorers'
    },
    bookingReference: 'BKG-12346',
    paymentStatus: 'paid' as const
  },
  {
    id: '123458',
    destination: 'Tokyo, Japan',
    startDate: '2024-02-15',
    endDate: '2024-02-25',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26',
    price: 2400,
    currency: 'USD',
    travelers: 1,
    status: 'confirmed' as const,
    agency: {
      name: 'Asia Adventures'
    },
    bookingReference: 'BKG-12347',
    paymentStatus: 'partial' as const
  },
  {
    id: '123459',
    destination: 'New York, USA',
    startDate: '2023-10-12',
    endDate: '2023-10-17',
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
    price: 1100,
    currency: 'USD',
    travelers: 3,
    status: 'cancelled' as const,
    agency: {
      name: 'American Tours'
    },
    bookingReference: 'BKG-12348',
    paymentStatus: 'refunded' as const
  },
  {
    id: '123460',
    destination: 'Santorini, Greece',
    startDate: '2024-06-20',
    endDate: '2024-06-27',
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff',
    price: 2200,
    currency: 'USD',
    travelers: 2,
    status: 'pending' as const,
    agency: {
      name: 'Mediterranean Getaways'
    },
    bookingReference: 'BKG-12349',
    paymentStatus: 'pending' as const
  }
];

type BookingStatus = 'all' | 'upcoming' | 'completed' | 'cancelled' | 'pending' | 'confirmed';

const BookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<typeof mockBookings>([]);
  const [filteredBookings, setFilteredBookings] = useState<typeof mockBookings>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<BookingStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        // Replace with actual API call when ready
        // const response = await getBookings();
        // setBookings(response.data);
        
        // Using mock data for now
        setTimeout(() => {
          setBookings(mockBookings);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
        setError('Failed to load your bookings. Please try again later.');
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    const filterAndSortBookings = () => {
      let filtered = [...bookings];
      
      // Apply status filter
      if (activeTab !== 'all') {
        filtered = filtered.filter(booking => booking.status === activeTab);
      }
      
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(booking => 
          booking.destination.toLowerCase().includes(query) ||
          booking.bookingReference?.toLowerCase().includes(query) ||
          booking.agency?.name.toLowerCase().includes(query)
        );
      }
      
      // Apply sorting
      switch (sortBy) {
        case 'date-asc':
          filtered.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
          break;
        case 'date-desc':
          filtered.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
          break;
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        default:
          break;
      }
      
      setFilteredBookings(filtered);
    };
    
    filterAndSortBookings();
  }, [bookings, activeTab, searchQuery, sortBy]);

  const handleViewDetails = (id: string) => {
    navigate(`/customer/bookings/${id}`);
  };

  const handleCancelBooking = (id: string) => {
    // Confirmation dialog would be good here
    toast({
      title: 'Cancellation Request',
      description: 'Your cancellation request has been submitted. We will process it shortly.',
      variant: 'default',
    });
    
    // In a real app, make an API call to cancel the booking
    // Then refresh the bookings list
  };

  const handleDownloadInvoice = (id: string) => {
    toast({
      title: 'Downloading Invoice',
      description: 'Your invoice will be downloaded shortly.',
      variant: 'default',
    });
    
    // In a real app, make an API call to get the invoice PDF
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </CustomerLayout>
    );
  }

  if (error) {
    return (
      <CustomerLayout>
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <Helmet>
        <title>My Bookings | SafarWay</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Bookings</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => navigate('/customer/bookings/download-history')}
            >
              <FileText className="mr-2 h-4 w-4" />
              Booking History
            </Button>
            <Button 
              onClick={() => navigate('/customer/packages')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Book New Trip
            </Button>
          </div>
        </div>
        
        <Tabs 
          defaultValue="all" 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as BookingStatus)}
          className="w-full"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Bookings</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by destination, reference or agency..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Latest first</SelectItem>
                <SelectItem value="date-asc">Oldest first</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <TabsContent value="all" className="mt-0">
            <BookingList bookings={filteredBookings} isLoading={loading} />
          </TabsContent>
          
          {['upcoming', 'confirmed', 'pending', 'completed', 'cancelled'].map((status) => (
            <TabsContent key={status} value={status} className="mt-0">
              <BookingList bookings={filteredBookings} isLoading={loading} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </CustomerLayout>
  );
};

export default BookingsPage; 