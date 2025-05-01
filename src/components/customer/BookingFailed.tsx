import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { AlertCircle, ArrowLeft, Calendar, Users } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { customerAPI } from '../../services/api';
import { formatCurrency } from '../../lib/utils';
import { TourPackage } from '../../services/api';

interface BookingDetails {
  id: string;
  tourPackage: TourPackage;
  numberOfPeople: number;
  totalPrice: number;
  platformFee: number;
  paymentMode: 'FULL' | 'PARTIAL';
  status: string;
  paymentStatus: string;
  cashfreeOrderId: string;
  transactionId: string;
  customer: {
    user: {
      name: string;
      email: string;
      phone: string;
    };
  };
  travelers: Array<{
    fullName: string;
    email: string | null;
    phoneNumber: string | null;
    documents: Array<{
      id: string;
      documentType: string;
      documentNumber: string;
      fileUrl: string | null;
    }>;
  }>;
  specialRequests: string | null;
  invoiceUrl: string | null;
}

export default function BookingFailure() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingDetails>({} as BookingDetails);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const bookingId = searchParams.get('bookingId');

  useEffect(() => {
    async function fetchFailureDetails() {
      if (!bookingId) {
        setError('No booking ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await customerAPI.getPaymentBookingFailure(bookingId);
        console.log('API Response:', response);
        if (response.data) {
          setBooking(response.data.data);
          setError(response.data.message);
          toast.error(response.data.message || 'Payment or booking failed. Please try again.');
        } else {
          throw new Error('Invalid response structure');
        }
      } catch (err: any) {
        console.error('Error fetching failure details:', err);
        setError(err.response?.data?.message || 'Failed to load failure details. Please try again.');
        toast.error('Failed to load failure details');
      } finally {
        setLoading(false);
      }
    }

    fetchFailureDetails();
  }, [bookingId]);

  const handleRetryBooking = () => {
    if (booking) {
      // Redirect to booking creation page with tour package details
      navigate(`/book-tour?tourId=${booking.tourPackage.id}`);
    } else {
      // Redirect to home or tour listing
      navigate('/tours');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertCircle className="h-6 w-6 mr-2" />
              Failure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (booking && !booking.tourPackage) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertCircle className="h-6 w-6 mr-2" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Tour package details are missing.</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4"
          >
            <AlertCircle className="h-8 w-8 text-red-600" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking and Payment Failed</h1>
          <p className="text-lg text-gray-600">
            We're sorry, but your booking or payment could not be processed. Please try again or contact support.
          </p>
        </div>

        <Card className="bg-white shadow-md overflow-hidden">
          {/* Booking Reference */}
          <div className="p-6 bg-gray-50 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Booking Reference</p>
                <p className="text-xl font-semibold text-gray-900">{booking.id}</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Button
                  variant="default"
                  size="sm"
                  className="flex items-center bg-blue-600 hover:bg-blue-700"
                  onClick={handleRetryBooking}
                >
                  Retry Booking
                </Button>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-4">Tour Details</h3>
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-20 h-20 flex-shrink-0">
                  <img
                    src={booking.tourPackage.coverImage || '/placeholder.jpg'}
                    alt={booking.tourPackage.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{booking.tourPackage.title}</h4>
                  <p className="text-sm text-gray-600 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {booking.tourPackage.duration} Days
                  </p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {booking.numberOfPeople} {booking.numberOfPeople === 1 ? 'Person' : 'People'}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-900">{booking.customer.user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{booking.customer.user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{booking.customer.user.phone || 'N/A'}</p>
                </div>
              </div>
            </div>

            {booking.specialRequests && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Special Requests</h3>
                  <p className="text-gray-700">{booking.specialRequests}</p>
                </div>
              </>
            )}

            <Separator />

            <div>
              <h3 className="font-semibold text-lg mb-4">Payment Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per person</span>
                  <span>{formatCurrency(booking.tourPackage.pricePerPerson, 'INR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Number of travelers</span>
                  <span>× {booking.numberOfPeople}</span>
                </div>
                {booking.paymentMode === 'PARTIAL' && (
                  <>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium">
                      <span>Deposit Attempted</span>
                      <span>{formatCurrency(booking.platformFee, 'INR')}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Remaining (pay at agency)</span>
                      <span>{formatCurrency(booking.totalPrice - booking.platformFee, 'INR')}</span>
                    </div>
                  </>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Price</span>
                  <span className="text-red-600">{formatCurrency(booking.totalPrice, 'INR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Mode</span>
                  <span>{booking.paymentMode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cashfree Order ID</span>
                  <span>{booking.cashfreeOrderId || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID</span>
                  <span>{booking.transactionId || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <span className="text-red-600">{booking.paymentStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking Status</span>
                  <span className="text-red-600">{booking.status}</span>
                </div>
              </div>
            </div>

            <div className="p-4 mt-4 bg-red-50 rounded-md text-sm text-red-800">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Booking and Payment Failure</p>
                  <p className="mt-1">
                    {error}. Please retry or contact support at{' '}
                    <a href="mailto:support@safarway.com" className="underline">
                      support@safarway.com
                    </a>.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>

          <div className="p-6 bg-gray-50 border-t">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleRetryBooking}>
                Retry Booking
              </Button>
              <Button variant="outline" asChild>
                <Link to="/">Return to Home</Link>
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}