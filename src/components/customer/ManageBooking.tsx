import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowLeft, AlertCircle, Send } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

import { Textarea } from '../../components/ui/textarea';
import { customerAPI } from '../../services/api';
import { Booking } from '../../types/index';
import { Separator } from '../ui/separator';

export default function ManageBooking() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchBookingDetails() {
      if (!bookingId) {
        setError('No booking ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await customerAPI.getBookingById(bookingId);
        console.log('API Response:', response);
        if (response.data && response.data.data) {
          setBooking(response.data.data);
        } else {
          throw new Error('Invalid response structure');
        }
      } catch (err: any) {
        console.error('Error fetching booking details:', err);
        setError(err.response?.data?.message || 'Failed to load booking details.');
        toast.error('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    }
    fetchBookingDetails();
  }, [bookingId]);

  const handleCancelRequest = async () => {
    if (!bookingId || !cancellationReason) {
      toast.error('Please provide a cancellation reason.');
      return;
    }

    setSubmitting(true);
    try {
      await customerAPI.requestCancellation(bookingId, cancellationReason);
      toast.success('Cancellation request submitted successfully.');
      setCancellationReason('');
      // Refresh booking details
      const response = await customerAPI.getBookingById(bookingId);
      if (response.data && response.data.data) {
        setBooking(response.data.data);
      }
    } catch (err: any) {
      console.error('Error submitting cancellation request:', err);
      toast.error(err.response?.data?.message || 'Failed to submit cancellation request.');
    } finally {
      setSubmitting(false);
    }
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

  if (error || !booking) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertCircle className="h-6 w-6 mr-2" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{error || 'Booking not found'}</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate('/bookings')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Bookings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const canRequestCancellation =
    booking.status === 'PENDING' ||
    booking.status === 'CONFIRMED' ||
    booking.status === 'PENDING_APPROVAL' ||
    booking.status === 'PENDING_PAYMENT';

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <Button variant="outline" className="mb-6" onClick={() => navigate('/bookings')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Bookings
        </Button>

        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle>Manage Booking</CardTitle>
            <p className="text-sm text-gray-600">Booking Reference: {booking.id}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Booking Status */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Booking Status</h3>
              <p className="text-gray-600">
                Status: <span className={`font-medium ${booking.status === 'CONFIRMED' ? 'text-green-600' : 'text-red-600'}`}>{booking.status}</span>
              </p>
              <p className="text-gray-600">
                Payment Status: <span className={`font-medium ${booking.paymentStatus === 'SUCCESS' ? 'text-green-600' : 'text-red-600'}`}>{booking.paymentStatus}</span>
              </p>
              {booking.refundRequested && (
                <p className="text-gray-600">
                  Refund Status: <span className={`font-medium ${booking.refundStatus === 'APPROVED' ? 'text-green-600' : 'text-red-600'}`}>{booking.refundStatus}</span>
                </p>
              )}
            </div>

            <Separator />

            {/* Cancellation Request */}
            {canRequestCancellation && !booking.refundRequested ? (
              <div>
                <h3 className="font-semibold text-lg mb-2">Request Cancellation</h3>
                <p className="text-gray-600 mb-4">Provide a reason for cancellation. This will be reviewed by the agency.</p>
                <Textarea
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="Enter cancellation reason..."
                  className="mb-4"
                />
                <Button
                  onClick={handleCancelRequest}
                  disabled={submitting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {submitting ? 'Submitting...' : 'Request Cancellation'}
                </Button>
              </div>
            ) : booking.refundRequested ? (
              <div>
                <h3 className="font-semibold text-lg mb-2">Cancellation Status</h3>
                <p className="text-gray-600">Your cancellation request is {booking.refundStatus?.toLowerCase()}.</p>
              </div>
            ) : (
              <div>
                <h3 className="font-semibold text-lg mb-2">Cancellation</h3>
                <p className="text-gray-600">Cancellation is not available for this booking status.</p>
              </div>
            )}

            <Separator />

            {/* Contact Support */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Contact Support</h3>
              <p className="text-gray-600 mb-4">Need assistance? Reach out to our support team.</p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link to="/support" className="flex items-center">
                  <Send className="h-4 w-4 mr-2" />
                  Contact Support
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}