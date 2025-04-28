import { useState, useEffect } from 'react';
import { Check, ShoppingCart, Clock, Calendar, Users, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../ui/button';
import { formatCurrency } from '../../../utils/formatters';

interface PackagePriceCardProps {
  price: number;
  discountPrice?: number;
  duration: number;
  startDate: Date;
  endDate: Date;
  minCapacity: number;
  maxCapacity: number;
  availableSpots: number;
  isLimited?: boolean;
  limitedOfferEndDate?: Date;
  onBookNow: () => void;
  onAddToWishlist?: () => void;
  isInWishlist?: boolean;
}

export function PackagePriceCard({
  price,
  discountPrice,
  duration,
  startDate,
  endDate,
  minCapacity,
  maxCapacity,
  availableSpots,
  isLimited = false,
  limitedOfferEndDate,
  onBookNow,
  onAddToWishlist,
  isInWishlist = false,
}: PackagePriceCardProps) {
  const [timeRemaining, setTimeRemaining] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [isOfferEnded, setIsOfferEnded] = useState(false);

  // Calculate discount percentage
  const hasDiscount = discountPrice !== undefined && discountPrice < price;
  const discountPercentage = hasDiscount
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

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

  // Calculate time remaining for limited offer
  useEffect(() => {
    if (!isLimited || !limitedOfferEndDate) return;

    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const offerEndTime = limitedOfferEndDate.getTime();
      const timeLeft = offerEndTime - now;

      if (timeLeft <= 0) {
        setIsOfferEnded(true);
        setTimeRemaining(null);
        return;
      }

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [isLimited, limitedOfferEndDate]);

  // Determine urgency level based on available spots
  const getUrgencyLevel = () => {
    const percentageFilled = ((maxCapacity - availableSpots) / maxCapacity) * 100;
    
    if (percentageFilled >= 90) return 'high';
    if (percentageFilled >= 70) return 'medium';
    return 'low';
  };

  const urgencyLevel = getUrgencyLevel();
  const urgencyMessages = {
    high: 'Only a few spots left!',
    medium: 'Selling fast!',
    low: `${availableSpots} spots available`,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border bg-white shadow-sm"
    >
      {/* Price header */}
      <div className="rounded-t-xl bg-primary p-6 text-white">
        <div className="mb-1 flex items-baseline justify-between">
          <h3 className="text-xl font-semibold">
            {hasDiscount ? (
              <>
                <span className="mr-2 text-2xl">{formatCurrency(discountPrice)}</span>
                <span className="text-lg line-through opacity-70">
                  {formatCurrency(price)}
                </span>
              </>
            ) : (
              <span className="text-2xl">{formatCurrency(price)}</span>
            )}
            <span className="ml-1 text-sm opacity-80">per person</span>
          </h3>
          
          {hasDiscount && (
            <span className="rounded-full bg-white px-2 py-1 text-xs font-bold text-primary">
              {discountPercentage}% OFF
            </span>
          )}
        </div>
        
        {/* Limited time offer countdown */}
        {isLimited && !isOfferEnded && timeRemaining && (
          <div className="mt-3 flex items-center text-white/90">
            <Clock className="mr-2 h-4 w-4" />
            <p className="text-sm">
              Limited offer ends in: 
              <span className="ml-1 font-semibold">
                {timeRemaining.days > 0 && `${timeRemaining.days}d `}
                {timeRemaining.hours.toString().padStart(2, '0')}:
                {timeRemaining.minutes.toString().padStart(2, '0')}:
                {timeRemaining.seconds.toString().padStart(2, '0')}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Package details */}
      <div className="p-6">
        <div className="mb-6 space-y-3">
          <div className="flex items-center">
            <Calendar className="mr-3 h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Duration</p>
              <p className="text-gray-600">{duration} days</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Calendar className="mr-3 h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Departure - Return</p>
              <p className="text-gray-600">
                {formattedStartDate} - {formattedEndDate}
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Users className="mr-3 h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Group Size</p>
              <p className="text-gray-600">
                {minCapacity} - {maxCapacity} people
              </p>
            </div>
          </div>
        </div>

        {/* Included highlights */}
        <div className="mb-6">
          <h4 className="mb-3 font-medium">What's Included:</h4>
          <ul className="space-y-2">
            <li className="flex items-center text-sm">
              <Check className="mr-2 h-4 w-4 text-green-500" />
              Professional guide
            </li>
            <li className="flex items-center text-sm">
              <Check className="mr-2 h-4 w-4 text-green-500" />
              All transportation
            </li>
            <li className="flex items-center text-sm">
              <Check className="mr-2 h-4 w-4 text-green-500" />
              Accommodation
            </li>
            <li className="flex items-center text-sm">
              <Check className="mr-2 h-4 w-4 text-green-500" />
              Selected meals
            </li>
          </ul>
        </div>

        {/* Urgency indicators */}
        <div className={`mb-6 rounded-lg p-3 ${
          urgencyLevel === 'high' 
            ? 'bg-red-50 text-red-700' 
            : urgencyLevel === 'medium' 
              ? 'bg-amber-50 text-amber-700'
              : 'bg-blue-50 text-blue-700'
        }`}>
          <div className="flex items-center">
            <AlertTriangle className="mr-2 h-4 w-4" />
            <p className="text-sm font-medium">{urgencyMessages[urgencyLevel]}</p>
          </div>
          
          {/* Progress bar */}
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div 
              className={`h-full ${
                urgencyLevel === 'high' 
                  ? 'bg-red-500' 
                  : urgencyLevel === 'medium' 
                    ? 'bg-amber-500'
                    : 'bg-blue-500'
              }`}
              style={{ width: `${((maxCapacity - availableSpots) / maxCapacity) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Call to action buttons */}
        <div className="space-y-3">
          <Button 
            onClick={onBookNow} 
            className="w-full" 
            size="lg"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Book Now
          </Button>
          
          {onAddToWishlist && (
            <Button 
              onClick={onAddToWishlist} 
              variant="outline" 
              className="w-full"
            >
              {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
} 