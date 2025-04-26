import { useState, useEffect } from 'react';
import { Star, ChevronDown, ChevronUp, Filter, User } from 'lucide-react';
import { Button } from '../../ui/button';
import { Skeleton } from '../../ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Badge } from '../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { PackageReview } from '../../../services/api/optimizedPackageService';
import { optimizedPackageService } from '../../../services/api/optimizedPackageService';

interface PackageReviewsProps {
  packageId: string;
  totalReviews: number;
  avgRating: number;
}

export function PackageReviews({ packageId, totalReviews, avgRating }: PackageReviewsProps) {
  const [reviews, setReviews] = useState<PackageReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('latest');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [ratingCounts, setRatingCounts] = useState<Record<number, number>>({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({});

  const limit = 5; // reviews per page

  // Calculate rating distribution
  const calculateRatingPercentages = () => {
    const total = Object.values(ratingCounts).reduce((sum, count) => sum + count, 0);
    if (total === 0) return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    return Object.entries(ratingCounts).reduce(
      (acc, [rating, count]) => {
        acc[Number(rating)] = (count / total) * 100;
        return acc;
      },
      {} as Record<number, number>
    );
  };

  const ratingPercentages = calculateRatingPercentages();

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await optimizedPackageService.getPackageReviews(
          packageId,
          currentPage,
          limit
        );
        
        setReviews(response.data);
        setTotalPages(response.pagination.pages);
        
        // Mock the rating counts since we don't have this data from the API
        // In a real app, you would get this from the API
        setRatingCounts({
          5: Math.round(totalReviews * 0.6),
          4: Math.round(totalReviews * 0.25),
          3: Math.round(totalReviews * 0.1),
          2: Math.round(totalReviews * 0.03),
          1: Math.round(totalReviews * 0.02),
        });
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [packageId, currentPage, totalReviews]);

  // Handle sorting change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
    // In a real app, you would make a new API call with the updated sort parameter
  };

  // Handle rating filter
  const handleRatingFilter = (rating: number | null) => {
    setFilterRating(rating);
    setCurrentPage(1);
    // In a real app, you would make a new API call with the updated rating filter
  };

  // Toggle review expansion
  const toggleReviewExpansion = (reviewId: string) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  // Render the rating stars
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            index < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
          }`}
        />
      ));
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold">Reviews</h2>

      {/* Overview */}
      <div className="mb-8 md:flex">
        {/* Average rating */}
        <div className="mb-6 flex flex-col items-center justify-center md:mb-0 md:w-1/3">
          <div className="mb-2 text-5xl font-bold text-amber-500">{avgRating.toFixed(1)}</div>
          <div className="mb-3 flex">{renderStars(Math.round(avgRating))}</div>
          <p className="text-gray-600">Based on {totalReviews} reviews</p>
        </div>

        {/* Rating distribution */}
        <div className="md:w-2/3">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="mb-2 flex items-center">
              <div className="mr-2 w-10 text-sm font-medium">{rating} stars</div>
              <div className="mr-4 h-2.5 w-full rounded-full bg-gray-200">
                <div
                  className="h-2.5 rounded-full bg-amber-400"
                  style={{ width: `${ratingPercentages[rating]}%` }}
                ></div>
              </div>
              <div className="w-16 text-right text-sm text-gray-500">
                {ratingCounts[rating]} ({Math.round(ratingPercentages[rating])}%)
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and sort controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <Badge
            variant={filterRating === null ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => handleRatingFilter(null)}
          >
            All
          </Badge>
          {[5, 4, 3, 2, 1].map((rating) => (
            <Badge
              key={rating}
              variant={filterRating === rating ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => handleRatingFilter(rating)}
            >
              {rating} ★
            </Badge>
          ))}
        </div>

        <div className="flex items-center">
          <Filter className="mr-2 h-4 w-4 text-gray-500" />
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="highest">Highest rated</SelectItem>
              <SelectItem value="lowest">Lowest rated</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reviews list */}
      {loading ? (
        <div className="space-y-6">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-1/4" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-6 text-center">
          <p className="text-gray-600">No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => {
            const isExpanded = expandedReviews[review.id] || false;
            const reviewText = review.comment;
            const isTruncatable = reviewText.length > 200;

            return (
              <div key={review.id} className="border-b pb-6 last:border-0">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="mr-3 h-10 w-10">
                      {review.userAvatar ? (
                        <AvatarImage src={review.userAvatar} alt={review.userName} />
                      ) : (
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{review.userName}</h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{formatDate(review.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex">{renderStars(review.rating)}</div>
                </div>

                <div className="mt-2">
                  {isTruncatable && !isExpanded ? (
                    <>
                      <p>{reviewText.substring(0, 200)}...</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-1 h-auto p-0 text-sm font-medium text-primary"
                        onClick={() => toggleReviewExpansion(review.id)}
                      >
                        Read more
                        <ChevronDown className="ml-1 h-3 w-3" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <p>{reviewText}</p>
                      {isTruncatable && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-1 h-auto p-0 text-sm font-medium text-primary"
                          onClick={() => toggleReviewExpansion(review.id)}
                        >
                          Show less
                          <ChevronUp className="ml-1 h-3 w-3" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1 || loading}
            >
              Previous
            </Button>
            {Array(totalPages)
              .fill(0)
              .map((_, index) => {
                const page = index + 1;
                // Show first, last, and pages around current
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      className="w-9"
                      onClick={() => setCurrentPage(page)}
                      disabled={loading}
                    >
                      {page}
                    </Button>
                  );
                }
                // Show ellipsis
                if (
                  (page === 2 && currentPage > 3) ||
                  (page === totalPages - 1 && currentPage < totalPages - 2)
                ) {
                  return (
                    <span key={page} className="px-1">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || loading}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 