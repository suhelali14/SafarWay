import  { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PaymentDetailsCard } from '../../components/admin/PaymentDetailsCard';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Loader2 } from 'lucide-react';


// Mock payment data (remove in production)
const mockPayment = {
  id: 'pay_123456',
  bookingId: 'book_7890',
  transactionId: 'txn_abcdef123456',
  amount: 1299.99,
  paymentDate: '2023-09-15T14:30:00Z',
  paymentMethod: 'Credit Card (Visa **** 4242)',
  status: 'COMPLETED' as const,
  customerName: 'Alex Johnson',
  customerEmail: 'alex.johnson@example.com',
  packageName: 'Serene Bali Getaway',
  agencyName: 'Wanderlust Travels',
  destination: 'Bali, Indonesia',
  travelDates: {
    startDate: '2023-10-15T00:00:00Z',
    endDate: '2023-10-22T00:00:00Z',
  },
  billingAddress: {
    street: '123 Main Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    country: 'USA',
  },
  fees: {
    bookingFee: 49.99,
    platformFee: 35.00,
    taxAmount: 115.00,
  }
};

export default function PaymentDetailsPage() {
  const { paymentId } = useParams<{ paymentId: string }>();
  
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPaymentDetails() {
      try {
        setLoading(true);
        setError(null);
        
        // In production, uncomment the following line to fetch real data
        // const response = await adminAPI.getPaymentDetails(paymentId);
        // setPayment(response.data);
        
        // Mock data for development - remove in production
        setTimeout(() => {
          setPayment(mockPayment);
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error('Error fetching payment details:', err);
        setError('Failed to load payment details. Please try again later.');
        setLoading(false);
      }
    }

    if (paymentId) {
      fetchPaymentDetails();
    } else {
      setError('Payment ID is required');
      setLoading(false);
    }
  }, [paymentId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading payment details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!payment) {
    return (
      <Alert className="mb-6">
        <AlertDescription>Payment not found.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container py-8">
      <PaymentDetailsCard payment={payment} />
    </div>
  );
} 