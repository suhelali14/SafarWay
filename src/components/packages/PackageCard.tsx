import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, Star, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { formatCurrency } from '../../utils/formatters';

export interface PackageCardProps {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  duration: number;
  maxParticipants: number;
  rating: number;
  imageUrl: string;
  agencyName: string;
  agencyLogo?: string;
  discount?: number;
  isFeatured?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
}

export function PackageCard({
  id,
  title,
  description,
  location,
  price,
  duration,
  maxParticipants,
  rating,
  imageUrl,
  agencyName,
  agencyLogo,
  discount,
  isFeatured,
  isPopular,
  isNew,
}: PackageCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const discountedPrice = discount ? price - (price * discount / 100) : price;
  
  return (
    <motion.div
      className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {isFeatured && (
          <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
            Featured
          </Badge>
        )}
        {isPopular && (
          <Badge variant="default" className="bg-rose-500 hover:bg-rose-600">
            Popular
          </Badge>
        )}
        {isNew && (
          <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">
            New
          </Badge>
        )}
        {discount && (
          <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
            {discount}% OFF
          </Badge>
        )}
      </div>
      
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium text-amber-500">
            <Star className="h-4 w-4 fill-current" />
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>
        
        <h3 className="mb-1 line-clamp-1 text-lg font-semibold text-gray-900">
          {title}
        </h3>
        
        <p className="mb-3 line-clamp-2 text-sm text-gray-500">
          {description}
        </p>
        
        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{duration} days</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Max {maxParticipants}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            {discount ? (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(discountedPrice)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {formatCurrency(price)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(price)}
              </span>
            )}
            <p className="text-xs text-gray-500">per person</p>
          </div>
          
          <Link to={`/packages/${id}`}>
            <Button 
              variant="default" 
              size="sm"
              className="group flex items-center gap-1"
            >
              View Details
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        
        <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3">
          {agencyLogo ? (
            <img 
              src={agencyLogo} 
              alt={agencyName} 
              className="h-6 w-6 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
              {agencyName.charAt(0)}
            </div>
          )}
          <span className="text-xs text-gray-500">by {agencyName}</span>
        </div>
      </div>
    </motion.div>
  );
} 