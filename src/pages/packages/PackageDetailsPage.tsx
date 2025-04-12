import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  Clock, 
  Info, 
  AlertTriangle,
  ChevronLeft,
  Share2,
  Heart
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import { Separator } from '../../components/ui/separator';
import { toast } from 'react-hot-toast';

interface Tour {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  maxGroupSize: number;
  difficulty: 'easy' | 'moderate' | 'challenging';
  rating: number;
  image: string;
  location: string;
  startDate: string;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
  }[];
  agency: {
    id: string;
    name: string;
    rating: number;
    image: string;
    description: string;
    contactEmail: string;
    contactPhone: string;
  };
  reviews: {
    id: string;
    user: {
      id: string;
      name: string;
      image: string;
    };
    rating: number;
    comment: string;
    date: string;
  }[];
}

export function PackageDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTourDetails(id);
    }
  }, [id]);

  const fetchTourDetails = async (tourId: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/tours/${tourId}`);
      setTour(response.data);
      
      // Check if this tour is in user's favorites
      if (isAuthenticated) {
        const favoritesResponse = await api.get('/users/favorites');
        const favorites = favoritesResponse.data;
        setIsFavorite(favorites.some((fav: any) => fav.id === tourId));
      }
    } catch (error) {
      console.error('Error fetching tour details:', error);
      toast.error('Failed to load tour details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to book this tour');
      navigate('/login', { state: { from: `/packages/${id}` } });
      return;
    }
    
    // Navigate to booking page with tour ID
    navigate(`/bookings/new?tourId=${id}`);
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to save favorites');
      return;
    }
    
    try {
      if (isFavorite) {
        await api.delete(`/users/favorites/${id}`);
        toast.success('Removed from favorites');
      } else {
        await api.post('/users/favorites', { tourId: id });
        toast.success('Added to favorites');
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
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

  if (!tour) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-8 text-center">
        <AlertTriangle className="mb-4 h-12 w-12 text-amber-500" />
        <h2 className="mb-2 text-2xl font-bold">Tour Not Found</h2>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>{tour.title} | SafarWay</title>
        <meta name="description" content={tour.description.substring(0, 160)} />
      </Helmet>

      {/* Back Button */}
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => navigate('/packages')}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Packages
      </Button>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2">
          {/* Tour Image */}
          <div className="mb-6 overflow-hidden rounded-lg">
            <img 
              src={tour.image} 
              alt={tour.title} 
              className="h-[400px] w-full object-cover"
            />
          </div>

          {/* Tour Title and Info */}
          <div className="mb-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-3xl font-bold">{tour.title}</h1>
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
            
            <div className="mb-4 flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {tour.location}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {tour.duration} days
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Max {tour.maxGroupSize} people
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-500" />
                {tour.rating.toFixed(1)} ({tour.reviews.length} reviews)
              </div>
            </div>
            
            <Badge 
              variant={tour.difficulty === 'easy' ? 'default' : 
                      tour.difficulty === 'moderate' ? 'secondary' : 'destructive'}
              className="mb-4"
            >
              {tour.difficulty.charAt(0).toUpperCase() + tour.difficulty.slice(1)} Difficulty
            </Badge>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              <TabsTrigger value="included">What's Included</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold">About this tour</h3>
                <p>{tour.description}</p>
                
                <h3 className="mt-6 text-xl font-semibold">Highlights</h3>
                <ul>
                  {tour.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="itinerary">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Day-by-day itinerary</h3>
                {tour.itinerary.map((day) => (
                  <Card key={day.day}>
                    <CardHeader>
                      <CardTitle>Day {day.day}: {day.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{day.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="included">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-green-500" />
                      What's Included
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tour.included.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-green-500"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      What's Not Included
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tour.notIncluded.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Customer Reviews</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 text-amber-500" />
                    <span className="font-semibold">{tour.rating.toFixed(1)}</span>
                    <span className="text-gray-500">({tour.reviews.length} reviews)</span>
                  </div>
                </div>
                
                {tour.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {tour.reviews.map((review) => (
                      <Card key={review.id}>
                        <CardHeader>
                          <div className="flex items-center gap-4">
                            <img 
                              src={review.user.image} 
                              alt={review.user.name} 
                              className="h-10 w-10 rounded-full"
                            />
                            <div>
                              <CardTitle className="text-base">{review.user.name}</CardTitle>
                              <CardDescription>
                                {new Date(review.date).toLocaleDateString()}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-2 flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < review.rating ? 'text-amber-500 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <p>{review.comment}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed p-8 text-center">
                    <p className="text-gray-500">No reviews yet for this tour.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Book this tour</CardTitle>
              <CardDescription>Next available: {new Date(tour.startDate).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-baseline justify-between">
                <span className="text-2xl font-bold">${tour.price}</span>
                <span className="text-sm text-gray-500">per person</span>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {tour.duration} days
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Group Size</span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Max {tour.maxGroupSize}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Difficulty</span>
                  <Badge 
                    variant={tour.difficulty === 'easy' ? 'default' : 
                            tour.difficulty === 'moderate' ? 'secondary' : 'destructive'}
                  >
                    {tour.difficulty.charAt(0).toUpperCase() + tour.difficulty.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" onClick={handleBookNow}>
                Book Now
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>About the Agency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <img 
                  src={tour.agency.image} 
                  alt={tour.agency.name} 
                  className="h-16 w-16 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{tour.agency.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-500" />
                    <span>{tour.agency.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-600">{tour.agency.description}</p>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button variant="outline" className="w-full">
                Contact Agency
              </Button>
              <Button variant="ghost" className="w-full">
                View All Tours by {tour.agency.name}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 