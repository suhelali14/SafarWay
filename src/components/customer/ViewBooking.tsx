import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowLeft, Calendar, Users, Download, Mail, FileText } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { customerAPI } from '../../services/api';
import { Booking } from '../../types/index';
import { formatCurrency, formatDate } from '../../lib/utils';

export default function ViewBooking() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

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

    async function handleDownloadInvoice() {
      if (!bookingId) return;
      try {
        const response = await customerAPI.downloadInvoice(bookingId);
        const url = response.data.data.url;
        setDownloadUrl(url);
      } catch (err) {
        console.error('Error fetching invoice URL:', err);
        toast.error('Failed to fetch invoice URL.');
      }
    }

    fetchBookingDetails().then(handleDownloadInvoice);
  }, [bookingId]);

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      document.body.appendChild(link);
      link.click();
      toast.success('Invoice downloaded successfully!');
    } else {
      toast.error('No invoice available.');
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
            <CardTitle className="text-red-600">Error</CardTitle>
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

        <Card className="bg-white shadow-md overflow-hidden">
          <div className="p-6 bg-gray-50 border-b">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <p className="text-sm text-gray-500">Booking Reference</p>
                <p className="text-xl font-semibold text-gray-900">{booking.id}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center hover:bg-gray-100"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>
            </div>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Tour Details */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Tour Details</h3>
              <div className="flex items-start gap-4 mb-6">
                <img
                  src={booking.tourPackage.coverImage || '/placeholder.jpg'}
                  alt={booking.tourPackage.title}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div>
                  <h4 className="font-medium text-gray-900">{booking.tourPackage.title}</h4>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(booking.startDate)} - {booking.endDate ? formatDate(booking.endDate) : 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {booking.numberOfPeople} {booking.numberOfPeople === 1 ? 'Person' : 'People'}
                  </p>
                  <p className="text-sm text-gray-600">Type: {booking.tourPackage.tourType}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Agency Details */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Agency Details</h3>
              <p className="text-gray-600">Name: {booking.agency.name}</p>
              <p className="text-gray-600">Email: {booking.agency.contactEmail}</p>
              <p className="text-gray-600">Phone: {booking.agency.contactPhone}</p>
            </div>

            <Separator />

            {/* Traveler Details */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Traveler Details</h3>
              {booking.travelers.map((traveler) => (
                <div key={traveler.id} className="mb-4 p-4 bg-gray-50 rounded-md">
                  <p className="font-medium text-gray-900">{traveler.fullName}</p>
                  <p className="text-sm text-gray-600">DOB: {formatDate(traveler.dateOfBirth)}</p>
                  <p className="text-sm text-gray-600">Email: {traveler.email || 'N/A'}</p>
                  <p className="text-sm text-gray-600">Phone: {traveler.phoneNumber || 'N/A'}</p>
                  {traveler.documents.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700">Documents:</p>
                      {traveler.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center gap-2 text-sm text-gray-600">
                          <FileText className="h-4 w-4" />
                          {doc.documentType}: {doc.documentNumber}
                          {doc.fileUrl && (
                            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              View
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Separator />

            {/* Payment Details */}
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
                    <div className="flex justify-between">
                      <span className="text-gray-600">Platform Fee Paid</span>
                      <span>{formatCurrency(booking.platformFee, 'INR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Remaining (Offline)</span>
                      <span>{formatCurrency(booking.totalPrice - booking.platformFee, 'INR')}</span>
                    </div>
                  </>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Price</span>
                  <span className="text-blue-600">{formatCurrency(booking.totalPrice, 'INR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Mode</span>
                  <span>{booking.paymentMode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <span className={`font-medium ${booking.paymentStatus === 'SUCCESS' ? 'text-green-600' : 'text-red-600'}`}>
                    {booking.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking Status</span>
                  <span className={`font-medium ${booking.status === 'CONFIRMED' ? 'text-green-600' : 'text-red-600'}`}>
                    {booking.status}
                  </span>
                </div>
                {booking.refundRequested && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Refund Status</span>
                    <span className={`font-medium ${booking.refundStatus === 'APPROVED' ? 'text-green-600' : 'text-red-600'}`}>
                      {booking.refundStatus || 'N/A'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 mt-4 bg-blue-50 rounded-md text-sm text-blue-800">
              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Booking Updates</p>
                  <p>All updates have been sent to {booking.customer.user.email}</p>
                </div>
              </div>
            </div>
          </CardContent>

          <div className="p-6 bg-gray-50 border-t">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link to={`/bookings/${booking.id}/manage`}>Manage Booking</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/bookings">Back to My Bookings</Link>
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}