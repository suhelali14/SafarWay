import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, Heart, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { TourPackage } from '../../services/api';
import { cn } from '../../lib/utils';

interface RecommendedPackagesProps {
  packages: TourPackage[];
  onAddToWishlist?: (packageId: string) => void;
  wishlistPackageIds?: string[];
  isLoading?: boolean;
}

export const RecommendedPackages: React.FC<RecommendedPackagesProps> = ({
  packages,
  onAddToWishlist,
  wishlistPackageIds = [],
  isLoading = false,
}) => {
  const navigate = useNavigate();
  
  // For simple carousel functionality - could be replaced with a proper carousel library
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  
  if (isLoading) {
    return (
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-64 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!packages || packages.length === 0) {
    return (
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">No recommended packages available at the moment.</p>
          <Button 
            onClick={() => navigate('/tour-packages')}
            variant="outline" 
            className="mt-4"
          >
            Browse All Packages
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recommended for You</h2>
        <div className="flex space-x-2">
          <button 
            onClick={scrollLeft}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button 
            onClick={scrollRight}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div 
        ref={scrollContainerRef}
        className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 hide-scrollbar"
      >
        {packages.map((pkg) => (
          <div key={pkg.id} className="flex-none w-72 rounded-lg overflow-hidden border shadow-sm">
            <div className="relative h-40 bg-gray-200">
              {pkg.images && pkg.images.length > 0 ? (
                <img 
                  src={pkg.images[0]} 
                  alt={pkg.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                  No Image
                </div>
              )}
              
              <button 
                onClick={() => onAddToWishlist?.(pkg.id)}
                className={cn(
                  "absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm",
                  wishlistPackageIds.includes(pkg.id) ? "text-red-500" : "text-gray-500"
                )}
                aria-label={wishlistPackageIds.includes(pkg.id) ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart 
                  className={cn(
                    "h-5 w-5",
                    wishlistPackageIds.includes(pkg.id) ? "fill-current" : ""
                  )} 
                />
              </button>
            </div>
            
            <div className="p-4">
              <div className="flex items-center mb-1">
                <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-sm text-gray-600">{pkg.location}</span>
              </div>
              <h3 className="font-semibold text-lg mb-1 line-clamp-1">{pkg.title}</h3>
              
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-amber-500 fill-current mr-1" />
                  <span className="text-sm">4.8 (24 reviews)</span>
                </div>
                <div className="font-semibold">${pkg.price}</div>
              </div>
              
              <Button 
                onClick={() => navigate(`/tour-packages/${pkg.id}`)}
                className="w-full"
              >
                Book Now
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default RecommendedPackages; 