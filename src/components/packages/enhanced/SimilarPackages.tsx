import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, MapPin, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '../../ui/card';
import { Button } from '../../ui/button';
import { Skeleton } from '../../ui/skeleton';
import { TourPackage } from '../../../services/api';
import { optimizedPackageService } from '../../../services/api/optimizedPackageService';
import { formatCurrency } from '../../../utils/formatters';

interface SimilarPackagesProps {
  packageId: string;
  limit?: number;
}

export function SimilarPackages({ packageId, limit = 4 }: SimilarPackagesProps) {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch similar packages
  useEffect(() => {
    const fetchSimilarPackages = async () => {
      setLoading(true);
      try {
        const similarPackages = await optimizedPackageService.getSimilarPackages(packageId, limit);
        setPackages(similarPackages);
      } catch (err) {
        console.error('Error fetching similar packages:', err);
        setError('Failed to load similar packages');
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarPackages();
  }, [packageId, limit]);

  // Scroll functions
  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const { current } = containerRef;
      const scrollAmount = current.clientWidth * 0.75;
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Format date in short format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Navigate to package
  const handleNavigate = (id: string) => {
    navigate(`/packages/${id}`);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="mt-16">
        <h2 className="mb-6 text-2xl font-bold">Similar Packages</h2>
        <div className="relative">
          <div className="flex gap-6 overflow-x-hidden">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="min-w-[280px] flex-none rounded-lg border shadow"
                >
                  <Skeleton className="h-36 w-full rounded-t-lg" />
                  <div className="p-4">
                    <Skeleton className="mb-2 h-5 w-3/4" />
                    <Skeleton className="mb-4 h-4 w-1/2" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="mt-16">
        <h2 className="mb-6 text-2xl font-bold">Similar Packages</h2>
        <Card className="bg-gray-50 p-8 text-center">
          <p className="text-gray-600">{error}</p>
        </Card>
      </div>
    );
  }

  // Render empty state
  if (packages.length === 0) {
    return null; // Don't show the section if there are no similar packages
  }

  return (
    <div className="mt-16">
      <h2 className="mb-6 text-2xl font-bold">Similar Packages</h2>
      <div className="relative">
        {/* Scroll buttons */}
        <button
          onClick={() => scroll('left')}
          className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-md hover:bg-gray-50"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          onClick={() => scroll('right')}
          className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-md hover:bg-gray-50"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Packages container */}
        <div
          ref={containerRef}
          className="hide-scrollbar flex gap-6 overflow-x-auto pb-4 pt-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="min-w-[280px] flex-none"
            >
              <Card className="overflow-hidden transition-shadow hover:shadow-md">
                {/* Package image */}
                <div className="relative h-36">
                  <img
                    src={pkg.coverImage || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop'}
                    alt={pkg.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  
                  {/* Price badge */}
                  <div className="absolute right-2 top-2 rounded-full bg-white px-3 py-1 text-sm font-semibold shadow-sm">
                    {formatCurrency(pkg.price || pkg.pricePerPerson)}
                  </div>
                  
                  {/* Discount tag */}
                  {pkg.discountPrice && pkg.discountPrice < pkg.pricePerPerson && (
                    <div className="absolute left-0 top-2 bg-red-500 px-2 py-1 text-xs font-bold text-white shadow-sm">
                      {Math.round(((pkg.pricePerPerson - pkg.discountPrice) / pkg.pricePerPerson) * 100)}% OFF
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  {/* Location */}
                  <div className="mb-1 flex items-center text-sm text-gray-500">
                    <MapPin className="mr-1 h-3 w-3" />
                    <span>{pkg.destination}</span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="mb-1 line-clamp-2 font-semibold">{pkg.title}</h3>
                  
                  {/* Duration and dates */}
                  <div className="mb-3 flex items-center text-sm text-gray-500">
                    <Calendar className="mr-1 h-3 w-3" />
                    <span>{pkg.duration} days • {formatDate(pkg.startDate)} - {formatDate(pkg.endDate)}</span>
                  </div>
                  
                  {/* Rating */}
                  <div className="mb-4 flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${star <= 4.5 ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="ml-1 text-sm text-gray-600">4.5 (12)</span>
                  </div>
                </CardContent>
                
                <CardFooter className="border-t bg-gray-50 p-3">
                  <Button 
                    className="w-full"
                    onClick={() => handleNavigate(pkg.id)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
} 