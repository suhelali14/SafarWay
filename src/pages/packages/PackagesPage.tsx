import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Calendar, Users, Star } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { generateMockTours } from '../../utils/mockData';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../components/ui/sheet';
import { Checkbox } from '../../components/ui/checkbox';
import { Label } from '../../components/ui/label';
import { Slider } from '../../components/ui/slider';

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
  agency: {
    id: string;
    name: string;
    rating: number;
  };
}

export function PackagesPage() {
  const { isAuthenticated } = useAuth();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const response = await api.get('/packages/all');
      
      if (Array.isArray(response.data)) {
        setTours(response.data);
      } else {
        console.error('API returned non-array data:', response.data);
        // Use mock data as fallback
        const mockTours = generateMockTours();
        setTours(mockTours);
      }
    } catch (error) {
      console.error('Error fetching tours:', error);
      // Use mock data as fallback
      const mockTours = generateMockTours();
      setTours(mockTours);
    } finally {
      setLoading(false);
    }
  };

  const filteredTours = (tours || []).filter((tour) => {
    const matchesSearch = tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPrice = tour.price >= priceRange[0] && tour.price <= priceRange[1];
    
    const matchesDifficulty = selectedDifficulty === 'all' || tour.difficulty === selectedDifficulty;
    
    const matchesDuration = selectedDuration === 'all' || 
      (selectedDuration === 'short' && tour.duration <= 3) ||
      (selectedDuration === 'medium' && tour.duration > 3 && tour.duration <= 7) ||
      (selectedDuration === 'long' && tour.duration > 7);
    
    const matchesRating = selectedRating === 'all' || tour.rating >= parseInt(selectedRating);

    return matchesSearch && matchesPrice && matchesDifficulty && matchesDuration && matchesRating;
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Tour Packages | SafarWay</title>
        <meta name="description" content="Browse and book amazing tour packages for your next adventure." />
      </Helmet>

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Tour Packages</h1>
        <p className="text-gray-600">Discover amazing destinations and book your next adventure</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            type="text"
            placeholder="Search packages..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Packages</SheetTitle>
            </SheetHeader>
            
            <div className="mt-6 space-y-6">
              {/* Price Range */}
              <div className="space-y-2">
                <Label>Price Range</Label>
                <Slider
                  min={0}
                  max={5000}
                  step={100}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="py-4"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
              
              {/* Difficulty */}
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="challenging">Challenging</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Duration */}
              <div className="space-y-2">
                <Label>Duration</Label>
                <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Durations</SelectItem>
                    <SelectItem value="short">Short (1-3 days)</SelectItem>
                    <SelectItem value="medium">Medium (4-7 days)</SelectItem>
                    <SelectItem value="long">Long (8+ days)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Rating */}
              <div className="space-y-2">
                <Label>Minimum Rating</Label>
                <Select value={selectedRating} onValueChange={setSelectedRating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                className="w-full" 
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredTours.length} of {tours.length} packages
        </p>
      </div>

      {/* Tour Cards */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="mb-2 h-4 w-full" />
                <Skeleton className="mb-2 h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredTours.length > 0 ? (
        <motion.div 
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredTours.map((tour) => (
            <motion.div key={tour.id} variants={item}>
              <Card className="overflow-hidden">
                <div className="relative h-48">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <Badge 
                    className="absolute right-2 top-2"
                    variant={tour.difficulty === 'easy' ? 'default' : 
                            tour.difficulty === 'moderate' ? 'secondary' : 'destructive'}
                  >
                    {tour.difficulty.charAt(0).toUpperCase() + tour.difficulty.slice(1)}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{tour.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {tour.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                    {tour.description}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {tour.duration} days
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Max {tour.maxGroupSize}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-500" />
                      {tour.rating.toFixed(1)}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-lg font-bold">${tour.price}</div>
                  <Button>View Details</Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h3 className="mb-2 text-xl font-semibold">No packages found</h3>
          <p className="mb-4 text-gray-600">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchQuery('');
              setPriceRange([0, 5000]);
              setSelectedDifficulty('all');
              setSelectedDuration('all');
              setSelectedRating('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
} 