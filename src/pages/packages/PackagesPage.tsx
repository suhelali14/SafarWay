import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../components/ui/sheet';

import { Label } from '../../components/ui/label';
import { Slider } from '../../components/ui/slider';
import { TourPackage, TourType, PackageFilters } from '../../services/api';
import { customerPackages } from '../../services/api/customerPackages';
import { PackageCard } from '../../components/packages/PackageCard';

import { useToast } from '../../hooks/use-toast';

export function PackagesPage() {
  // const { isAuthenticated } = useAuth();
  // const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for packages data
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPackages, setTotalPackages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Search and filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedTourType, setSelectedTourType] = useState<string>('all');
  const [selectedDestination, setSelectedDestination] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');
  
  // List of available destinations (will be populated from API data)
  const [availableDestinations, setAvailableDestinations] = useState<string[]>([]);

  useEffect(() => {
    fetchPackages();
  }, [currentPage]);

  // Function to fetch packages with current filters
  const fetchPackages = async () => {
    try {
      setLoading(true);
      
      // Prepare filters object
      const filters: PackageFilters = {
        page: currentPage,
        limit: 12,
        status: 'PUBLISHED' // Only show published packages
      };
      
      // Add search query if available
      if (searchQuery.trim()) {
        filters.search = searchQuery;
      }
      
      // Add price filters if changed from default
      if (priceRange[0] > 0) {
        filters.minPrice = priceRange[0];
      }
      if (priceRange[1] < 5000) {
        filters.maxPrice = priceRange[1];
      }
      
      // Add tour type if selected
      if (selectedTourType !== 'all') {
        filters.tourType = selectedTourType as TourType;
      }
      
      // Add destination if selected
      if (selectedDestination) {
        filters.destination = selectedDestination;
      }
      
      // Add duration filters
      if (selectedDuration !== 'all') {
        if (selectedDuration === 'short') {
          filters.durationMax = 3;
        } else if (selectedDuration === 'medium') {
          filters.durationMin = 4;
          filters.durationMax = 7;
        } else if (selectedDuration === 'long') {
          filters.durationMin = 8;
        }
      }
      
      console.log('Fetching packages with filters:', filters);
      
      const response = await customerPackages.getAllPackages(filters);
      
      // Update state with response data
      if (response && response.data) {
        setPackages(response.data);
        setTotalPackages(response.pagination.total);
        setTotalPages(response.pagination.pages);
        
        // Extract unique destinations for the filter dropdown
        const destinations = new Set<string>();
        response.data.forEach(pkg => {
          if (pkg.destination) {
            destinations.add(pkg.destination);
          }
        });
        setAvailableDestinations(Array.from(destinations).sort());
      } else {
        console.error('API response format error:', response);
        toast({
          title: "Error loading packages",
          description: "Couldn't retrieve package data. Please try again later.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast({
        title: "Error",
        description: "Failed to load packages. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and search
  const handleApplyFilters = () => {
    setCurrentPage(1); // Reset to first page
    fetchPackages();
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setPriceRange([0, 5000]);
    setSelectedTourType('all');
    setSelectedDestination('');
    setSelectedDuration('all');
    setCurrentPage(1);
    
    // Fetch packages with reset filters
    fetchPackages();
  };

  // Animation variants
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
  
  // Convert TourPackage to PackageCard props
  const mapPackageToCardProps = (pkg: TourPackage) => {
    return {
      id: pkg.id,
      title: pkg.title,
      description: pkg.description || pkg.summary || '',
      price: pkg.pricePerPerson,
      discountedPrice: pkg.price, // In the API, price is actually the discounted price
      discount: pkg.discountPrice ? Math.round(((pkg.pricePerPerson - pkg.price!) / pkg.pricePerPerson) * 100) : undefined,
      imageUrl: pkg.coverImage || '',
      location: pkg.destination,
      duration: pkg.duration,
      maxGroupSize: pkg.maxGroupSize || pkg.maxPeople || 10,
      validFrom: pkg.validFrom || pkg.startDate,
      validTill: pkg.validTill || pkg.endDate,
      featured: false, // Could be determined by some criteria
      agencyId: pkg.agencyId
    };
  };

  return (
    <div className="container mx-auto px-4 py-16">
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleApplyFilters();
              }
            }}
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
              
              {/* Tour Type */}
              <div className="space-y-2">
                <Label>Package Type</Label>
                <Select value={selectedTourType} onValueChange={setSelectedTourType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select package type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="ADVENTURE">Adventure</SelectItem>
                    <SelectItem value="CULTURAL">Cultural</SelectItem>
                    <SelectItem value="WILDLIFE">Wildlife</SelectItem>
                    <SelectItem value="BEACH">Beach</SelectItem>
                    <SelectItem value="MOUNTAIN">Mountain</SelectItem>
                    <SelectItem value="CITY">City Tour</SelectItem>
                    <SelectItem value="CRUISE">Cruise</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Destination */}
              <div className="space-y-2">
                <Label>Destination</Label>
                <Select value={selectedDestination} onValueChange={setSelectedDestination}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Destinations</SelectItem>
                    {availableDestinations.map(destination => (
                      <SelectItem key={destination} value={destination}>
                        {destination}
                      </SelectItem>
                    ))}
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
              
              <div className="flex gap-2">
                <Button 
                  className="flex-1" 
                  onClick={handleApplyFilters}
                >
                  Apply Filters
                </Button>
                
                <Button 
                  variant="outline"
                  className="flex-1" 
                  onClick={handleResetFilters}
                >
                  Reset
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {packages.length} of {totalPackages} packages
        </p>
      </div>

      {/* Package Cards */}
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
      ) : (
        <>
          {packages.length > 0 ? (
            <motion.div 
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {packages.map((pkg) => (
                <motion.div key={pkg.id} variants={item}>
                  <PackageCard packageData={mapPackageToCardProps(pkg)} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium">No packages found</h3>
                <p className="mt-1 text-gray-500">Try adjusting your filters or search terms</p>
                <Button 
                  className="mt-4" 
                  onClick={handleResetFilters}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                <span className="flex h-10 items-center px-4 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 