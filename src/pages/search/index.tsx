import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Filter, 
  Star, 
  
  Loader 
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 

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
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '../../components/ui/accordion';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Separator } from '../../components/ui/separator';
import {
  Slider
} from '../../components/ui/slider';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { formatCurrency } from '../../utils/formatters';
import { Package } from '../../services/api/customerAPI';
import { customerAPI } from '../../services/api';
import { toast } from 'react-hot-toast';


interface SearchFilters {
  destination: string;
  dates?: {
    startDate: Date | null;
    endDate: Date | null;
  };
  guests: number;
  priceRange: [number, number];
  duration: number[];
  rating: number | null;
  amenities: string[];
}

const defaultFilters: SearchFilters = {
  destination: '',
  dates: {
    startDate: null,
    endDate: null
  },
  guests: 1,
  priceRange: [0, 5000],
  duration: [],
  rating: null,
  amenities: []
};

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    ...defaultFilters,
    destination: searchParams.get('destination') || '',
    guests: parseInt(searchParams.get('guests') || '1')
  });
  const [sortBy, setSortBy] = useState('recommended');
  
  // For mobile view
  const [showFilters, setShowFilters] = useState(false);

  const amenitiesOptions = [
    { id: 'wifi', label: 'WiFi' },
    { id: 'pool', label: 'Swimming Pool' },
    { id: 'breakfast', label: 'Breakfast Included' },
    { id: 'spa', label: 'Spa' },
    { id: 'gym', label: 'Fitness Center' },
    { id: 'ac', label: 'Air Conditioning' },
    { id: 'parking', label: 'Free Parking' },
    { id: 'pets', label: 'Pet Friendly' }
  ];

  useEffect(() => {
    const fetchPackages = async () => {
      setIsLoading(true);
      try {
        // Fetch data from API
        const response = await customerAPI.getFeaturedPackages();
        let filtered = response?.data || [];
        
        // Apply destination filter if provided
        if (filters.destination) {
          filtered = filtered.filter((pkg: Package) => 
            pkg.destination?.toLowerCase().includes(filters.destination.toLowerCase())
          );
        }
        
        // Apply sorting
        if (sortBy === 'price-low') {
          filtered.sort((a: Package, b: Package) => a.price - b.price);
        } else if (sortBy === 'price-high') {
          filtered.sort((a: Package, b: Package) => b.price - a.price);
        } else if (sortBy === 'rating') {
          filtered.sort((a: Package, b: Package) => b.rating - a.rating);
        }
        
        setPackages(filtered);
      } catch (error) {
        console.error('Error fetching packages:', error);
        toast.error('Failed to load packages. Please try again.');
        setPackages([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, [filters.destination, sortBy]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePriceRangeChange = (value: number[]) => {
    setFilters(prev => ({ ...prev, priceRange: [value[0], value[1]] }));
  };

  const toggleAmenity = (amenityId: string) => {
    setFilters(prev => {
      if (prev.amenities.includes(amenityId)) {
        return { ...prev, amenities: prev.amenities.filter(id => id !== amenityId) };
      } else {
        return { ...prev, amenities: [...prev.amenities, amenityId] };
      }
    });
  };

  const toggleDuration = (duration: number) => {
    setFilters(prev => {
      if (prev.duration.includes(duration)) {
        return { ...prev, duration: prev.duration.filter(d => d !== duration) };
      } else {
        return { ...prev, duration: [...prev.duration, duration] };
      }
    });
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Helmet>
        <title>
          {filters.destination 
            ? `${filters.destination} Packages | SafarWay` 
            : 'Search Packages | SafarWay'}
        </title>
      </Helmet>
      
      {/* Search Header */}
      <div className="bg-primary text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4">
            {filters.destination 
              ? `Travel Packages for "${filters.destination}"` 
              : 'Find Your Perfect Package'}
          </h1>
          
          {/* Quick Search Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-col md:flex-row gap-4 shadow-md">
            <div className="relative flex-1">
              <div className="absolute left-3 top-3 text-gray-400">
                <MapPin size={18} />
              </div>
              <Input
                placeholder="Where to?"
                className="pl-10 py-6 text-black dark:text-white"
                value={filters.destination}
                onChange={(e) => handleFilterChange('destination', e.target.value)}
              />
            </div>
            
            <div className="relative hidden md:block w-48">
              <div className="absolute left-3 top-3 text-gray-400">
                <Calendar size={18} />
              </div>
              <Input
                type="date"
                className="pl-10 py-6 text-black dark:text-white"
              />
            </div>
            
            <div className="relative hidden md:block w-48">
              <div className="absolute left-3 top-3 text-gray-400">
                <Users size={18} />
              </div>
              <Select 
                value={filters.guests.toString()} 
                onValueChange={(value) => handleFilterChange('guests', parseInt(value))}
              >
                <SelectTrigger className="pl-10 py-6 text-black dark:text-white">
                  <SelectValue placeholder="Guests" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button className="md:w-32 py-6" asChild>
              <div className="flex items-center gap-2">
                <Search size={18} />
                <span>Search</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters - Desktop */}
          <div className="md:w-1/4 hidden md:block">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Filters</CardTitle>
                  <Button variant="link" className="p-0 h-auto" onClick={resetFilters}>
                    Reset
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price Range */}
                <div>
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <div className="space-y-5">
                    <Slider 
                      defaultValue={[0, 5000]} 
                      max={5000} 
                      step={100}
                      value={filters.priceRange} 
                      onValueChange={handlePriceRangeChange}
                    />
                    <div className="flex justify-between">
                      <span>${filters.priceRange[0]}</span>
                      <span>${filters.priceRange[1]}</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Duration */}
                <div>
                  <h3 className="font-medium mb-3">Duration</h3>
                  <div className="space-y-2">
                    {[3, 5, 7, 10, 14].map(duration => (
                      <div key={duration} className="flex items-center">
                        <Checkbox 
                          id={`duration-${duration}`} 
                          checked={filters.duration.includes(duration)}
                          onCheckedChange={() => toggleDuration(duration)}
                        />
                        <Label htmlFor={`duration-${duration}`} className="ml-2">
                          {duration} days
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                {/* Rating */}
                <div>
                  <h3 className="font-medium mb-3">Rating</h3>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map(rating => (
                      <div key={rating} className="flex items-center">
                        <Checkbox 
                          id={`rating-${rating}`} 
                          checked={filters.rating === rating}
                          onCheckedChange={() => {
                            handleFilterChange('rating', filters.rating === rating ? null : rating);
                          }}
                        />
                        <Label htmlFor={`rating-${rating}`} className="ml-2 flex">
                          {Array(5).fill(0).map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
                            />
                          ))}
                          {rating === 5 && <span className="ml-1">& up</span>}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                {/* Amenities */}
                <div>
                  <h3 className="font-medium mb-3">Amenities</h3>
                  <div className="space-y-2">
                    {amenitiesOptions.map(amenity => (
                      <div key={amenity.id} className="flex items-center">
                        <Checkbox 
                          id={`amenity-${amenity.id}`} 
                          checked={filters.amenities.includes(amenity.id)}
                          onCheckedChange={() => toggleAmenity(amenity.id)}
                        />
                        <Label htmlFor={`amenity-${amenity.id}`} className="ml-2">
                          {amenity.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Toggle & Sort */}
            <div className="flex items-center justify-between mb-4 md:justify-end">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} />
                Filters
              </Button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 mr-2 hidden md:inline">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Mobile Filters */}
            {showFilters && (
              <div className="mb-4 md:hidden">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="price">
                    <AccordionTrigger>Price Range</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-5 px-2 pt-2">
                        <Slider 
                          defaultValue={[0, 5000]} 
                          max={5000} 
                          step={100}
                          value={filters.priceRange} 
                          onValueChange={handlePriceRangeChange}
                        />
                        <div className="flex justify-between">
                          <span>${filters.priceRange[0]}</span>
                          <span>${filters.priceRange[1]}</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="duration">
                    <AccordionTrigger>Duration</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 px-2">
                        {[3, 5, 7, 10, 14].map(duration => (
                          <div key={duration} className="flex items-center">
                            <Checkbox 
                              id={`duration-mobile-${duration}`} 
                              checked={filters.duration.includes(duration)}
                              onCheckedChange={() => toggleDuration(duration)}
                            />
                            <Label htmlFor={`duration-mobile-${duration}`} className="ml-2">
                              {duration} days
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="rating">
                    <AccordionTrigger>Rating</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 px-2">
                        {[5, 4, 3, 2, 1].map(rating => (
                          <div key={rating} className="flex items-center">
                            <Checkbox 
                              id={`rating-mobile-${rating}`} 
                              checked={filters.rating === rating}
                              onCheckedChange={() => {
                                handleFilterChange('rating', filters.rating === rating ? null : rating);
                              }}
                            />
                            <Label htmlFor={`rating-mobile-${rating}`} className="ml-2 flex">
                              {Array(5).fill(0).map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={16} 
                                  className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
                                />
                              ))}
                              {rating === 5 && <span className="ml-1">& up</span>}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="amenities">
                    <AccordionTrigger>Amenities</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 px-2">
                        {amenitiesOptions.map(amenity => (
                          <div key={amenity.id} className="flex items-center">
                            <Checkbox 
                              id={`amenity-mobile-${amenity.id}`} 
                              checked={filters.amenities.includes(amenity.id)}
                              onCheckedChange={() => toggleAmenity(amenity.id)}
                            />
                            <Label htmlFor={`amenity-mobile-${amenity.id}`} className="ml-2">
                              {amenity.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
            
            {/* Results Count */}
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                {isLoading 
                  ? 'Searching packages...' 
                  : `${packages.length} packages found${filters.destination ? ` for "${filters.destination}"` : ''}`}
              </p>
            </div>
            
            {/* Results */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : packages.length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-lg font-medium mb-2">No packages found</p>
                  <p className="text-gray-500 mb-6">Try adjusting your search criteria</p>
                  <Button onClick={resetFilters}>Reset Filters</Button>
                </Card>
              ) : (
                packages.map(pkg => (
                  <Card key={pkg.id} className="overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-1/3 h-48 md:h-auto relative">
                        <img 
                          src={pkg.imageUrl} 
                          alt={pkg.title} 
                          className="w-full h-full object-cover"
                        />
                        {pkg.discount && (
                          <Badge className="absolute top-2 right-2 bg-red-500" label={`-${pkg.discount}%`} 
                            >
                          </Badge>
                        )}
                        {pkg.isPopular && (
                          <Badge className="absolute top-2 left-2 bg-amber-500" label='Popular' >
                            
                          </Badge>
                        )}
                      </div>
                      <div className="flex-1 md:flex">
                        <CardContent className="p-4 md:p-6 flex-1">
                          <CardTitle className="text-xl mb-2">{pkg.title}</CardTitle>
                          <CardDescription className="flex items-center mb-2">
                            <MapPin size={14} className="mr-1" />
                            {pkg.destination}
                          </CardDescription>
                          
                          <div className="flex items-center mb-4">
                            <div className="flex mr-3">
                              {Array(5).fill(0).map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  className={i < pkg.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">{pkg.rating} stars</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mb-4">
                            {pkg.features.map((feature, i) => (
                              <Badge key={i} variant="outline" className="text-xs" label={feature} >
                                
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                        
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 md:p-6 md:w-48 flex flex-row md:flex-col justify-between items-center md:items-stretch gap-2">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">From</p>
                            <p className="text-xl font-bold text-primary">
                              {formatCurrency(pkg.price, pkg.currency)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">per person</p>
                          </div>
                          
                          <div className="flex flex-col gap-2 w-full mt-auto">
                            <Button asChild size="sm">
                              <Link to={`/packages/${pkg.id}`}>View Details</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage; 