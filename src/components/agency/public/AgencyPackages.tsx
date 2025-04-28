import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Button } from '../../ui/button';
import { Skeleton } from '../../ui/skeleton';
import { Pagination } from '../../ui/pagination';
import { Calendar, Clock, Users, Map, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { agencyPublicService } from '../../../services/api/agencyPublicService';
import { Package } from '../../../services/api/packageService';
import { formatDate, formatCurrency } from '../../../utils/formatters';

interface AgencyPackagesProps {
  agencyId: string;
}

const AgencyPackages = ({ agencyId }: AgencyPackagesProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('live');
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [_totalPackages, setTotalPackages] = useState(0);

  const PAGE_SIZE = 6;

  useEffect(() => {
    fetchPackages();
  }, [activeTab, currentPage, agencyId]);

  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Determine status based on activeTab
      let status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED' | undefined;

      switch (activeTab) {
        case 'live':
          status = 'PUBLISHED';
          break;
        case 'upcoming':
          status = 'DRAFT';
          break;
        case 'past':
          status = 'ARCHIVED';
          break;
        default:
          status = 'PUBLISHED';
      }

      const response = await agencyPublicService.getAgencyPackages(agencyId, {
        status,
        page: currentPage,
        limit: PAGE_SIZE
      });

      setPackages(
        response.packages.map((pkg) => ({
          ...pkg,
          maxGroupSize: pkg.maxGroupSize ?? 0, // Ensure maxGroupSize is a number
        }))
      );
      setTotalPages(response.pagination.pages);
      setTotalPackages(response.pagination.total);
    } catch (err) {
      console.error('Error fetching packages:', err);
      setError('Failed to load packages. Please try again.');
      setPackages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getPackageStatusText = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'Live';
      case 'DRAFT':
        return 'Upcoming';
      case 'ARCHIVED':
        return 'Past';
      default:
        return status;
    }
  };

  const getEmptyMessage = () => {
    switch (activeTab) {
      case 'live':
        return 'No live packages at the moment.';
      case 'upcoming':
        return 'No upcoming packages scheduled.';
      case 'past':
        return 'No past packages available.';
      default:
        return 'No packages found.';
    }
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

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 w-full sm:w-auto">
          <TabsTrigger value="live" className="flex-1">Live Packages</TabsTrigger>
          <TabsTrigger value="upcoming" className="flex-1">Upcoming</TabsTrigger>
          <TabsTrigger value="past" className="flex-1">Past Packages</TabsTrigger>
        </TabsList>

        {['live', 'upcoming', 'past'].map((tabValue) => (
          <TabsContent key={tabValue} value={tabValue} className="w-full">
            {isLoading ? (
              // Loading state
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <Skeleton className="w-full h-48" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex justify-between pt-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              // Error state
              <div className="text-center py-10">
                <p className="text-destructive">{error}</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={fetchPackages}
                >
                  Try Again
                </Button>
              </div>
            ) : packages.length === 0 ? (
              // Empty state
              <div className="text-center py-10 border rounded-lg bg-gray-50">
                <p className="text-gray-500">{getEmptyMessage()}</p>
                <p className="text-sm text-gray-400 mt-2">
                  Check back later for new tour packages from this agency.
                </p>
              </div>
            ) : (
              // Packages list
              <>
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {packages.map((pkg) => (
                    <motion.div
                      key={pkg.id}
                      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      variants={itemVariants}
                    >
                      {/* Package Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={pkg.coverImage || '/images/placeholder-tour.jpg'}
                          alt={pkg.title}
                          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/placeholder-tour.jpg';
                          }}
                        />
                        <div className="absolute top-2 right-2 bg-white/90 text-xs font-medium px-2 py-1 rounded">
                          {getPackageStatusText(pkg.status)}
                        </div>
                      </div>

                      {/* Package Content */}
                      <div className="p-4">
                        <h3 className="text-lg font-bold line-clamp-1">{pkg.title}</h3>
                        <p className="text-sm text-gray-500 mb-3 line-clamp-1">
                          {pkg.subtitle || pkg.summary || pkg.description.substring(0, 100)}
                        </p>

                        {/* Package Details */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Map className="w-4 h-4 text-gray-400" />
                            <span className="truncate">{pkg.destination || 'Multiple destinations'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>{pkg.duration} days</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{formatDate(pkg.startDate || '')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span>Max {pkg.maxPeople || pkg.maximumPeople || 'N/A'}</span>
                          </div>
                        </div>

                        {/* Price and CTA */}
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div>
                            <span className="text-sm text-gray-500">Starting from</span>
                            <p className="font-bold text-primary">
                              {formatCurrency(pkg.pricePerPerson)}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => navigate(`/packages/${pkg.id}`)}
                          >
                            View Details
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AgencyPackages; 