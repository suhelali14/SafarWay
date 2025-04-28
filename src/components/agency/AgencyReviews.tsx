


interface AgencyReviewsProps {
  agencyId: string;
}

export function AgencyReviews({ agencyId }: AgencyReviewsProps) {
  // const [selectedRating, setSelectedRating] = useState<string>('all');
  // const [_page, setPage] = useState(1);
  // const limit = 5;

  // // Parse rating filter
  // const ratingFilter = selectedRating === 'all' ? undefined : parseInt(selectedRating);
  
  // // Fetch reviews
  // const { 
  //   data, 
  //   isLoading, 
  //   error, 
  //   fetchNextPage, 
  //   hasNextPage, 
  //   isFetchingNextPage 
  // } = useInfiniteQuery<
  //   { data: AgencyReview[]; nextPage: number; hasNextPage: boolean },
  //   Error
  // >({
  //   queryKey: ['agencyReviews', agencyId, selectedRating],
  //   queryFn: async (context) => {
  //     const pageParam = typeof context.pageParam === 'number' ? context.pageParam : 1;
  //     const response = await agencyApi.getAgencyReviews(
  //       agencyId, 
  //       ratingFilter, 
  //       pageParam, // pageParam is now always a number
  //       limit
  //     );
  //     return {
  //       data: response.data,
  //       nextPage: pageParam + 1,
  //       hasNextPage: response.data.total > pageParam * limit,
  //     };
  //   },
  //   getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.nextPage : undefined),
  // });
  
  // // Fetch average rating
  // const { data: ratingData } = useQuery({
  //   queryKey: ['agencyRating', agencyId],
  //   queryFn: async () => {
  //     const response = await agencyApi.getAverageRating(agencyId);
  //     return response.data;
  //   }
  // });
  
  // const handleRatingFilter = (rating: string) => {
  //   setSelectedRating(rating);
  //   setPage(1); // Reset to first page when filter changes
  // };
  
  // const handleLoadMore = () => {
  //   // No need to manually set the page; useInfiniteQuery handles it
  //   fetchNextPage();
  // };
  
  // // Generate stars for a rating
  // const renderStars = (rating: number) => {
  //   const stars = [];
  //   const fullStars = Math.floor(rating);
  //   const hasHalfStar = rating % 1 >= 0.5;
    
  //   for (let i = 1; i <= 5; i++) {
  //     if (i <= fullStars) {
  //       stars.push(<Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />);
  //     } else if (i === fullStars + 1 && hasHalfStar) {
  //       stars.push(<StarHalf key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />);
  //     } else {
  //       stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
  //     }
  //   }
    
  //   return stars;
  // };
  
  return (
   
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Average Rating */}
       //
       {agencyId}
        {/* Rating Filters */}
        
      </div>
      
  )
}
