import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IndianRupee, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Spinner } from '../ui/spinner';


type PaymentType = {
  id: string;
  bookingId: string;
  packageName: string;
  customerName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  status: 'PENDING' | 'COMPLETED' | 'REFUNDED' | 'FAILED';
  transactionId: string;
};

type AgencyPaymentsListProps = {
  agencyId: string;
};

export function AgencyPaymentsList({ agencyId }: AgencyPaymentsListProps) {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<PaymentType[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<PaymentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Mock data for development
        const mockPayments: PaymentType[] = [
          {
            id: "payment1",
            bookingId: "booking123",
            packageName: "Bali Adventure",
            customerName: "John Smith",
            amount: 1299.99,
            paymentDate: "2023-06-15T10:30:00Z",
            paymentMethod: "Credit Card",
            status: "COMPLETED",
            transactionId: "txn_abc123456"
          },
          {
            id: "payment2",
            bookingId: "booking456",
            packageName: "Paris Getaway",
            customerName: "Sarah Johnson",
            amount: 2499.99,
            paymentDate: "2023-06-20T14:45:00Z",
            paymentMethod: "PayPal",
            status: "COMPLETED",
            transactionId: "txn_def789012"
          }
        ];
        
        setPayments(mockPayments);
        setFilteredPayments(mockPayments);
        
        // Uncomment when API is ready
        // const response = await adminAPI.getPayments({ agencyId });
        // setPayments(response.data.payments);
        // setFilteredPayments(response.data.payments);
      } catch (err) {
        console.error('Error fetching agency payments:', err);
        setError('Failed to load payments. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [agencyId]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPayments(payments);
      return;
    }

    const lowercaseQuery = searchQuery.toLowerCase();
    const filtered = payments.filter(
      payment =>
        payment.packageName.toLowerCase().includes(lowercaseQuery) ||
        payment.customerName.toLowerCase().includes(lowercaseQuery) ||
        payment.transactionId.toLowerCase().includes(lowercaseQuery) ||
        payment.bookingId.toLowerCase().includes(lowercaseQuery)
    );
    
    setFilteredPayments(filtered);
  }, [searchQuery, payments]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

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
      day: 'numeric'
    });
  };

  // Calculate total revenue
  const totalRevenue = payments
    .filter(payment => payment.status === 'COMPLETED')
    .reduce((sum, payment) => sum + payment.amount, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-red-50 rounded-lg">
        <p className="text-red-600 mb-4">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <IndianRupee className="w-5 h-5 mr-2" />
              Payments
            </CardTitle>
            <CardDescription>
              {payments.length > 0
                ? `${payments.length} payments totaling $${totalRevenue.toLocaleString()}`
                : 'No payments found for this agency'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by transaction ID, booking ID, package or customer..."
            className="pl-10"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {filteredPayments.length > 0 ? (
          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm font-medium text-blue-600">{payment.transactionId.substring(0, 8)}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Button
                        variant="link"
                        className="p-0 h-auto text-sm"
                        onClick={() => navigate(`/admin/bookings/${payment.bookingId}`)}
                      >
                        #{payment.bookingId.substring(0, 8)}
                      </Button>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm">{payment.packageName}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm">{payment.customerName}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm">{formatDate(payment.paymentDate)}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm">{payment.paymentMethod}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm font-medium">${payment.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge className={getStatusBadgeClass(payment.status)}>{payment.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-md">
            {searchQuery ? (
              <>
                <Search className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-gray-500 mb-4">No payments match your search query.</p>
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </Button>
              </>
            ) : (
              <>
                <IndianRupee className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-gray-500 mb-4">This agency doesn't have any payments yet.</p>
              </>
            )}
          </div>
        )}
      </CardContent>
      {filteredPayments.length > 0 && (
        <CardFooter>
          <Button 
            variant="outline" 
            onClick={() => navigate(`/admin/payments?agencyId=${agencyId}`)}
            className="w-full"
          >
            View All Payments
          </Button>
        </CardFooter>
      )}
    </Card>
  );
} 