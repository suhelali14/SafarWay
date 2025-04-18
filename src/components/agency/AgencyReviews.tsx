import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { agencyApi, AgencyReview } from '../../lib/api/agency';
import { Star, StarHalf, MessageSquare, AlertCircle, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { formatRelativeTime } from '../../utils/formatters';

interface AgencyReviewsProps {
  agencyId: string;
}

export function AgencyReviews({ agencyId }: AgencyReviewsProps) {
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [page, setPage] = useState(1);
  const limit = 5;

  // Parse rating filter
  const ratingFilter = selectedRating === 'all' ? undefined : parseInt(selectedRating);
  
  // Fetch reviews
  const { 
    data, 
    isLoading, 
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useQuery({
    queryKey: ['agencyReviews', agencyId, selectedRating, page],
    queryFn: async () => {
      const response = await agencyApi.getAgencyReviews(
        agencyId, 
        ratingFilter, 
        page, 
        limit
      );
      return response.data;
    },
    keepPreviousData: true
  });
  
  // Fetch average rating
  const { data: ratingData } = useQuery({
    queryKey: ['agencyRating', agencyId],
    queryFn: async () => {
      const response = await agencyApi.getAverageRating(agencyId);
      return response.data;
    }
  });
  
  const handleRatingFilter = (rating: string) => {
    setSelectedRating(rating);
    setPage(1); // Reset to first page when filter changes
  };
  
  const handleLoadMore = () => {
    setPage(prev => prev + 1);
    fetchNextPage();
  };
  
  // Generate stars for a rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<StarHalf key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />);
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
      }
    }
    
    return stars;
  };
  
  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Average Rating */}
        {ratingData && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {renderStars(ratingData.average)}
            </div>
            <Badge className="text-sm">
              {ratingData.average.toFixed(1)} / 5
            </Badge>
            <span className="text-sm text-gray-500">
              ({data?.total || 0} reviews)
            </span>
          </div>
        )}
        
        {/* Rating Filters */}
        <Tabs 
          value={selectedRating} 
          onValueChange={handleRatingFilter}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-6 w-full sm:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="5">5★</TabsTrigger>
            <TabsTrigger value="4">4★</TabsTrigger>
            <TabsTrigger value="3">3★</TabsTrigger>
            <TabsTrigger value="2">2★</TabsTrigger>
            <TabsTrigger value="1">1★</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load reviews. Please try again later.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border p-4">
              <div className="flex items-center gap-3 mb-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      )}
      
      {/* Reviews List */}
      {!isLoading && data?.data.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-1">No reviews yet</h3>
          <p className="text-gray-500">
            {selectedRating === 'all' 
              ? 'This agency has not received any reviews yet.'
              : `This agency has not received any ${selectedRating}-star reviews yet.`}
          </p>
        </div>
      )}
      
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {!isLoading && data?.data.map((review: AgencyReview) => (
          <motion.div 
            key={review.id}
            className="rounded-lg border p-4 bg-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-start gap-3 mb-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={review.userAvatar} alt={review.userName} />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <h4 className="font-medium">{review.userName}</h4>
                  
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-1">
                  <span>{formatRelativeTime(review.createdAt)}</span>
                  
                  {review.packageName && (
                    <span>
                      Booked: {review.packageName}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <p className="text-gray-600">{review.comment}</p>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Load More Button */}
      {hasNextPage && (
        <div className="flex justify-center mt-6">
          <Button 
            variant="outline" 
            onClick={handleLoadMore}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Loading...' : 'Load More Reviews'}
          </Button>
        </div>
      )}
    </div>
  );
} 