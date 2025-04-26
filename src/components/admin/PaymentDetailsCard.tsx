import { IndianRupee, ArrowLeft, Download, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';

type PaymentDetailsProps = {
  payment: {
    id: string;
    bookingId: string;
    transactionId: string;
    amount: number;
    paymentDate: string;
    paymentMethod: string;
    status: 'PENDING' | 'COMPLETED' | 'REFUNDED' | 'FAILED';
    customerName: string;
    customerEmail: string;
    packageName: string;
    agencyName: string;
    destination: string;
    travelDates: {
      startDate: string;
      endDate: string;
    };
    billingAddress?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    refundDetails?: {
      refundDate: string;
      refundAmount: number;
      refundReason: string;
    };
    fees?: {
      bookingFee: number;
      platformFee: number;
      taxAmount: number;
    };
  };
  showBackButton?: boolean;
};

export function PaymentDetailsCard({ payment, showBackButton = true }: PaymentDetailsProps) {
  const navigate = useNavigate();
  
  // Payment status badge color mapping
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REFUNDED':
        return 'bg-purple-100 text-purple-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTravelDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate subtotal and total
  const subtotal = payment.amount - (payment.fees?.bookingFee || 0) - (payment.fees?.platformFee || 0) - (payment.fees?.taxAmount || 0);

  const handleDownloadInvoice = () => {
    // Implementation for downloading invoice
    console.log('Downloading invoice for payment:', payment.id);
    // In a real implementation, you would call an API endpoint to generate and download the invoice
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <Card className="payment-details-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            {showBackButton && (
              <Button
                variant="ghost"
                className="mb-2 p-0 h-8"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <CardTitle className="flex items-center text-xl">
              <IndianRupee className="w-5 h-5 mr-2" />
              Payment Details
            </CardTitle>
            <CardDescription>
              Transaction ID: {payment.transactionId}
            </CardDescription>
          </div>
          <Badge className={getStatusBadgeClass(payment.status)}>
            {payment.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-6">
          {/* Payment Summary */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="text-lg font-semibold">${payment.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Date</p>
                <p className="font-medium">{formatDate(payment.paymentDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium">{payment.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Booking ID</p>
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => navigate(`/admin/bookings/${payment.bookingId}`)}
                >
                  #{payment.bookingId}
                </Button>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Customer Information</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="mb-3">
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{payment.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{payment.customerEmail}</p>
              </div>
              {payment.billingAddress && (
                <div className="mt-3">
                  <p className="text-sm text-gray-500">Billing Address</p>
                  <p className="font-medium">
                    {payment.billingAddress.street}, {payment.billingAddress.city}, {payment.billingAddress.state} {payment.billingAddress.zipCode}, {payment.billingAddress.country}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Booking Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Booking Information</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Package</p>
                  <p className="font-medium">{payment.packageName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Agency</p>
                  <p className="font-medium">{payment.agencyName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Destination</p>
                  <p className="font-medium">{payment.destination}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Travel Dates</p>
                  <p className="font-medium">
                    {formatTravelDate(payment.travelDates.startDate)} - {formatTravelDate(payment.travelDates.endDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Breakdown */}
          {payment.fees && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Breakdown</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Subtotal</span>
                    <span className="font-medium">${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Booking Fee</span>
                    <span className="font-medium">${payment.fees.bookingFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Platform Fee</span>
                    <span className="font-medium">${payment.fees.platformFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Tax</span>
                    <span className="font-medium">${payment.fees.taxAmount.toLocaleString()}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${payment.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Refund Details (if applicable) */}
          {payment.refundDetails && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Refund Information</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Refund Date</p>
                    <p className="font-medium">{formatDate(payment.refundDetails.refundDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Refund Amount</p>
                    <p className="font-medium">${payment.refundDetails.refundAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Reason</p>
                    <p className="font-medium">{payment.refundDetails.refundReason}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between flex-wrap gap-2">
        <Button variant="outline" onClick={handlePrintInvoice}>
          <Printer className="h-4 w-4 mr-2" />
          Print Invoice
        </Button>
        <Button onClick={handleDownloadInvoice}>
          <Download className="h-4 w-4 mr-2" />
          Download Invoice
        </Button>
      </CardFooter>
    </Card>
  );
} 