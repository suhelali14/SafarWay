import React from 'react';
import { MapPin, Calendar, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { formatCurrency, formatDate } from '../../utils/formatters';

export interface BookingCardProps {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  price: number;
  currency: string;
  travelers: number;
  status: 'upcoming' | 'completed' | 'cancelled' | 'pending' | 'confirmed';
  agency?: string;
  onClick?: () => void;
  className?: string;
}

const statusConfig = {
  upcoming: { color: 'bg-blue-100 text-blue-600' },
  completed: { color: 'bg-green-100 text-green-600' },
  cancelled: { color: 'bg-red-100 text-red-600' },
  pending: { color: 'bg-yellow-100 text-yellow-600' },
  confirmed: { color: 'bg-purple-100 text-purple-600' }
};

const BookingCard: React.FC<BookingCardProps> = ({
  destination,
  startDate,
  endDate,
  imageUrl,
  price,
  currency,
  travelers,
  status,
  agency,
  onClick,
  className = ''
}) => {
  const { color } = statusConfig[status] || { color: 'bg-gray-100 text-gray-600' };
  
  return (
    <Card 
      className={`overflow-hidden hover:shadow-md transition-shadow ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 rounded-md">
            <AvatarImage src={imageUrl} alt={destination} className="object-cover" />
            <AvatarFallback className="rounded-md bg-gray-200">
              {destination.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h3 className="font-semibold">{destination}</h3>
            
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Calendar className="w-4 h-4 mr-1" />
              <span>
                {formatDate(startDate)} - {formatDate(endDate)}
              </span>
            </div>
            
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Users className="w-4 h-4 mr-1" />
              <span>{travelers} {travelers === 1 ? 'traveler' : 'travelers'}</span>
            </div>
            
            {agency && (
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{agency}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-end">
            <span className="font-medium mb-2">
              {formatCurrency(price, currency)}
            </span>
            <Badge variant="outline" className={`px-2 py-1 ${color}`} label= {status.charAt(0).toUpperCase() + status.slice(1)}>
             
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard; 