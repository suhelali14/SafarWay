import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  MapPin, 
  Calendar, 
  Users, 
  
  Info, 
  AlertTriangle,
  ChevronLeft,
  Share2,
  Heart,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';


import { customerPackages } from '../../services/api/customerPackages';
import { TourPackage, TourType } from '../../services/api';
import { formatDate, formatCurrency } from '../../utils/formatters';
import BookPackageForm from './BookPackaForm';

export function PackageDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [book, setBook] = useState(false);
  const [packageData, setPackageData] = useState<TourPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [_activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (id) {
      fetchPackageDetails(id);
      checkIfFavorite(id);
    }
  }, [id]);

  const fetchPackageDetails = async (packageId: string) => {
    try {
      setLoading(true);
      const packageDetails = await customerPackages.getPackageById(packageId);
      setPackageData(packageDetails);
    } catch (error) {
      console.error('Error fetching package details:', error);
      toast({
        title: "Error",
        description: "Failed to load package details. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorite = async (packageId: string) => {
    // Only check if user is authenticated
    if (!isAuthenticated) return;
    
    try {
      const wishlist = await customerPackages.getWishlist();
      setIsFavorite(wishlist.some(item => item.id === packageId));
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book this package",
        variant: "destructive"
      });
      navigate('/login', { state: { from: `/packages/${id}` } });
      return;
    }
    
    // Navigate to booking page with package ID
    setBook(true);
    
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save to wishlist",
        variant: "destructive"
      });
      navigate('/login', { state: { from: `/packages/${id}` } });
      return;
    }
    
    try {
      if (isFavorite) {
        // Remove from wishlist
        await customerPackages.removeFromWishlist(id!);
        setIsFavorite(false);
        toast({
          title: "Success",
          description: "Removed from your wishlist"
        });
      } else {
        // Add to wishlist
        await customerPackages.addToWishlist(id!);
        setIsFavorite(true);
        toast({
          title: "Success",
          description: "Added to your wishlist"
        });
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatTourType = (type: TourType) => {
    const typeMap: Record<TourType, string> = {
      'ADVENTURE': 'Adventure',
      'CULTURAL': 'Cultural',
      'WILDLIFE': 'Wildlife',
      'BEACH': 'Beach',
      'MOUNTAIN': 'Mountain',
      'CITY': 'City Tour',
      'CRUISE': 'Cruise',
      'OTHER': 'Other'
    };
    
    return typeMap[type] || type;
  };

  const getTourTypeColor = (type: TourType) => {
    const colorMap: Record<TourType, string> = {
      'ADVENTURE': 'bg-orange-100 text-orange-800',
      'CULTURAL': 'bg-purple-100 text-purple-800',
      'WILDLIFE': 'bg-green-100 text-green-800',
      'BEACH': 'bg-blue-100 text-blue-800',
      'MOUNTAIN': 'bg-slate-100 text-slate-800',
      'CITY': 'bg-gray-100 text-gray-800',
      'CRUISE': 'bg-cyan-100 text-cyan-800',
      'OTHER': 'bg-gray-100 text-gray-800'
    };
    
    return colorMap[type] || '';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="mb-4 h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Skeleton className="mb-6 h-80 w-full rounded-lg" />
            <Skeleton className="mb-4 h-6 w-full" />
            <Skeleton className="mb-4 h-4 w-full" />
            <Skeleton className="mb-4 h-4 w-5/6" />
            <Skeleton className="mb-4 h-4 w-4/6" />
          </div>
          
          <div>
            <Skeleton className="mb-4 h-40 w-full rounded-lg" />
            <Skeleton className="mb-4 h-10 w-full" />
            <Skeleton className="mb-4 h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-8 text-center">
        <AlertTriangle className="mb-4 h-12 w-12 text-amber-500" />
        <h2 className="mb-2 text-2xl font-bold">Package Not Found</h2>
        <p className="mb-6 text-gray-600">
          The tour package you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate('/packages')}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Packages
        </Button>
      </div>
    );
  }

  // Convert pricing for display
  const regularPrice = packageData.pricePerPerson;
  const discountedPrice = packageData.price;
  const hasDiscount = discountedPrice !== undefined && discountedPrice < regularPrice;
  const discountPercentage = hasDiscount 
    ? Math.round(((regularPrice - discountedPrice) / regularPrice) * 100) 
    : 0;

  return (
    <div className="container mx-auto px-4 py-16">
      <Helmet>
        <title>{packageData.title} | SafarWay</title>
        <meta name="description" content={packageData.description.substring(0, 160)} />
      </Helmet>

      {/* Back Button */}
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => book ?
        setBook(false)
    :navigate('/packages')}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        {book ? "Back" : "Back to Packages"}
      </Button>
      {
        book ? (
          <BookPackageForm 
            TourPackage={packageData} 
           
          />
        ) :
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className=""
      >
      <div className="grid gap-8 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2">
          
         
              <div>
{/* Tour Image */}
<div className="mb-6 overflow-hidden rounded-lg">
            <img 
              src={packageData.coverImage || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop'} 
              alt={packageData.title} 
              className="h-[400px] w-full object-cover"
            />
          </div>

          {/* Tour Title and Info */}
          <div className="mb-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-3xl font-bold">{packageData.title}</h1>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={toggleFavorite}
                  className={isFavorite ? 'text-red-500' : ''}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {packageData.subtitle && (
              <p className="mb-4 text-lg text-gray-600">{packageData.subtitle}</p>
            )}
            
            <div className="mb-4 flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {packageData.destination}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {packageData.duration} days
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Max {packageData.maxGroupSize || packageData.maxPeople || 10} people
              </div>
            </div>
            
            <Badge className={`mb-4 ${getTourTypeColor(packageData.tourType)}`}>
              {formatTourType(packageData.tourType)}
            </Badge>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="details" className="mb-6" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              <TabsTrigger value="inclusions">Inclusions & Exclusions</TabsTrigger>
              <TabsTrigger value="policy">Policies</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="pt-4">
              <div className="space-y-4">
                <div>
                  <h2 className="mb-2 text-xl font-semibold">Description</h2>
                  <p className="text-gray-600">{packageData.description}</p>
                </div>
                
                {packageData.highlights && packageData.highlights.length > 0 && (
                  <div>
                    <h2 className="mb-2 text-xl font-semibold">Highlights</h2>
                    <ul className="space-y-2">
                      {packageData.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle2 className="mr-2 h-5 w-5 shrink-0 text-primary" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="itinerary" className="pt-4">
              {packageData.itinerary && packageData.itinerary.length > 0 ? (
                <div className="space-y-4">
                  {packageData.itinerary.map((day, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Day {day.day}: {day.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{day.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-6 text-center">
                  <Info className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                  <h3 className="text-lg font-medium">No Itinerary Available</h3>
                  <p className="text-sm text-gray-500">
                    Detailed itinerary information will be provided upon booking.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="inclusions" className="pt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h2 className="mb-2 text-lg font-semibold text-green-600">What's Included</h2>
                  <ul className="space-y-1">
                    {(packageData.inclusions || packageData.includedItems || []).map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle2 className="mr-2 h-5 w-5 shrink-0 text-green-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h2 className="mb-2 text-lg font-semibold text-red-600">What's Not Included</h2>
                  <ul className="space-y-1">
                    {(packageData.exclusions || packageData.excludedItems || []).map((item, index) => (
                      <li key={index} className="flex items-start">
                        <XCircle className="mr-2 h-5 w-5 shrink-0 text-red-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="policy" className="pt-4">
              <div className="space-y-4">
                {packageData.cancelationPolicy || packageData.cancellationPolicy ? (
                  <div>
                    <h2 className="mb-2 text-lg font-semibold">Cancellation Policy</h2>
                    <p className="text-gray-600">
                      {packageData.cancelationPolicy || packageData.cancellationPolicy}
                    </p>
                  </div>
                ) : (
                  <div>
                    <h2 className="mb-2 text-lg font-semibold">Cancellation Policy</h2>
                    <p className="text-gray-600">
                      Standard cancellation policy applies. Please contact the agency for detailed information.
                    </p>
                  </div>
                )}
                
                {packageData.additionalInfo && (
                  <div>
                    <h2 className="mb-2 text-lg font-semibold">Additional Information</h2>
                    <p className="text-gray-600">{packageData.additionalInfo}</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Gallery - Only show if we have additional images */}
          {packageData.images && packageData.images.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold">Gallery</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {packageData.images.map((image, index) => (
                  <img 
                    key={index} 
                    src={image} 
                    alt={`${packageData.title} - Image ${index + 1}`} 
                    className="h-40 w-full rounded-lg object-cover"
                  />
                ))}
              </div>
            </div>
          )}
              </div>
           
        </div>
        
        {/* Sidebar */}
        <div className="mb-6 sticky top-8 ">
          {/* Booking Card */}
          <Card >
            <CardHeader>
              <CardTitle>Book This Package</CardTitle>
              <CardDescription>
                Valid from {formatDate(packageData.startDate)} to {formatDate(packageData.endDate)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                {hasDiscount ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">
                        {formatCurrency(discountedPrice, 'INR')}
                      </span>
                      <Badge className="bg-red-500 hover:bg-red-600">
                        {discountPercentage}% OFF
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      <span className="line-through">
                        {formatCurrency(regularPrice, 'INR')}
                      </span>
                      {' '}per person
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(regularPrice, 'INR')}
                    </div>
                    <div className="text-sm text-gray-500">per person</div>
                  </div>
                )}
              </div>
              
              <div className="mb-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{packageData.duration} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Group Size:</span>
                  <span className="font-medium">Max {packageData.maxGroupSize || packageData.maxPeople || 10} people</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Min Age:</span>
                  <span className="font-medium">{packageData.minimumAge || 0}+ years</span>
                </div>
              </div>
              
              <Button className="w-full" onClick={handleBookNow}>
                Book Now
              </Button>
            </CardContent>
          </Card>
          {/* Agency Info */}
          <Card className='mt-10'>
            <CardHeader>
              <CardTitle>Tour Operator Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {packageData.agencyName && (
                  <div className="font-medium">{packageData.agencyName}</div>
                )}
                
                {packageData.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <a href={`mailto:${packageData.email}`} className="text-primary hover:underline">
                      {packageData.email}
                    </a>
                  </div>
                )}
                
                {packageData.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <a href={`tel:${packageData.phoneNumber}`} className="text-primary hover:underline">
                      {packageData.phoneNumber}
                    </a>
                  </div>
                )}
                
                {packageData.whatsapp && (
                  <div className="flex items-center gap-2 text-sm">
                    <MessageSquare className="h-4 w-4 text-gray-500" />
                    <a href={`https://wa.me/${packageData.whatsapp.replace(/[^0-9]/g, '')}`} className="text-primary hover:underline" target="_blank">
                      WhatsApp
                    </a>
                  </div>
                )}
              </div>
              
              <Button variant="outline" className="w-full" onClick={() => navigate(`/agency/${packageData.agencyId}`)}>
                View Agency Profile
              </Button>
            </CardContent>
          </Card>
          
        </div>
      </div>
      </motion.div>

      }
    </div>
  );
} 