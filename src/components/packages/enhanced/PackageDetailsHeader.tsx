import { motion } from 'framer-motion';
import { Star, Award, Clock, Calendar, Share2, MapPin } from 'lucide-react';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { TourType } from '../../../services/api';

interface PackageDetailsHeaderProps {
  title: string;
  subtitle?: string;
  destination: string;
  tourType: TourType;
  duration: number;
  startDate: Date;
  endDate: Date;
  rating: number;
  reviews: number;
  verified?: boolean;
  onShare: () => void;
}

export function PackageDetailsHeader({
  title,
  subtitle,
  destination,
  tourType,
  duration,
  startDate,
  endDate,
  rating,
  reviews,
  verified = false,
  onShare,
}: PackageDetailsHeaderProps) {
  // Format dates
  const formattedStartDate = startDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const formattedEndDate = endDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Get tour type color
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

  // Format tour type
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

  // Render stars
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            index < Math.floor(rating) 
              ? 'fill-amber-400 text-amber-400' 
              : index < rating 
                ? 'fill-amber-400/50 text-amber-400' 
                : 'text-gray-300'
          }`}
        />
      ));
  };

  return (
    <div className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Package type and share button */}
        <div className="mb-2 flex items-center justify-between">
          <Badge className={getTourTypeColor(tourType)} label={formatTourType(tourType)}></Badge>
          
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5"
            onClick={onShare}
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>

        {/* Title and subtitle */}
        <h1 className="mb-2 text-3xl font-bold md:text-4xl">{title}</h1>
        {subtitle && <p className="mb-4 text-lg text-gray-600">{subtitle}</p>}

        {/* Rating and verification */}
        <div className="mb-4 flex flex-wrap items-center gap-4">
          {/* Rating */}
          <div className="flex items-center">
            <div className="mr-2 flex">{renderStars(rating)}</div>
            <span className="text-gray-700">
              <span className="font-semibold">{rating.toFixed(1)}</span>
              <span className="mx-1">•</span>
              <span>{reviews} reviews</span>
            </span>
          </div>

          {/* Verified badge */}
          {verified && (
            <div className="flex items-center text-green-600">
              <Award className="mr-1 h-4 w-4" />
              <span className="text-sm font-medium">Verified Provider</span>
            </div>
          )}
        </div>

        {/* Quick info */}
        <div className="flex flex-wrap gap-6">
          {/* Location */}
          <div className="flex items-center text-gray-600">
            <MapPin className="mr-1.5 h-5 w-5 text-primary" />
            <span>{destination}</span>
          </div>

          {/* Duration */}
          <div className="flex items-center text-gray-600">
            <Clock className="mr-1.5 h-5 w-5 text-primary" />
            <span>{duration} days</span>
          </div>

          {/* Dates */}
          <div className="flex items-center text-gray-600">
            <Calendar className="mr-1.5 h-5 w-5 text-primary" />
            <span>{formattedStartDate} - {formattedEndDate}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 