import React from 'react';

import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Calendar, MapPin, Users, ArrowRight, FileText, BanIcon } from 'lucide-react';
import { format } from 'date-fns';

interface BookingCardProps {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  price: number;
  currency: string;
  travelers: number;
  status: 'upcoming' | 'confirmed' | 'pending' | 'completed' | 'cancelled';
  agency: {
    name: string;
  };
  bookingReference: string;
  paymentStatus: 'paid' | 'partial' | 'pending' | 'refunded';
  onViewDetails: () => void;
  onCancelBooking?: () => void;
  onDownloadInvoice?: () => void;
}

const statusColors: Record<string, { color: string, bgColor: string }> = {
  upcoming: { color: 'text-blue-700', bgColor: 'bg-blue-50' },
  confirmed: { color: 'text-green-700', bgColor: 'bg-green-50' },
  pending: { color: 'text-orange-700', bgColor: 'bg-orange-50' },
  completed: { color: 'text-gray-700', bgColor: 'bg-gray-100' },
  cancelled: { color: 'text-red-700', bgColor: 'bg-red-50' }
};

const paymentStatusColors: Record<string, { color: string, bgColor: string }> = {
  paid: { color: 'text-green-700', bgColor: 'bg-green-50' },
  partial: { color: 'text-purple-700', bgColor: 'bg-purple-50' },
  pending: { color: 'text-orange-700', bgColor: 'bg-orange-50' },
  refunded: { color: 'text-blue-700', bgColor: 'bg-blue-50' }
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
  bookingReference,
  paymentStatus,
  onViewDetails,
  onCancelBooking,
  onDownloadInvoice
}) => {
  // Format dates for display
  const formattedStartDate = format(new Date(startDate), 'MMM dd, yyyy');
  const formattedEndDate = format(new Date(endDate), 'MMM dd, yyyy');
  
  // Calculate duration
  const start = new Date(startDate);
  const end = new Date(endDate);
  const durationDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 relative">
          <img 
            src={imageUrl} 
            alt={destination} 
            className="w-full h-48 md:h-full object-cover"
          />
          <Badge 
            className={`absolute top-3 left-3 ${statusColors[status]?.bgColor} ${statusColors[status]?.color}` }
            label={status.charAt(0).toUpperCase() + status.slice(1)}
          >
            
          </Badge>
        </div>
        
        <CardContent className="flex-1 p-4 md:p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold mb-2">{destination}</h3>
              <div className="text-right">
                <div className="text-lg font-bold">
                  {currency} {price.toLocaleString()}
                </div>
                <Badge 
                  variant="outline" 
                  className={`${paymentStatusColors[paymentStatus]?.bgColor} ${paymentStatusColors[paymentStatus]?.color}`}
                  label={paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
                >
                  
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-y-2 gap-x-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formattedStartDate} - {formattedEndDate}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{durationDays} {durationDays === 1 ? 'day' : 'days'}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{travelers} {travelers === 1 ? 'traveler' : 'travelers'}</span>
              </div>
            </div>
            
            <div className="flex items-center mt-3">
              <span className="text-sm text-gray-500 mr-2">Agency:</span>
              <span className="text-sm font-medium">{agency.name}</span>
            </div>
            
            <div className="flex items-center mt-1">
              <span className="text-sm text-gray-500 mr-2">Booking Reference:</span>
              <span className="text-sm font-medium">{bookingReference}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4 justify-end">
            {status !== 'cancelled' && status !== 'completed' && onCancelBooking && (
              <Button 
                variant="outline" 
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onCancelBooking();
                }}
              >
                <BanIcon className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            )}
            
            {paymentStatus !== 'pending' && onDownloadInvoice && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDownloadInvoice();
                }}
              >
                <FileText className="h-4 w-4 mr-1" />
                Invoice
              </Button>
            )}
            
            <Button
              size="sm"
              onClick={onViewDetails}
            >
              View Details
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default BookingCard; 