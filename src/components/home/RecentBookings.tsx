import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import BookingCard from './BookingCard';

export interface Booking {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  price: number;
  currency: string;
  travelers: number;
  status: 'upcoming' | 'completed' | 'cancelled' | 'pending' | 'confirmed';
  agency?: string;
}

interface RecentBookingsProps {
  bookings: Booking[];
  isLoading?: boolean;
  title?: string;
  onViewBooking?: (bookingId: string) => void;
}

const RecentBookings: React.FC<RecentBookingsProps> = ({
  bookings,
  isLoading = false,
  title = 'Recent Bookings',
  onViewBooking
}) => {
  const handleBookingClick = (bookingId: string) => {
    if (onViewBooking) {
      onViewBooking(bookingId);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <>
            <BookingSkeleton />
            <BookingSkeleton />
            <BookingSkeleton />
          </>
        ) : bookings.length > 0 ? (
          bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              {...booking}
              onClick={() => handleBookingClick(booking.id)}
            />
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            No bookings found
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const BookingSkeleton = () => (
  <div className="flex items-center space-x-4 p-3">
    <Skeleton className="h-16 w-16 rounded-md" />
    <div className="space-y-2 flex-1">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-44" />
      <Skeleton className="h-3 w-20" />
    </div>
    <div className="flex flex-col items-end space-y-2">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  </div>
);

export default RecentBookings; 