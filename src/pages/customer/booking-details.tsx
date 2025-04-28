import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import CustomerLayout from '../../layouts/CustomerLayout';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Spinner } from '../../components/ui/spinner';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { 
  Calendar, Users, CreditCard, ChevronLeft, FileText, 
  Clock, AlertCircle, Phone, Mail, Building, CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '../../components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';

// Mock data - replace with actual API calls
const mockBooking = {
  id: '1',
  destination: 'Bali Adventure',
  startDate: '2023-10-15',
  endDate: '2023-10-22',
  imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
  price: 1299,
  currency: 'INR',
  travelers: 2,
  status: 'upcoming',
  agency: {
    name: 'TravelWise Agency',
    logo: 'https://randomuser.me/api/portraits/men/32.jpg',
    contactEmail: 'bookings@travelwise.com',
    contactPhone: '+1-234-567-8901',
    address: '123 Agency Plaza, Travel City',
  },
  bookingReference: 'BK-12345',
  paymentStatus: 'paid',
  createdAt: '2023-07-10T14:30:00Z',
  paymentDetails: {
    method: 'Credit Card',
    lastDigits: '4242',
    totalPaid: 1299,
    paymentDate: '2023-07-10T14:35:00Z',
  },
  travelDetails: {
    accommodation: 'Luxury Beach Resort',
    transportation: 'Round-trip flight included',
    activities: [
      'Guided Waterfall Trek',
      'Sunset Beach Dinner',
      'Cultural Village Tour',
      'Snorkeling Adventure'
    ],
    inclusions: [
      'Daily breakfast',
      'Airport transfers',
      'Welcome drink',
      'Wi-Fi access',
      'Hotel taxes and service charges'
    ],
    notes: 'Please arrive at the airport at least 3 hours before departure time.'
  },
  itinerary: [
    {
      day: 1,
      date: '2023-10-15',
      title: 'Arrival Day',
      description: 'Arrive at Denpasar Airport. Transfer to your hotel. Free time to relax.'
    },
    {
      day: 2,
      date: '2023-10-16',
      title: 'Cultural Exploration',
      description: 'Visit Ubud Sacred Monkey Forest and traditional craft villages.'
    },
    {
      day: 3,
      date: '2023-10-17',
      title: 'Beach Day',
      description: 'Relax at Nusa Dua Beach. Optional water sports activities available.'
    },
    {
      day: 4,
      date: '2023-10-18',
      title: 'Temple Tours',
      description: 'Visit Tanah Lot and Uluwatu Temples with spectacular sunset views.'
    },
    {
      day: 5,
      date: '2023-10-19',
      title: 'Mountain Excursion',
      description: 'Explore Mount Batur and nearby coffee plantations.'
    },
    {
      day: 6,
      date: '2023-10-20',
      title: 'Island Hopping',
      description: 'Boat trip to Nusa Penida, visit Kelingking Beach and Crystal Bay.'
    },
    {
      day: 7,
      date: '2023-10-21',
      title: 'Free Day',
      description: 'Free day for shopping, relaxing, or optional activities.'
    },
    {
      day: 8,
      date: '2023-10-22',
      title: 'Departure Day',
      description: 'Check out from the hotel. Transfer to airport for your departure flight.'
    }
  ],
  travelersInfo: [
    {
      fullName: 'John Smith',
      passport: 'P12345678',
      dob: '1985-05-15',
      nationality: 'United States',
    },
    {
      fullName: 'Jane Smith',
      passport: 'P87654321',
      dob: '1988-12-20',
      nationality: 'United States',
    }
  ]
};

// Status and payment status colors
const statusColors: Record<string, { color: string, bgColor: string }> = {
  upcoming: { color: 'text-blue-700', bgColor: 'bg-blue-50' },
  confirmed: { color: 'text-green-700', bgColor: 'bg-green-50' },
  pending: { color: 'text-orange-700', bgColor: 'bg-orange-50' },
  completed: { color: 'text-gray-700', bgColor: 'bg-gray-100' },
  cancelled: { color: 'text-red-700', bgColor: 'bg-red-50' }
};

const paymentStatusVariants: Record<string, "default" | "destructive" | "outline" | "secondary" | null | undefined> = {
  paid: 'default',
  partial: 'outline',
  pending: 'outline',
  refunded: 'secondary'
};

const BookingDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [booking, setBooking] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        // Replace with actual API call when ready
        // const response = await getBookingDetails(id);
        // setBooking(response.data);
        
        // Using mock data for now
        setTimeout(() => {
          // Simulate API response
          setBooking(mockBooking);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Failed to fetch booking details:', err);
        setError('Failed to load booking details. Please try again later.');
        setLoading(false);
      }
    };

    if (id) {
      fetchBookingDetails();
    } else {
      setError('Booking ID is required');
      setLoading(false);
    }
  }, [id]);

  const handleCancelBooking = () => {
    if (window.confirm('Are you sure you want to cancel this booking? Cancellation policies may apply.')) {
      toast({
        title: 'Cancellation Request',
        description: 'Your cancellation request has been submitted. We will process it shortly.',
        variant: 'default',
      });
      
      // In a real app, make an API call to cancel the booking
      // Then update the booking status
    }
  };

  const handleDownloadInvoice = () => {
    toast({
      title: 'Downloading Invoice',
      description: 'Your invoice will be downloaded shortly.',
      variant: 'default',
    });
    
    // In a real app, make an API call to get the invoice PDF
  };

  const handleDownloadItinerary = () => {
    toast({
      title: 'Downloading Itinerary',
      description: 'Your itinerary PDF will be downloaded shortly.',
      variant: 'default',
    });
    
    // In a real app, make an API call to get the itinerary PDF
  };

  const handleContactAgency = () => {
    // This could open a modal or navigate to a messaging page
    toast({
      title: 'Contact Agency',
      description: 'Redirecting to the messaging page.',
      variant: 'default',
    });
    
    navigate('/customer/messages/agency/' + booking.agency.name.replace(/\s+/g, '-').toLowerCase());
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </CustomerLayout>
    );
  }

  if (error || !booking) {
    return (
      <CustomerLayout>
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || 'Booking not found'}</AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/customer/bookings')}>Back to Bookings</Button>
      </CustomerLayout>
    );
  }

  // Format dates for display
  const formattedStartDate = format(new Date(booking.startDate), 'MMM dd, yyyy');
  const formattedEndDate = format(new Date(booking.endDate), 'MMM dd, yyyy');
  const bookingDate = format(new Date(booking.createdAt), 'MMM dd, yyyy');

  return (
    <CustomerLayout>
      <Helmet>
        <title>Booking Details | SafarWay</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/customer/bookings')} 
              className="mr-2"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Booking Details</h1>
            <Badge 
              variant={booking.status === 'cancelled' ? 'destructive' : 'secondary'}
              className={`${statusColors[booking.status]?.bgColor} ${statusColors[booking.status]?.color} text-xs`}
              label= {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            >
             
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {['upcoming', 'confirmed', 'pending'].includes(booking.status) && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleCancelBooking}
              >
                Cancel Booking
              </Button>
            )}
            
            {booking.paymentStatus !== 'pending' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownloadInvoice}
              >
                <FileText className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownloadItinerary}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Download Itinerary
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Booking Summary Card */}
          <Card className="md:col-span-3">
            <CardHeader className="pb-2">
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <img 
                      src={booking.imageUrl} 
                      alt={booking.destination} 
                      className="rounded-lg object-cover h-40 w-full sm:w-56" 
                    />
                    <div className="flex flex-col justify-between">
                      <div>
                        <h2 className="text-xl font-semibold">{booking.destination}</h2>
                        <div className="flex items-center mt-2">
                          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-600">
                            {formattedStartDate} - {formattedEndDate}
                          </span>
                        </div>
                        <div className="flex items-center mt-2">
                          <Users className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-600">
                            {booking.travelers} {booking.travelers === 1 ? 'traveler' : 'travelers'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="text-sm text-gray-500">
                          Booked on {bookingDate}
                        </div>
                        <div className="flex items-center mt-1">
                          <strong>Payment Status:</strong> 
                          <Badge variant={paymentStatusVariants[booking.paymentStatus] || 'default'} className="ml-2" label= {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}>
                           
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-between">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center">
                      <Avatar className="h-12 w-12 mr-3">
                        <AvatarImage src={booking.agency.logo} alt={booking.agency.name} />
                        <AvatarFallback>{booking.agency.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{booking.agency.name}</h3>
                        <p className="text-sm text-gray-500">Travel Agency</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="whitespace-nowrap"
                      onClick={handleContactAgency}
                    >
                      Contact Agency
                    </Button>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex flex-col">
                      <span className="text-gray-500 text-sm">Booking Reference</span>
                      <span className="font-medium">{booking.bookingReference}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500 text-sm">Total Price</span>
                      <span className="font-bold text-lg">
                        {booking.currency} {booking.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="details">Booking Details</TabsTrigger>
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="travelers">Travelers</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Travel Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Accommodation</h3>
                    <p className="text-gray-600">{booking.travelDetails.accommodation}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Transportation</h3>
                    <p className="text-gray-600">{booking.travelDetails.transportation}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-3">Included Activities</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {booking.travelDetails.activities.map((activity: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-3">Inclusions</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {booking.travelDetails.inclusions.map((inclusion: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>{inclusion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {booking.travelDetails.notes && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-medium mb-2">Important Notes</h3>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 flex">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" />
                        <p className="text-gray-700">{booking.travelDetails.notes}</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Agency Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p>{booking.agency.contactEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p>{booking.agency.contactPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-start md:col-span-2">
                    <Building className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p>{booking.agency.address}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="itinerary" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Trip Itinerary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {booking.itinerary.map((day: any, index: number) => (
                    <div key={index} className="flex">
                      <div className="mr-4 flex flex-col items-center">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                          {day.day}
                        </div>
                        {index < booking.itinerary.length - 1 && (
                          <div className="w-0.5 bg-gray-200 grow mt-2"></div>
                        )}
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 mb-4 flex-1">
                        <div className="flex flex-wrap justify-between items-start mb-2">
                          <h3 className="text-md font-semibold">{day.title}</h3>
                          <span className="text-sm text-gray-500">
                            {format(new Date(day.date), 'MMM dd, yyyy')}
                          </span>
                        </div>
                        <p className="text-gray-600">{day.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="travelers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Traveler Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {booking.travelersInfo.map((traveler: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium">Traveler {index + 1}</h3>
                        <Badge variant="outline" label={index === 0 ? 'Main Traveler' : 'Accompanying Traveler'}>
                          
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="font-medium">{traveler.fullName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Passport Number</p>
                          <p className="font-medium">{traveler.passport}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date of Birth</p>
                          <p>{format(new Date(traveler.dob), 'MMM dd, yyyy')}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Nationality</p>
                          <p>{traveler.nationality}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                    <div>
                      <p className="text-sm text-gray-500">Payment Method</p>
                      <div className="flex items-center mt-1">
                        <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                        <p>{booking.paymentDetails.method} ending in {booking.paymentDetails.lastDigits}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Date</p>
                      <div className="flex items-center mt-1">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <p>{format(new Date(booking.paymentDetails.paymentDate), 'MMM dd, yyyy h:mm a')}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-xl font-bold mt-1">
                        {booking.currency} {booking.price.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Status</p>
                      <div className="mt-1">
                        <Badge 
                          variant={paymentStatusVariants[booking.paymentStatus] || 'default'}
                          className="text-sm"
                          label={booking.paymentStatus === 'paid' ? 'Fully Paid' : 
                            booking.paymentStatus === 'partial' ? 'Partially Paid' :
                            booking.paymentStatus === 'refunded' ? 'Refunded' : 'Payment Pending'}
                        >
                          
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {booking.paymentStatus === 'pending' && (
                    <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-800">Payment Required</h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            Your booking is pending payment. Please complete your payment to confirm this booking.
                          </p>
                          <Button className="mt-3">Complete Payment</Button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {booking.paymentStatus === 'refunded' && (
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-800">Refund Processed</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            A refund has been processed for this booking. The funds should appear in your account within 5-7 business days.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </CustomerLayout>
  );
};

export default BookingDetailsPage; 