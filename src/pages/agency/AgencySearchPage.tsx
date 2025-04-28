// import { useState, useEffect } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import { useInfiniteQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
// import { motion } from 'framer-motion';
// import { agencyApi, AgencyDetails } from '../../lib/api/agency';
// import { AgencyCard } from '../../components/agency/AgencyCard';
// import { Button } from '../../components/ui/button';
// import { Input } from '../../components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
// import { Skeleton } from '../../components/ui/skeleton';
// import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
// import { AlertCircle, Search, SlidersHorizontal } from 'lucide-react';

export function AgencySearchPage() {
  // // Get search params from URL
  // const [searchParams, setSearchParams] = useSearchParams();
  // const initialQuery = searchParams.get('q') || '';
  // const initialSort = searchParams.get('sort') || 'rating';
  
  // // Local state
  // const [searchQuery, setSearchQuery] = useState(initialQuery);
  // const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  // const [sortBy, setSortBy] = useState<string>(initialSort);
  // const [page, setPage] = useState(1);
  // const limit = 12;
  
  // // Handle search query debounce
  // useEffect(() => {
  //   const timerId = setTimeout(() => {
  //     setDebouncedQuery(searchQuery);
  //     // Update URL params
  //     const newParams = new URLSearchParams(searchParams);
  //     if (searchQuery) {
  //       newParams.set('q', searchQuery);
  //     } else {
  //       newParams.delete('q');
  //     }
  //     setSearchParams(newParams);
  //     // Reset to first page when search changes
  //     setPage(1);
  //   }, 500);
    
  //   return () => clearTimeout(timerId);
  // }, [searchQuery, searchParams, setSearchParams]);
  
  // // Handle sort change
  // const handleSortChange = (value: string) => {
  //   setSortBy(value);
  //   // Update URL params
  //   const newParams = new URLSearchParams(searchParams);
  //   newParams.set('sort', value);
  //   setSearchParams(newParams);
  //   // Reset to first page when sort changes
  //   setPage(1);
  // };
  
  // // Fetch agencies
  // const { 
  //   data, 
  //   isLoading, 
  //   error, 
  //   isFetchingNextPage,
  //   hasNextPage,
  //   fetchNextPage
  // } = useInfiniteQuery({
  //   queryKey: ['agencies', debouncedQuery, sortBy],
  //   queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
  //     if (debouncedQuery) {
  //       // Search agencies by query
  //       const response = await agencyApi.searchAgencies(debouncedQuery, pageParam, limit);
  //       return response.data;
  //     } else {
  //       // Get all agencies with sorting
  //       const params = {
  //         page: pageParam as number,
  //         limit,
  //         sortBy: sortBy as 'rating' | 'packages' | 'founded',
  //         sortOrder: 'desc' as 'asc' | 'desc'
  //       };
  //       const response = await agencyApi.getAllAgencies(params);
  //       return response.data;
  //     }
  //   },
  //   getNextPageParam: (lastPage: { nextPage?: number }, allPages: any[]) => {
  //     return lastPage?.nextPage ?? false;
  //   }
  // });
  
  //   fetchNextPage();
  // const handleLoadMore = () => {
  //   setPage(prev => prev + 1);
  //   fetchNextPage();
  // };
  
  // // Generate container and item animations
  // const container = {
  //   hidden: { opacity: 0 },
  //   show: {
  //     opacity: 1,
  //     transition: {
  //       staggerChildren: 0.1
  //     }
  //   }
  // };
  
  // const item = {
  //   hidden: { opacity: 0, y: 20 },
  //   show: { opacity: 1, y: 0 }
  // };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Find Travel Agencies | SafarWay</title>
        <meta 
          name="description" 
          content="Browse and find the best travel agencies for your next adventure. Filter by ratings, services, and more."
        />
      </Helmet>
      
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Travel Agencies</h1>
        <p className="text-gray-600">
          Find the perfect travel agency for your next adventure
        </p>
      </div>
      
      {/* Search and Filter Bar */}
      {/* <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            type="text"
            placeholder="Search for agencies..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-gray-500" />
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rating</SelectItem>
              <SelectItem value="packages">Most Packages</SelectItem>
              <SelectItem value="founded">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div> */}
      
      {/* Results Count */}
      {/* {data && (
        <div className="mb-6">
          <p className="text-gray-600">
            {data.pages.length} {data.pages.length === 1 ? 'agency' : 'agencies'} found
            {debouncedQuery ? ` for "${debouncedQuery}"` : ''}
          </p>
        </div>
      )} */}
      
      {/* Error State */}
      {/* {error && (
        <Alert variant="destructive" className="my-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load agencies. Please try again later.
          </AlertDescription>
        </Alert>
      )} */}
      
      {/* Loading State */}
      {/* {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64">
              <Skeleton className="h-full w-full rounded-lg" />
            </div>
          ))}
        </div>
      )} */}
      
      {/* No Results */}
      {/* {!isLoading && data?.pages.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">No agencies found</h3>
          <p className="text-gray-500 mb-6">
            {debouncedQuery 
              ? `No agencies match your search for "${debouncedQuery}"`
              : 'No agencies are currently available'}
          </p>
          {debouncedQuery && (
            <Button 
              variant="outline" 
              onClick={() => setSearchQuery('')}
            >
              Clear Search
            </Button>
          )}
        </div>
      )} */}
      
      {/* Agency Cards */}
      {/* {!isLoading && data?.pages.length > 0 && (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {data.pages.map((agency: AgencyDetails) => (
            <motion.div key={agency.id} variants={item}>
              <AgencyCard agency={agency} />
            </motion.div>
          ))}
        </motion.div>
      )} */}
      
      {/* Load More Button */}
      {/* {hasNextPage && (
        <div className="flex justify-center mt-8">
          <Button 
            variant="outline" 
            onClick={handleLoadMore}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )} */}
    </div>
  );
} 