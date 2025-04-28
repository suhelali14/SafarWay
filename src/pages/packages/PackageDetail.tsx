import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  MapPin, 
  Star, 
  Clock, 
  Check, 
  X, 
  Heart 
} from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

import { 

  Card,
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '../../components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../components/ui/select';
import { Separator } from '../../components/ui/separator';
import { formatCurrency } from '../../utils/formatters';
import { Package } from '../../services/api/customerAPI';
import { customerAPI } from '../../services/api';
import { bookingService } from '../../services/api/bookingService';
import { toast } from 'react-hot-toast';

// Extended package details
interface PackageDetail extends Package {
  description: string;
  itinerary: {
    day: number;
    title: string;
    description: string;
  }[];
  inclusions: string[];
  exclusions: string[];
  cancellationPolicy: string;
  additionalInfo: string;
  availableDates: string[];
}

const PackageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState<PackageDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  
  // Booking form state
  const [selectedDate, setSelectedDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchPackageDetails = async () => {
      setIsLoading(true);
      try {
        // Fetch package data from API
        const response = await customerAPI.getPackageById(id);
        const packageData = response?.data;
        
        if (packageData) {
          // Map API data to the required interface if necessary
          const enhancedData: PackageDetail = {
            ...packageData,
            // Handle itinerary format if needed
            itinerary: packageData.itinerary?.map((item: any, index: number) => ({
              day: item.day || index + 1,
              title: item.title || '',
              description: item.description || ''
            })) || [],
            cancellationPolicy: packageData.cancellationPolicy || 'Please contact us for cancellation policy details.',
            additionalInfo: packageData.additionalInfo || 'Contact us for more information about this package.',
            availableDates: packageData.startDates || []
          };
          
          setPackageData(enhancedData);
          
          // Select the first available date by default
          if (enhancedData.availableDates.length > 0) {
            setSelectedDate(enhancedData.availableDates[0]);
          }
          
          // Check if package is in wishlist
          try {
            const wishlistResponse = await customerAPI.getWishlist();
            const inWishlist = wishlistResponse?.data?.some((item: any) => item.id === id) || false;
            setIsInWishlist(inWishlist);
          } catch (wishlistError) {
            console.error('Error checking wishlist status:', wishlistError);
            // Default to not in wishlist
            setIsInWishlist(false);
          }
        } else {
          toast.error('Package data not found');
        }
      } catch (error) {
        console.error('Error fetching package details:', error);
        toast.error('Failed to load package details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackageDetails();
  }, [id]);

  useEffect(() => {
    if (packageData && selectedDate) {
      // Calculate total price based on number of guests
      const basePrice = packageData.price;
      const discountMultiplier = packageData.discount ? (100 - packageData.discount) / 100 : 1;
      const calculatedPrice = basePrice * guests * discountMultiplier;
      setTotalPrice(calculatedPrice);
    }
  }, [packageData, guests, selectedDate]);

  const handleToggleWishlist = async () => {
    if (!id) return;
    
    setIsAddingToWishlist(true);
    try {
      if (isInWishlist) {
        // Remove from wishlist
        await customerAPI.removeFromWishlist(id);
        toast.success('Removed from wishlist');
        setIsInWishlist(false);
      } else {
        // Add to wishlist
        await customerAPI.addToWishlist(id);
        toast.success('Added to wishlist');
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      // Show a specific error message based on the action
      if (isInWishlist) {
        toast.error('Failed to remove from wishlist. Please try again.');
      } else {
        toast.error('Failed to add to wishlist. Please try again.');
      }
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const handleBookNow = async () => {
    if (!packageData || !selectedDate) {
      toast.error('Please select a date');
      return;
    }

    setIsBooking(true);
    try {
      // Get end date by adding duration days to the start date
      const startDate = new Date(selectedDate);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + (packageData.duration || 1));
      
      const bookingData = {
        packageId: id!,
        startDate: selectedDate,
        endDate: endDate.toISOString().split('T')[0],
        participants: guests,
        specialRequests: ''
      };
      
      // Attempt to create a real booking
      try {
        const response = await bookingService.createBooking(bookingData);
        toast.success('Booking created successfully!');
        
        // Navigate to the booking details page
        setTimeout(() => {
          navigate(`/bookings/${response.id}`);
        }, 1000);
      } catch (bookingError) {
        console.error('Booking API error:', bookingError);
        // Show a more specific error message if possible
        if (bookingError instanceof Error) {
          toast.error(`Booking failed: ${bookingError.message}`);
        } else {
          toast.error('Failed to create booking. Please try again later.');
        }
      }
    } catch (error) {
      console.error('Error in booking process:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Package Not Found</h1>
        <p className="mb-6">The package you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/packages')}>Browse All Packages</Button>
      </div>
    );
  }

  // Calculate discounted price
  const discountedPrice = packageData.discount 
    ? packageData.price * (1 - packageData.discount / 100) 
    : null;

  return (
    <div>
      <Helmet>
        <title>{packageData.title} | SafarWay</title>
        <meta name="description" content={packageData.description.substring(0, 160)} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Package Details */}
          <div className="md:w-2/3">
            {/* Package header */}
            <div className="mb-6">
              <div className="flex flex-wrap justify-between items-start gap-3 mb-2">
                <h1 className="text-3xl font-bold">{packageData.title}</h1>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`${isInWishlist ? 'text-red-500' : ''} flex items-center gap-2`}
                  onClick={handleToggleWishlist}
                  disabled={isAddingToWishlist}
                >
                  <Heart className={isInWishlist ? 'fill-red-500 text-red-500' : ''} size={16} />
                  {isInWishlist ? 'Saved' : 'Save'}
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm mb-4">
                <div className="flex items-center">
                  <MapPin size={16} className="mr-1 text-gray-500" />
                  <span>{packageData.destination}</span>
                </div>
                
                <div className="flex items-center">
                  <Clock size={16} className="mr-1 text-gray-500" />
                  <span>{packageData.duration} days</span>
                </div>
                
                <div className="flex items-center">
                  <Star size={16} className="mr-1 text-yellow-500 fill-yellow-500" />
                  <span>{packageData.rating} ({Math.floor(Math.random() * (100 - 30) + 30)} reviews)</span>
                </div>
              </div>
              
              {packageData.features.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {packageData.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="rounded-full px-3" label= {feature}>
                     
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            {/* Main image */}
            <div className="relative rounded-lg overflow-hidden mb-6 h-80 lg:h-96">
              <img 
                src={packageData.imageUrl}
                alt={packageData.title}
                className="w-full h-full object-cover"
              />
              {packageData.discount && (
                <Badge className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 text-sm" label={`-${packageData.discount}%`} >
                  
                </Badge>
              )}
            </div>
            
            {/* Package content tabs */}
            <Tabs defaultValue="overview" className="mt-8">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
                <TabsTrigger value="policies">Policies</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">About This Package</h2>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {packageData.description}
                  </p>
                </div>
                
                <Separator />
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Highlights</h3>
                    <ul className="space-y-2">
                      {packageData.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check size={18} className="mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">What's Included</h3>
                    <ul className="space-y-2">
                      {packageData.inclusions.slice(0, 5).map((item, index) => (
                        <li key={index} className="flex items-start">
                          <Check size={18} className="mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                      {packageData.inclusions.length > 5 && (
                        <li className="text-primary">+ {packageData.inclusions.length - 5} more inclusions</li>
                      )}
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="itinerary" className="space-y-6">
                <h2 className="text-2xl font-semibold mb-4">Detailed Itinerary</h2>
                <div className="space-y-6">
                  {packageData.itinerary.map((day, index) => (
                    <div key={index} className="relative pl-8 pb-6">
                      {/* Timeline connector */}
                      {index < packageData.itinerary.length - 1 && (
                        <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                      )}
                      
                      {/* Day indicator */}
                      <div className="absolute left-0 top-1.5 rounded-full bg-primary text-white w-8 h-8 flex items-center justify-center text-sm font-medium">
                        {day.day}
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold">{day.title}</h3>
                        <p className="mt-2 text-gray-700 dark:text-gray-300">{day.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="inclusions" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-10">
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">What's Included</h2>
                    <ul className="space-y-3">
                      {packageData.inclusions.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <Check size={18} className="mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">What's Not Included</h2>
                    <ul className="space-y-3">
                      {packageData.exclusions.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <X size={18} className="mr-2 text-red-500 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="policies" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Cancellation Policy</h2>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line mb-6">
                    {packageData.cancellationPolicy}
                  </p>
                  
                  <h2 className="text-2xl font-semibold mb-4">Additional Information</h2>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {packageData.additionalInfo}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right Column - Booking Card */}
          <div className="md:w-1/3">
            <div className="sticky top-8">
              <Card className="shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-primary">
                        {discountedPrice
                          ? formatCurrency(discountedPrice, packageData.currency)
                          : formatCurrency(packageData.price, packageData.currency)}
                      </div>
                      {discountedPrice && (
                        <div className="flex items-center gap-2">
                          <span className="text-base line-through text-gray-500">
                            {formatCurrency(packageData.price, packageData.currency)}
                          </span>
                          <Badge className="bg-red-500" label={`${packageData.discount}% OFF`}></Badge>
                        </div>
                      )}
                    </div>
                  </CardTitle>
                  <CardDescription>per person</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="date">
                        Select Date
                      </label>
                      <Select 
                        value={selectedDate} 
                        onValueChange={setSelectedDate}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a departure date" />
                        </SelectTrigger>
                        <SelectContent>
                          {packageData.availableDates.map((date, index) => (
                            <SelectItem key={index} value={date}>
                              {new Date(date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="guests">
                        Number of Travelers
                      </label>
                      <Select 
                        value={guests.toString()} 
                        onValueChange={(value) => setGuests(parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select number of travelers" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? 'Person' : 'People'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Base price × {guests}</span>
                      <span>{formatCurrency(packageData.price * guests, packageData.currency)}</span>
                    </div>
                    
                    {packageData.discount && (
                      <div className="flex justify-between text-red-500">
                        <span>Discount ({packageData.discount}%)</span>
                        <span>-{formatCurrency((packageData.price * guests * packageData.discount) / 100, packageData.currency)}</span>
                      </div>
                    )}
                    
                    <Separator />
                    
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{formatCurrency(totalPrice, packageData.currency)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    size="lg"
                    disabled={!selectedDate || isBooking}
                    onClick={handleBookNow}
                  >
                    {isBooking ? 'Processing...' : 'Book Now'}
                  </Button>
                </CardFooter>
              </Card>
              
              <div className="mt-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Need help planning your trip?
                </p>
                <Button variant="link" className="text-primary p-0 h-auto mt-1">
                  Contact our travel experts
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail; 