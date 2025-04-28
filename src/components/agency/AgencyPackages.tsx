import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInfiniteQuery } from '@tanstack/react-query';
import { agencyApi, AgencyPackage } from '../../lib/api/agency';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Skeleton } from '../ui/skeleton';
import { PackageCard } from '../packages/PackageCard';
import { Button } from '../ui/button';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface AgencyPackagesProps {
  agencyId: string;
}

export function AgencyPackages({ agencyId }: AgencyPackagesProps) {
  const [activeTab, setActiveTab] = useState('live');
  const [page, setPage] = useState(1);
  const limit = 6; // Number of packages per page
  
  // Get current date for filtering
  const currentDate = new Date().toISOString();
  
  // Fetch packages based on active tab
  const { 
    data,
    isLoading,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = useInfiniteQuery<{
    data: AgencyPackage[];
    total: number;
  }>({
    initialPageParam: 1,
    queryKey: ['agencyPackages', agencyId, activeTab],
    queryFn: async ({ pageParam }: { pageParam: unknown }) => {
      
      const response = await agencyApi.getAgencyPackages(
        agencyId,
        page.toString(),
        (typeof pageParam === 'number' ? pageParam : 1),
        limit
      );

      if (activeTab === 'upcoming' || activeTab === 'past') {
        const filtered = response.data.data.filter((pkg) => {
          if (activeTab === 'upcoming') {
            return new Date(pkg.validFrom) > new Date(currentDate);
          } else {
            return new Date(pkg.validTill) < new Date(currentDate);
          }
        });

        if (activeTab === 'upcoming') {
          filtered.sort(
            (a, b) =>
              new Date(a.validFrom).getTime() - new Date(b.validFrom).getTime()
          );
        }

        if (activeTab === 'past') {
          filtered.sort(
            (a, b) =>
              new Date(b.validTill).getTime() - new Date(a.validTill).getTime()
          );
        }

        return {
          ...response.data,
          data: filtered,
        };
      }

      return response.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.flatMap((page) => page.data).length;
      return totalFetched < lastPage.total ? allPages.length + 1 : undefined;
    },
  });
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setPage(1); // Reset to first page when tab changes
  };
  
  // Handle load more
  const handleLoadMore = () => {
    fetchNextPage();
    fetchNextPage();
  };
  
  return (
    <div>
      <Tabs defaultValue="live" onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="live">Live Packages</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past Packages</TabsTrigger>
        </TabsList>
        
        {error ? (
          <Alert variant="destructive" className="my-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load packages. Please try again later.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-96">
                    <Skeleton className="h-48 w-full rounded-t-lg" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <div className="flex justify-between pt-4">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-10 w-28" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <TabsContent value={activeTab} className="mt-0">
                {data?.pages.flatMap((page) => page.data).length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">
                      {activeTab === 'live' ? 'No live packages available.' : 
                       activeTab === 'upcoming' ? 'No upcoming packages available.' : 
                       'No past packages available.'}
                    </p>
                  </div>
                ) : (
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {data?.pages.flatMap((page) => page.data).map((pkg: AgencyPackage) => (
                      <PackageCard
                        key={pkg.id}
                        packageData={{
                          id: pkg.id,
                          title: pkg.title,
                          description: pkg.description,
                          price: pkg.price,
                          discountedPrice: pkg.discountedPrice,
                          discount: pkg.discount,
                          imageUrl: pkg.image,
                          location: pkg.location,
                          duration: pkg.duration,
                          maxGroupSize: pkg.maxGroupSize,
                          validFrom: pkg.validFrom,
                          validTill: pkg.validTill,
                          featured: pkg.featured,
                          agencyId
                        }}
                        showAgencyLink={false}
                      />
                    ))}
                  </motion.div>
                )}
                
                {hasNextPage && (
                  <div className="flex justify-center mt-8">
                    <Button 
                      variant="outline" 
                      onClick={handleLoadMore}
                      disabled={isFetchingNextPage}
                    >
                      {isFetchingNextPage ? 'Loading...' : 'Load More'}
                    </Button>
                  </div>
                )}
              </TabsContent>
            )}
          </>
        )}
      </Tabs>
    </div>
  );
}