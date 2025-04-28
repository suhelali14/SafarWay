import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

import { formatCurrency, formatDate } from '../../utils/formatters';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

import { Dialog } from '../../components/ui/dialog';


interface Booking {
  id: string;
  tourId: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  numberOfParticipants: number;
  totalAmount: number;
  bookingDate: string;
  tourDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tour: {
    title: string;
    price: number;
    duration: number;
    location: string;
  };
}

export function BookingsPage() {
  const [bookings, _setBookings] = useState<Booking[]>([]);
  const [_loading, _setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, _setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // useEffect(() => {
  //   fetchBookings();
  // }, []);

  // const fetchBookings = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await customerAPI.getMyBookings();
  //     // Ensure we have a valid array of bookings
  //     const bookingsData = response?.data || [];
  //     setBookings(Array.isArray(bookingsData) ? bookingsData.map(booking => ({
  //       ...booking,
  //       tour: {
  //         title: booking.tour.title,
  //         price: booking.tour.price,
  //         duration: booking.tour.duration,
  //         location: booking.tour.location || booking.tour.destination || ''
  //       },
  //       ...booking,
  //       status: booking.status.toLowerCase() as 'pending' | 'confirmed' | 'cancelled' | 'completed'
  //     })) : []);
  //   } catch (error) {
  //     console.error('Error fetching bookings:', error);
  //     toast({
  //       message: 'Error',
  //       description: 'Failed to fetch bookings',
  //       variant: 'destructive',
  //     });
  //     setBookings([]); // Set empty array on error
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleStatusUpdate = async (bookingId: string, newStatus: Booking['status']) => {
  //   try {
  //     await customerAPI.update(bookingId, { status: newStatus });
  //     toast.success(
  //      'Booking status updated successfully',
  //   );
  //     fetchBookings();
  //   } catch (error) {
  //     toast({
  //       title: 'Error',
  //       description: 'Failed to update booking status',
  //       variant: 'destructive',
  //     });
  //   }
  // };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = 
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.tour.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bookings Management</h1>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Search className="w-4 h-4" />
          <Input
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
           
          />
        </div>
        {/* <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          placeholder="Filter by status"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </Select> */}
        
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left">Booking ID</th>
                <th className="px-6 py-3 text-left">Tour</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <motion.tr
                  key={booking.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4">#{booking.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">{booking.tour.title}</div>
                      <div className="text-sm text-gray-500">{booking.tour.location}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">{booking.customerName}</div>
                      <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">{formatDate(booking.tourDate)}</div>
                      <div className="text-sm text-gray-500">
                        Booked: {formatDate(booking.bookingDate)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{formatCurrency(booking.totalAmount)}</div>
                    <div className="text-sm text-gray-500">
                      {booking.numberOfParticipants} participants
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setIsDetailsModalOpen(true);
                        }}
                      >
                        View Details
                      </Button>
                      {booking.status === 'pending' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            // onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                          >
                            Confirm
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            // onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          // onClick={() => handleStatusUpdate(booking.id, 'completed')}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal */}
      <Dialog
        open={isDetailsModalOpen}
       
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Tour Information</h3>
                <p>{selectedBooking.tour.title}</p>
                <p className="text-sm text-gray-500">{selectedBooking.tour.location}</p>
                <p className="text-sm text-gray-500">{selectedBooking.tour.duration} days</p>
              </div>
              <div>
                <h3 className="font-medium">Customer Information</h3>
                <p>{selectedBooking.customerName}</p>
                <p className="text-sm text-gray-500">{selectedBooking.customerEmail}</p>
                <p className="text-sm text-gray-500">{selectedBooking.customerPhone}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Booking Details</h3>
                <p>Date: {formatDate(selectedBooking.tourDate)}</p>
                <p>Participants: {selectedBooking.numberOfParticipants}</p>
                <p>Total Amount: {formatCurrency(selectedBooking.totalAmount)}</p>
              </div>
              <div>
                <h3 className="font-medium">Status</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedBooking.status)}`}>
                  {selectedBooking.status}
                </span>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}