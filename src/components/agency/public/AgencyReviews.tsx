import { useState, useEffect } from 'react';
import { Star, MessageCircle,  User } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Badge } from '../../ui/badge';
import { Skeleton } from '../../ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { agencyPublicService, Review } from '../../../services/api/agencyPublicService';

interface AgencyReviewsProps {
  agencyId: string;
}

type RatingCount = {
  [key: number]: number;
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
};

const AgencyReviews = ({ agencyId }: AgencyReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [averageRating, _setAverageRating] = useState(0);
  const [totalReviews, _setTotalReviews] = useState(0);
  const [ratingCounts, setRatingCounts] = useState<RatingCount>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchReviews();
  }, [agencyId, selectedRating, currentPage]);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get agency details to get overall rating stats
      if (currentPage === 1 && !selectedRating) {
        try {
          const agencyDetails = await agencyPublicService.getAgencyDetails(agencyId);
          console.log("agencyDetails", agencyDetails);
          
      
          
          // Calculate approximate distribution based on average
          const total = 1;
          if (total > 0) {
            // This is a simplified distribution - in a real app you'd fetch actual counts
            const avg = 0;
            const fiveStar = Math.round((avg / 5) * total * 0.7);
            const fourStar = Math.round((avg / 5) * total * 0.2);
            const threeStar = Math.round((1 - (avg / 5)) * total * 0.1);
            const twoStar = Math.round((1 - (avg / 5)) * total * 0.05);
            const oneStar = total - fiveStar - fourStar - threeStar - twoStar;
            
            setRatingCounts({
              5: fiveStar,
              4: fourStar,
              3: threeStar,
              2: twoStar,
              1: Math.max(0, oneStar)
            });
          }
        } catch (err) {
          console.error('Error fetching agency details:', err);
        }
      }

      // Fetch reviews with optional star filter
      const response = await agencyPublicService.getAgencyReviews(
        agencyId,
        selectedRating || undefined,
        currentPage,
        8 // page size
      );

      setReviews(response.reviews);
      setTotalPages(response.pagination.pages);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews. Please try again.');
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRatingFilter = (rating: number) => {
    if (selectedRating === rating) {
      setSelectedRating(null);
    } else {
      setSelectedRating(rating);
    }
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Render star rating with count
  const renderStarRating = (stars: number) => {
    const percentage = (ratingCounts[stars] / totalReviews) * 100 || 0;
    
    return (
      <div 
        className={`flex items-center gap-2 cursor-pointer p-1 rounded transition-colors ${
          selectedRating === stars ? 'bg-gray-100' : 'hover:bg-gray-50'
        }`}
        onClick={() => handleRatingFilter(stars)}
      >
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <div className="flex-grow mx-2">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 rounded-full"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
        <span className="text-sm text-gray-500 min-w-[40px]">
          ({ratingCounts[stars]})
        </span>
      </div>
    );
  };
  
  // Render star rating (static)
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Overall Rating Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold">{averageRating.toFixed(1)}</h3>
                <div className="flex justify-center my-2">
                  {renderStars(Math.round(averageRating))}
                </div>
                <p className="text-sm text-gray-500">Based on {totalReviews} reviews</p>
              </div>
              
              {/* Star distribution */}
              <div className="space-y-2 mt-6">
                {[5, 4, 3, 2, 1].map(stars => renderStarRating(stars))}
              </div>
              
              {selectedRating && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4"
                  onClick={() => setSelectedRating(null)}
                >
                  Clear Filter
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Reviews List */}
        <div className="md:col-span-2">
          {isLoading ? (
            // Loading state
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24 mt-1" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            // Error state
            <div className="text-center py-10 border rounded-lg">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-destructive">{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={fetchReviews}
              >
                Try Again
              </Button>
            </div>
          ) : reviews.length === 0 ? (
            // Empty state
            <div className="text-center py-10 border rounded-lg">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No reviews found</p>
              <p className="text-sm text-gray-400 mt-2">
                {selectedRating 
                  ? `No ${selectedRating}-star reviews available.` 
                  : 'This agency has not received any reviews yet.'}
              </p>
              {selectedRating && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setSelectedRating(null)}
                >
                  View All Reviews
                </Button>
              )}
            </div>
          ) : (
            // Reviews list
            <motion.div 
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence mode="wait">
                {reviews.map((review) => (
                  <motion.div key={review.id} variants={itemVariants}>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex gap-3">
                            <Avatar>
                              <AvatarImage src={review.userImage} />
                              <AvatarFallback>
                                <User className="w-4 h-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{review.userName}</h4>
                                {review.isVerifiedBooking && (
                                  <Badge variant="outline" className="flex items-center gap-1 text-green-600 bg-green-50 text-xs" label='Verified Booking'>
                                   
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                            </div>
                          </div>
                          <div>{renderStars(review.rating)}</div>
                        </div>
                        
                        <p className="text-gray-700 mb-4">{review.comment}</p>
                        
                        {/* Agency response (if available) */}
                        {review.agencyResponse && (
                          <div className="bg-gray-50 p-3 rounded-md mt-3 border-l-2 border-primary">
                            <p className="text-sm font-medium">Agency Response:</p>
                            <p className="text-sm text-gray-600 mt-1">{review.agencyResponse.response}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(review.agencyResponse.respondedAt)}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Load more button */}
              {currentPage < totalPages && (
                <div className="text-center mt-6">
                  <Button 
                    variant="outline"
                    onClick={handleLoadMore}
                  >
                    Load More Reviews
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgencyReviews; 