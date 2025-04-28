import { Link } from 'react-router-dom';
import { Clock, Users, IndianRupee } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { TourPackage } from '../../lib/api/tours';
import { cn } from '../../lib/utils';

interface TourCardProps {
  tour: TourPackage;
  className?: string;
  variant?: 'default' | 'compact';
}

export const TourCard = ({
  tour,
  className,
  variant = 'default',
}: TourCardProps) => {
  const {
    id,
    title,
    subtitle,
    duration,
    maxGroupSize,
    pricePerPerson,
    tourType,
    coverImage,
  } = tour;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/placeholder-tour.jpg'; // Add a placeholder image
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card
      className={cn(
        'group overflow-hidden transition-all duration-200 hover:shadow-lg',
        className
      )}
    >
      <div className="relative">
        <img
          src={coverImage}
          alt={title}
          className={cn(
            'w-full object-cover transition-transform duration-200 group-hover:scale-105',
            variant === 'compact' ? 'h-48' : 'h-64'
          )}
          onError={handleImageError}
        />
        <Badge
          className="absolute right-2 top-2"
          variant={
            tourType === 'ADVENTURE'
              ? 'destructive'
              : tourType === 'CULTURAL'
              ? 'secondary'
              : 'default'
          }
          label={tourType.toLowerCase()}
        >
          
        </Badge>
      </div>

      <CardHeader>
        <CardTitle className="line-clamp-2">{title}</CardTitle>
        {variant === 'default' && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {subtitle}
          </p>
        )}
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{duration} days</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Max {maxGroupSize}</span>
          </div>
          <div className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{formatPrice(pricePerPerson)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex w-full gap-2">
          <Button asChild className="flex-1">
            <Link to={`/tours/${id}`}>View Details</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link to={`/tours/${id}/book`}>Book Now</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}; 