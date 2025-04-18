import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Tag, Building2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { formatDate, formatCurrency } from '../../utils/formatters';

interface PackageCardProps {
  packageData: {
    id: string;
    title: string;
    description: string;
    price: number;
    discountedPrice?: number;
    discount?: number;
    imageUrl: string;
    location: string;
    duration: number;
    maxGroupSize: number;
    validFrom: string;
    validTill: string;
    featured: boolean;
    agencyId: string;
  };
  showAgencyLink?: boolean;
}

export function PackageCard({ 
  packageData,
  showAgencyLink = true
}: PackageCardProps) {
  const {
    id,
    title,
    description,
    price,
    discountedPrice,
    discount,
    imageUrl,
    location,
    duration,
    maxGroupSize,
    validFrom,
    validTill,
    featured,
    agencyId
  } = packageData;

  // Fallback image
  const fallbackImage = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1421&q=80';
  
  return (
    <motion.div
      className="rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Package Image */}
      <div className="relative h-48">
        <img 
          src={imageUrl || fallbackImage} 
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Featured Badge */}
        {featured && (
          <Badge 
            className="absolute top-2 left-2 bg-amber-500 hover:bg-amber-600"
          >
            Featured
          </Badge>
        )}
        
        {/* Discount Badge */}
        {discount && discount > 0 && (
          <Badge 
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600"
          >
            {discount}% OFF
          </Badge>
        )}
      </div>
      
      {/* Package Content */}
      <div className="p-4">
        <div className="flex flex-col space-y-3">
          <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>
          
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>{location}</span>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
          
          <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>{duration} days</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-gray-500" />
              <span>Max {maxGroupSize}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>Valid: {formatDate(validFrom)} - {formatDate(validTill)}</span>
          </div>
          
          {showAgencyLink && (
            <Link 
              to={`/agency/${agencyId}`}
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <Building2 className="h-4 w-4" />
              <span>View Agency</span>
            </Link>
          )}
          
          <div className="flex justify-between items-center mt-2">
            <div className="flex flex-col">
              {discount && discount > 0 ? (
                <>
                  <span className="text-xs text-gray-500 line-through">
                    {formatCurrency(price, 'USD')}
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(discountedPrice || (price - (price * discount / 100)), 'USD')}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-primary">
                  {formatCurrency(price, 'USD')}
                </span>
              )}
            </div>
            
            <Button asChild>
              <Link to={`/packages/${id}`}>View Details</Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 