import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components/ui/alert-dialog';
import { Badge } from '../../../components/ui/badge';
import { Skeleton } from '../../../components/ui/skeleton';
import { useToast } from '../../../hooks/use-toast';
import { Plus, Search, Edit, Trash2, Eye, Filter } from 'lucide-react';
import { packageService, Package, PackageStatus, TourType, PackageFilters } from '../../../services/api/packageService';
import { useAuth } from '../../../contexts/AuthContext';
import { agencyAPI } from '../../../services/api';

// Define the API response type
interface APIResponse {
  status: string;
  message: string;
  data: Package[];
  meta: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
}

export function AgencyPackagesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const agencyId = user?.agency?.id || '';
  
  // State
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [packageTypeFilter, setPackageTypeFilter] = useState<string>('all');
  const [destinationFilter, setDestinationFilter] = useState<string>('');
  const [difficultyLevelFilter, setDifficultyLevelFilter] = useState<string>('all');
  const [isFlexibleFilter, setIsFlexibleFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (agencyId) {
      fetchPackages();
    }
  }, [page, statusFilter, packageTypeFilter, destinationFilter, difficultyLevelFilter, isFlexibleFilter, agencyId]);

  const fetchPackages = async () => {
    if (!agencyId) {
      toast({
        title: "Error",
        description: "Agency ID is required to fetch packages",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Build filters object
      const filters: PackageFilters = {
        page,
        limit,
        ...(statusFilter !== 'all' && { status: statusFilter as PackageStatus }),
        ...(packageTypeFilter !== 'all' && { package_type: packageTypeFilter as TourType }),
        ...(destinationFilter && { destination: destinationFilter }),
        ...(difficultyLevelFilter !== 'all' && { difficultyLevel: difficultyLevelFilter }),
        ...(isFlexibleFilter !== 'all' && { isFlexible: isFlexibleFilter === 'true' }),
        ...(searchTerm && { search: searchTerm })
      };
      
      const response = await agencyAPI.getAllPackages(filters);
      
      // Access the data with the correct structure
      const apiResponse = response.data as APIResponse;
      
      if (apiResponse && apiResponse.data) {
        setPackages(apiResponse.data);
        setTotal(apiResponse.meta.total);
        setTotalPages(apiResponse.meta.pages);
      } else {
        toast({
          title: "Error",
          description: "Invalid response format from server",
          variant: "destructive"
        });
        setPackages([]);
        setTotal(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast({
        title: "Error",
        description: "Failed to load packages. Please try again.",
        variant: "destructive"
      });
      setPackages([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1); // Reset to first page when searching
    fetchPackages();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleDeleteClick = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedPackage || !agencyId) return;
    
    try {
      await packageService.deletePackage(agencyId, selectedPackage.id);
      toast({
        title: "Success",
        description: "Package successfully deleted"
      });
      fetchPackages(); // Reload the list
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting package:', error);
      toast({
        title: "Error",
        description: "Failed to delete package",
        variant: "destructive"
      });
    }
  };

  // const handleStatusChange = async (packageId: string, status: PackageStatus) => {
  //   if (!agencyId) return;
    
  //   try {
  //     await packageService.changePackageStatus(agencyId, packageId, status);
  //     toast({
  //       title: "Success",
  //       description: `Package status changed to ${status.toLowerCase()}`
  //     });
  //     fetchPackages(); // Reload the list
  //   } catch (error) {
  //     console.error('Error changing package status:', error);
  //     toast({
  //       title: "Error",
  //       description: "Failed to change package status",
  //       variant: "destructive"
  //     });
  //   }
  // };

  const getStatusBadgeVariant = (status: PackageStatus) => {
    switch (status) {
      case 'PUBLISHED':
        return 'outline' as const;
      case 'DRAFT':
        return 'secondary' as const;
      case 'ARCHIVED':
        return 'destructive' as const;
      default:
        return 'default' as const;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setPackageTypeFilter('all');
    setDestinationFilter('');
    setDifficultyLevelFilter('all');
    setIsFlexibleFilter('all');
    setSearchTerm('');
    setPage(1);
    setIsFilterOpen(false);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex justify-center items-center mt-6 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1 || loading}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages || loading}
        >
          Next
        </Button>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Travel Packages | SafarWay Agency</title>
      </Helmet>

      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Travel Packages</h1>
            <p className="text-muted-foreground">
              {total} packages found • Manage your travel offerings
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" /> Filters
            </Button>
            <Button onClick={() => navigate('new')} className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> New Package
            </Button>
          </div>
        </div>

        <Card className="p-4 md:p-6">
          <div className={`flex flex-col gap-4 mb-6 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search packages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-9"
                  />
                </div>
              </div>
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={packageTypeFilter} onValueChange={setPackageTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="ADVENTURE">Adventure</SelectItem>
                    <SelectItem value="CULTURAL">Cultural</SelectItem>
                    <SelectItem value="WILDLIFE">Wildlife</SelectItem>
                    <SelectItem value="BEACH">Beach</SelectItem>
                    <SelectItem value="MOUNTAIN">Mountain</SelectItem>
                    <SelectItem value="URBAN">Urban</SelectItem>
                    <SelectItem value="CRUISE">Cruise</SelectItem>
                    <SelectItem value="WELLNESS">Wellness</SelectItem>
                    <SelectItem value="SPIRITUAL">Spiritual</SelectItem>
                    <SelectItem value="EDUCATIONAL">Educational</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Select value={difficultyLevelFilter} onValueChange={setDifficultyLevelFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Difficulty Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulty Levels</SelectItem>
                    <SelectItem value="EASY">Easy</SelectItem>
                    <SelectItem value="MODERATE">Moderate</SelectItem>
                    <SelectItem value="CHALLENGING">Challenging</SelectItem>
                    <SelectItem value="DIFFICULT">Difficult</SelectItem>
                    <SelectItem value="EXTREME">Extreme</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={isFlexibleFilter} onValueChange={setIsFlexibleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Flexibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Packages</SelectItem>
                    <SelectItem value="true">Flexible Dates</SelectItem>
                    <SelectItem value="false">Fixed Dates</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
              <Button size="sm" onClick={handleSearch} className="ml-2">
                Apply Filters
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ))}
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">No packages found</h3>
              <p className="text-muted-foreground mt-1">
                {searchTerm || statusFilter !== 'all' || packageTypeFilter !== 'all' 
                  ? "Try adjusting your filters" 
                  : "Create your first package to get started"}
              </p>
              {!(searchTerm || statusFilter !== 'all' || packageTypeFilter !== 'all') && (
                <Button 
                  onClick={() => navigate('new')} 
                  className="mt-4"
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" /> Create Package
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {pkg.coverImage && (
                            <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                              <img
                                src={pkg.coverImage}
                                alt={pkg.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <div className="truncate max-w-[200px]">
                              {pkg.title}
                              {pkg.isFlexible && (
                                <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-sm">Flex</span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {pkg.subtitle && (
                                <span className="truncate block">{pkg.subtitle}</span>
                              )}
                              <span>{pkg.duration} days</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="truncate max-w-[150px]">
                          {pkg.destination || (pkg.destinations && pkg.destinations.length > 0 ? pkg.destinations.map(d => d.name).join(', ') : 'N/A')}
                        </div>
                      </TableCell>
                      <TableCell>{pkg.tourType}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(pkg.pricePerPerson)}
                        {pkg.discountPrice && (
                          <div className="text-xs line-through text-muted-foreground">
                            {formatCurrency(pkg.discountPrice)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {pkg.difficultyLevel || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(pkg.status)} label={pkg.status}>
                          
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(pkg.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`view/${pkg.id}`)}
                            title="View Package"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`edit/${pkg.id}`)}
                            title="Edit Package"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(pkg)}
                            title="Delete Package"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {renderPagination()}
        </Card>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this package?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the package
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 