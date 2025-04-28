import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { Skeleton } from '../../components/ui/skeleton';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Calendar, MapPin, Users, Clock, Landmark, AlertTriangle } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { formatCurrency } from '../../utils/formatters';
import { toast } from 'react-hot-toast';
import { bookingService } from '../../services/api/bookingService';
import { Booking } from '../../components/home/RecentBookings';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';

const BookingDetails: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!bookingId) return;

    const fetchBookingDetails = async () => {
      try {
        setIsLoading(true);
        const data = await bookingService.getBookingById(bookingId);
        setBooking(data);
      } catch (error) {
        toast.error('Failed to load booking details');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handleCancelBooking = async () => {
    if (!booking || !bookingId || booking.status === 'cancelled') return;
    
    if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }

    try {
      setIsCancelling(true);
      const updatedBooking = await bookingService.cancelBooking(bookingId);
      setBooking(updatedBooking);
      toast.success('Booking cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel booking');
      console.error(error);
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'upcoming': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Helmet>
        <title>Booking Details | SafarWay</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6 pl-0" 
          onClick={() => navigate('/bookings')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bookings
        </Button>

        {isLoading ? (
          <BookingDetailsSkeleton />
        ) : booking ? (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">{booking.destination}</CardTitle>
                      <CardDescription>Booking ID: {booking.id}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(booking.status)} label= {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}>
                     
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg overflow-hidden h-64 bg-gray-200">
                    {booking.imageUrl && (
                      <img 
                        src={booking.imageUrl} 
                        alt={booking.destination} 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-lg mb-4">Trip Details</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-5 w-5 text-gray-500" />
                          <span>{booking.destination}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-5 w-5 text-gray-500" />
                          <span>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="mr-2 h-5 w-5 text-gray-500" />
                          <span>{booking.travelers} Traveler{booking.travelers !== 1 ? 's' : ''}</span>
                        </div>
                        {booking.agency && (
                          <div className="flex items-center">
                            <Landmark className="mr-2 h-5 w-5 text-gray-500" />
                            <span>{booking.agency}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-lg mb-4">Payment Details</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Total Payment:</span>
                          <span className="font-semibold">{formatCurrency(booking.price, booking.currency)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {booking.status === 'upcoming' && (
                    <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Important Information</AlertTitle>
                      <AlertDescription>
                        This booking can be cancelled up to 48 hours before the start date. Cancellations after this period may be subject to penalties.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between border-t p-6">
                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => window.print()}
                    >
                      Print Itinerary
                    </Button>
                    {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                      <Button 
                        variant="destructive" 
                        onClick={handleCancelBooking}
                        disabled={isCancelling}
                      >
                        {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Booking Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold">Booking Created</p>
                        <p className="text-sm text-gray-500">{formatDate(booking.startDate)}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                          <Calendar className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold">Trip Start Date</p>
                        <p className="text-sm text-gray-500">{formatDate(booking.startDate)}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100">
                          <Calendar className="h-4 w-4 text-purple-600" />
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold">Trip End Date</p>
                        <p className="text-sm text-gray-500">{formatDate(booking.endDate)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Booking Not Found</h2>
              <p className="text-gray-500 mb-4">The booking you're looking for doesn't exist or you don't have permission to view it.</p>
              <Button onClick={() => navigate('/bookings')}>Return to Bookings</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

const BookingDetailsSkeleton = () => (
  <div className="grid md:grid-cols-3 gap-6">
    <div className="md:col-span-2">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-64 w-full rounded-lg" />
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
            <div>
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6">
          <div className="flex gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </CardFooter>
      </Card>
    </div>
    <div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start">
              <Skeleton className="h-8 w-8 rounded-full mr-3" />
              <div>
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Separator />
            <div className="flex items-start">
              <Skeleton className="h-8 w-8 rounded-full mr-3" />
              <div>
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Separator />
            <div className="flex items-start">
              <Skeleton className="h-8 w-8 rounded-full mr-3" />
              <div>
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default BookingDetails; 