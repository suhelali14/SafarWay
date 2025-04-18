import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingCard from './BookingCard';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Search, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { DatePicker } from '../ui/date-picker';

interface Booking {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  price: number;
  currency: string;
  travelers: number;
  status: 'upcoming' | 'confirmed' | 'pending' | 'completed' | 'cancelled';
  agency: {
    name: string;
  };
  bookingReference: string;
  paymentStatus: 'paid' | 'partial' | 'pending' | 'refunded';
}

interface BookingListProps {
  bookings: Booking[];
  isLoading?: boolean;
}

const BookingList: React.FC<BookingListProps> = ({ bookings, isLoading = false }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  
  // Handle view details
  const handleViewDetails = (bookingId: string) => {
    navigate(`/customer/bookings/${bookingId}`);
  };
  
  // Handle cancel booking
  const handleCancelBooking = (bookingId: string) => {
    // Show confirmation dialog here (in a real implementation)
    if (window.confirm('Are you sure you want to cancel this booking? Cancellation policies may apply.')) {
      console.log(`Cancelling booking: ${bookingId}`);
      // API call would go here
    }
  };
  
  // Handle download invoice
  const handleDownloadInvoice = (bookingId: string) => {
    console.log(`Downloading invoice for booking: ${bookingId}`);
    // API call would go here
  };
  
  // Filter bookings based on search, status, and date
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.destination.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         booking.bookingReference.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    // Filter by date if date filter is active
    let matchesDate = true;
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      const startDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);
      
      // Check if filter date is within booking date range
      matchesDate = filterDate >= startDate && filterDate <= endDate;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });
  
  // Group bookings by status for tabs
  const upcomingBookings = filteredBookings.filter(b => ['upcoming', 'confirmed'].includes(b.status));
  const pendingBookings = filteredBookings.filter(b => b.status === 'pending');
  const completedBookings = filteredBookings.filter(b => b.status === 'completed');
  const cancelledBookings = filteredBookings.filter(b => b.status === 'cancelled');
  
  if (isLoading) {
    return <div className="text-center py-10">Loading bookings...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by destination or booking reference"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center">
            <DatePicker
              date={dateFilter}
              setDate={setDateFilter}
              className="w-full md:w-[180px]"
            >
              <Button variant="outline" size="icon" className="h-10 w-10">
                <Calendar className="h-4 w-4" />
              </Button>
            </DatePicker>
            
            {dateFilter && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-1 h-10"
                onClick={() => setDateFilter(undefined)}
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="all">
            All ({filteredBookings.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedBookings.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({cancelledBookings.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4 mt-4">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No bookings found</p>
            </div>
          ) : (
            filteredBookings.map(booking => (
              <BookingCard
                key={booking.id}
                {...booking}
                onViewDetails={() => handleViewDetails(booking.id)}
                onCancelBooking={
                  ['upcoming', 'confirmed', 'pending'].includes(booking.status) 
                    ? () => handleCancelBooking(booking.id) 
                    : undefined
                }
                onDownloadInvoice={
                  booking.paymentStatus !== 'pending' 
                    ? () => handleDownloadInvoice(booking.id) 
                    : undefined
                }
              />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="upcoming" className="space-y-4 mt-4">
          {upcomingBookings.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No upcoming bookings</p>
            </div>
          ) : (
            upcomingBookings.map(booking => (
              <BookingCard
                key={booking.id}
                {...booking}
                onViewDetails={() => handleViewDetails(booking.id)}
                onCancelBooking={() => handleCancelBooking(booking.id)}
                onDownloadInvoice={
                  booking.paymentStatus !== 'pending' 
                    ? () => handleDownloadInvoice(booking.id) 
                    : undefined
                }
              />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4 mt-4">
          {pendingBookings.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No pending bookings</p>
            </div>
          ) : (
            pendingBookings.map(booking => (
              <BookingCard
                key={booking.id}
                {...booking}
                onViewDetails={() => handleViewDetails(booking.id)}
                onCancelBooking={() => handleCancelBooking(booking.id)}
                onDownloadInvoice={
                  booking.paymentStatus !== 'pending' 
                    ? () => handleDownloadInvoice(booking.id) 
                    : undefined
                }
              />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4 mt-4">
          {completedBookings.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No completed bookings</p>
            </div>
          ) : (
            completedBookings.map(booking => (
              <BookingCard
                key={booking.id}
                {...booking}
                onViewDetails={() => handleViewDetails(booking.id)}
                onDownloadInvoice={() => handleDownloadInvoice(booking.id)}
              />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="cancelled" className="space-y-4 mt-4">
          {cancelledBookings.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No cancelled bookings</p>
            </div>
          ) : (
            cancelledBookings.map(booking => (
              <BookingCard
                key={booking.id}
                {...booking}
                onViewDetails={() => handleViewDetails(booking.id)}
                onDownloadInvoice={
                  booking.paymentStatus !== 'pending' 
                    ? () => handleDownloadInvoice(booking.id) 
                    : undefined
                }
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BookingList; 