import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Download, ArrowRight, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { format } from 'date-fns';

interface BookingsTimelineProps {
  data: any[];
  isLoading: boolean;
  limit?: number;
}

export function BookingsTimeline({ data, isLoading, limit }: BookingsTimelineProps) {
  const [filter, setFilter] = useState('all');
  const [filteredBookings, setFilteredBookings] = useState<any[]>([]);
  
  useEffect(() => {
    if (!data) return;
    
    let filtered = [...data];
    
    if (filter === 'upcoming') {
      filtered = data.filter(booking => 
        booking.status === 'CONFIRMED' && new Date(booking.startDate) > new Date()
      );
    } else if (filter === 'past') {
      filtered = data.filter(booking => 
        booking.status === 'COMPLETED' || 
        (booking.status === 'CONFIRMED' && new Date(booking.endDate) < new Date())
      );
    } else if (filter === 'cancelled') {
      filtered = data.filter(booking => booking.status === 'CANCELLED');
    }
    
    // Apply limit if specified
    if (limit && limit > 0) {
      filtered = filtered.slice(0, limit);
    }
    
    setFilteredBookings(filtered);
  }, [data, filter, limit]);

  // Get badge color based on booking status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };
  
  // Format status text
  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {!limit && (
          <Skeleton className="h-10 w-full max-w-md mb-4" />
        )}
        
        {[1, 2, 3].map((i) => (
          <Card key={i} className="mb-4">
            <CardHeader>
              <div className="flex justify-between">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-6 w-24" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter>
              <div className="flex justify-between w-full">
                <Skeleton className="h-9 w-32" />
                <Skeleton className="h-9 w-24" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="bg-gray-50 dark:bg-gray-800/50 border-dashed">
        <CardContent className="py-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">No Bookings Found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              You haven't made any bookings yet.
            </p>
            <Button>
              <ArrowRight className="mr-2 h-4 w-4" />
              Browse Packages
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Tabs - Only show when not limited */}
      {!limit && (
        <Tabs defaultValue="all" value={filter} onValueChange={setFilter} className="w-full max-w-md">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
        </Tabs>
      )}
      
      {/* Bookings List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {filteredBookings.length === 0 ? (
            <Card className="bg-gray-50 dark:bg-gray-800/50 border-dashed">
              <CardContent className="py-8">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">No {filter} bookings found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {filter === 'all' ? 'You have no bookings yet.' : `You have no ${filter} bookings.`}
                  </p>
                  {filter !== 'all' && (
                    <Button variant="outline" onClick={() => setFilter('all')}>
                      View All Bookings
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                      <div>
                        <CardTitle>{booking.tourName || booking.tourPackage?.title}</CardTitle>
                        <CardDescription>
                          {booking.agencyName || booking.tourPackage?.agency?.name}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusBadgeColor(booking.status)}>
                        {formatStatus(booking.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex flex-wrap gap-x-8 gap-y-2">
                        <div>
                          <span className="font-medium">Booking Date:</span>{' '}
                          {formatDate(booking.createdAt)}
                        </div>
                        <div>
                          <span className="font-medium">Travel Date:</span>{' '}
                          {formatDate(booking.startDate)}
                          {booking.endDate && ` - ${formatDate(booking.endDate)}`}
                        </div>
                        <div>
                          <span className="font-medium">Guests:</span>{' '}
                          {booking.numberOfParticipants || booking.participants || 1}
                        </div>
                        <div>
                          <span className="font-medium">Total:</span>{' '}
                          ${booking.totalAmount || booking.totalPrice}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex flex-wrap justify-between w-full gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download Invoice
                      </Button>
                      
                      {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                        <Button size="sm" variant="default">
                          View Details
                        </Button>
                      )}
                      
                      {(booking.status === 'COMPLETED' || booking.status === 'CANCELLED') && (
                        <Button size="sm" className="gap-1">
                          <RefreshCw className="h-4 w-4" />
                          Rebook
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 