import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { CheckCircle, AlertCircle, ArrowLeft, Calendar, Users, Download, Mail } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { customerAPI } from '../../services/api';
import { formatCurrency } from '../../lib/utils';


interface BookingDetails {
    id: string;
    tourPackage: {
      title: string;
      duration: number;
      pricePerPerson: number;
      coverImage: string;
    };
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
    invoiceUrl: string | null; // Add invoiceUrl
  }

export default function BookingConfirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const bookingId = searchParams.get('bookingId');

  useEffect(() => {
    async function fetchBookingDetails() {
      if (!bookingId) {
        setError('No booking ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await customerAPI.getPaymentSuccess(bookingId);
        console.log('API Response:', response); // Debug response
        if (response.data && response.data.data) {
          setBooking(response.data.data);
          if (response.data.data.paymentStatus === 'SUCCESS') {
            toast.success('Payment confirmed! Check your email for the invoice.');
          }
        } else {
          throw new Error('Invalid response structure');
        }
      } catch (err: any) {
        console.error('Error fetching booking details:', err);
        setError(err.response?.data?.message || 'Failed to load booking details. Please try again.');
        toast.error('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    }
    
    fetchBookingDetails().then(() => {


        handleDownloadInvoice(); // Call the function to download the invoice URL}

    })


  }, [bookingId]);

  const handleDownloadUrl = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
        document.body.appendChild(link);
        link.click();
        toast.success('Invoice downloaded successfully!');
    }
    else {
        toast.error('No invoice URL available. Please try again later.');
        }
    }
  const handleDownloadInvoice = async () => {
    if (!bookingId) return;
    try {
     
        // Fallback to API download
        const response = await customerAPI.downloadInvoice(bookingId);
        const url = response.data.data.url;
        setDownloadUrl(url);
        
    
    } catch (err) {
      console.error('Error downloading invoice:', err);
      toast.error('Failed to download invoice. Please try again or contact support.');
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

  if (error || !booking) {
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
            <p className="text-gray-600">{error || 'Booking not found'}</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Ensure tourPackage exists before rendering
  if (!booking.tourPackage) {
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
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        {booking.paymentStatus === 'SUCCESS' ? (
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4"
            >
              <CheckCircle className="h-8 w-8 text-green-600" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-lg text-gray-600">
              Thank you for your payment. Your booking has been confirmed.
            </p>
          </div>
        ) : (
            <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4"
            >
              <AlertCircle className="h-8 w-8 text-red-600" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Failed!</h1>
            <p className="text-lg text-gray-600">
            Here's a summary of your booking information Booking Failed. 
            </p>
          </div>
          
        )}

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
                  variant="outline"
                  size="sm"
                  className="flex items-center hover:bg-gray-100 transition-colors"
                  onClick={handleDownloadUrl}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
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

            {booking.travelers.some((t) => t.documents.length > 0) && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Uploaded Documents</h3>
                  <div className="space-y-2">
                    {booking.travelers.flatMap((traveler) =>
                      traveler.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                        >
                          <div className="flex items-center">
                            <span className="text-sm truncate max-w-xs">
                              {doc.documentType}: {doc.documentNumber}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
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
                      <span>Deposit Paid</span>
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
                  <span className="text-blue-600">{formatCurrency(booking.totalPrice, 'INR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Mode</span>
                  <span>{booking.paymentMode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid</span>
                  <span>
                    {formatCurrency(
                      booking.paymentMode === 'FULL' ? booking.totalPrice : booking.platformFee,
                      'INR'
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cashfree Order ID</span>
                  <span>{booking.cashfreeOrderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID</span>
                  <span>{booking.transactionId || 'Pending'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <span>{booking.paymentStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking Status</span>
                  <span>{booking.status}</span>
                </div>
              </div>
            </div>

           {booking.paymentStatus === 'SUCCESS' && (
             <div className="p-4 mt-4 bg-blue-50 rounded-md text-sm text-blue-800">
             <div className="flex items-start">
               <Mail className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
               <div>
                 <p className="font-medium">Booking Confirmation Email</p>
                 <p className="mt-1">
                   We've sent a confirmation with all booking details to {booking.customer.user.email}
                 </p>
               </div>
             </div>
           </div>
           )}
          </CardContent>

          <div className="p-6 bg-gray-50 border-t">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link to="/bookings">View My Bookings</Link>
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