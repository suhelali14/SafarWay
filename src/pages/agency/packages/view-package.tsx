import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Separator } from '../../../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { packageService, Package, PackageStatus } from '../../../services/api/packageService';
import { useToast } from '../../../hooks/use-toast';
import { useAuth } from '../../../contexts/AuthContext';
import { Skeleton } from '../../../components/ui/skeleton';
import { Gallery } from '../../../components/ui/gallery';
import { ArrowLeft, CalendarRange, Clock, Edit, ExternalLink, Globe, Mail, MapPin, Phone, Users, Pencil, Trash2, Eye, Share2, Clock3 } from 'lucide-react';
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

export function ViewPackagePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const agencyId = user?.agency?.id;

  useEffect(() => {
    if (!id || !agencyId) {
      setIsLoading(false);
      setError("Missing package ID or agency ID");
      return;
    }
    
    fetchPackageData();
  }, [id, agencyId]);

  const fetchPackageData = async () => {
    try {
      setIsLoading(true);
      const response = await packageService.getPackageById(agencyId as string, id as string);
      setPackageData(response);
      setError(null);
    } catch (error) {
      console.error('Error fetching package:', error);
      setError("Failed to load package data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePackage = async () => {
    if (!id || !agencyId) return;
    
    try {
      await packageService.deletePackage(agencyId, id);
      toast({
        title: "Success",
        description: "Package successfully deleted"
      });
      navigate('/agency/packages');
    } catch (error) {
      console.error('Error deleting package:', error);
      toast({
        title: "Error",
        description: "Failed to delete package",
        variant: "destructive"
      });
    }
  };

  const handleStatusChange = async (status: PackageStatus) => {
    if (!id || !agencyId || !packageData) return;
    
    try {
      await packageService.changePackageStatus(agencyId, id, status);
      toast({
        title: "Success",
        description: `Package status updated to ${status.toLowerCase()}`
      });
      
      // Update local state
      setPackageData({
        ...packageData,
        status
      });
    } catch (error) {
      console.error('Error changing package status:', error);
      toast({
        title: "Error",
        description: "Failed to update package status",
        variant: "destructive"
      });
    }
  };

  const getStatusBadgeVariant = (status: PackageStatus) => {
    switch (status) {
      case 'PUBLISHED':
        return 'success' as const;
      case 'DRAFT':
        return 'secondary' as const;
      case 'ARCHIVED':
        return 'destructive' as const;
      default:
        return 'default' as const;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    if (!amount && amount !== 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const renderQuickActions = () => {
    if (!packageData) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mt-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate(`/agency/packages/edit/${id}`)}
          className="flex items-center gap-2"
        >
          <Pencil className="h-4 w-4" /> Edit Package
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsDeleteDialogOpen(true)}
          className="flex items-center gap-2 text-destructive border-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" /> Delete
        </Button>
        
        {packageData.status === 'DRAFT' && (
          <Button 
            variant="default" 
            size="sm"
            onClick={() => handleStatusChange('PUBLISHED')}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" /> Publish Now
          </Button>
        )}
        
        {packageData.status === 'PUBLISHED' && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleStatusChange('ARCHIVED')}
            className="flex items-center gap-2"
          >
            Archive
          </Button>
        )}
        
        {packageData.status === 'ARCHIVED' && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleStatusChange('PUBLISHED')}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" /> Republish
          </Button>
        )}
        
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2 ml-auto"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast({
              title: "Link copied",
              description: "Package link copied to clipboard"
            });
          }}
        >
          <Share2 className="h-4 w-4" /> Share
        </Button>
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-2/3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-center">
          <h3 className="text-lg font-medium text-red-600 mb-2">
            Something went wrong
          </h3>
          <p className="text-red-500">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={fetchPackageData}
          >
            Retry
          </Button>
        </div>
      );
    }

    if (!packageData) {
      return (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">Package not found</h3>
          <p className="text-muted-foreground mt-2">
            The package you're looking for doesn't exist or has been deleted.
          </p>
          <Button 
            onClick={() => navigate('/agency/packages')} 
            className="mt-4"
          >
            Back to Packages
          </Button>
        </div>
      );
    }

    return (
      <>
        {/* Package Header with Cover Image */}
        <div className="relative rounded-lg overflow-hidden bg-gray-50 mb-6">
          {packageData.coverImage ? (
            <div className="h-[300px] md:h-[400px] w-full relative">
              <img 
                src={packageData.coverImage} 
                alt={packageData.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <Badge variant={getStatusBadgeVariant(packageData.status)} className="mb-3">
                  {packageData.status}
                </Badge>
                <h1 className="text-3xl font-bold mb-2 text-white">{packageData.name}</h1>
                <div className="flex items-center space-x-4 text-white/90">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {packageData.destination}
                  </div>
                  <div className="flex items-center">
                    <Clock3 className="h-4 w-4 mr-1" />
                    {packageData.duration} days
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {packageData.minCapacity}-{packageData.maxPeople} people
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <Badge variant={getStatusBadgeVariant(packageData.status)} className="mb-3">
                {packageData.status}
              </Badge>
              <h1 className="text-3xl font-bold mb-2">{packageData.name}</h1>
              <div className="flex items-center space-x-4 text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {packageData.destination}
                </div>
                <div className="flex items-center">
                  <Clock3 className="h-4 w-4 mr-1" />
                  {packageData.duration} days
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {packageData.minCapacity}-{packageData.maxPeople} people
                </div>
              </div>
            </div>
          )}
        </div>

        {renderQuickActions()}

        <div className="mt-6">
          <Tabs defaultValue="details">
            <TabsList className="grid w-full md:w-[400px] grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-6 mt-6">
              {/* Description */}
              <div>
                <h2 className="text-xl font-bold mb-3">Description</h2>
                <div className="prose max-w-none">
                  <p>{packageData.description}</p>
                </div>
              </div>
              
              <Separator />
              
              {/* Package Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Price Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Regular Price</span>
                        <span className="font-medium">{formatCurrency(packageData.price)}</span>
                      </div>
                      {packageData.discountPrice && packageData.discountPrice < packageData.price && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Discount Price</span>
                          <span className="font-medium text-green-600">{formatCurrency(packageData.discountPrice)}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Dates & Availability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {(packageData.validFrom || packageData.validTill) && (
                        <div className="flex items-start gap-2">
                          <CalendarRange className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                          <div>
                            <div className="text-sm">Valid period</div>
                            <div className="text-sm text-muted-foreground">
                              {packageData.validFrom ? formatDate(packageData.validFrom) : 'Any start date'} - {packageData.validTill ? formatDate(packageData.validTill) : 'No end date'}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {(packageData.startDate || packageData.endDate) && (
                        <div className="flex items-start gap-2 mt-2">
                          <Clock className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                          <div>
                            <div className="text-sm">Fixed dates</div>
                            <div className="text-sm text-muted-foreground">
                              {packageData.startDate ? formatDate(packageData.startDate) : 'N/A'} - {packageData.endDate ? formatDate(packageData.endDate) : 'N/A'}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {packageData.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{packageData.email}</span>
                        </div>
                      )}
                      
                      {packageData.phoneNumber && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{packageData.phoneNumber}</span>
                        </div>
                      )}
                      
                      {packageData.whatsapp && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span>{packageData.whatsapp}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Additional Information */}
              {packageData.additionalInfo && (
                <div>
                  <h2 className="text-lg font-bold mb-2">Additional Information</h2>
                  <div className="prose max-w-none">
                    <p>{packageData.additionalInfo}</p>
                  </div>
                </div>
              )}
              
              {/* Cancellation Policy */}
              {packageData.cancellationPolicy && (
                <div>
                  <h2 className="text-lg font-bold mb-2">Cancellation Policy</h2>
                  <div className="prose max-w-none">
                    <p>{packageData.cancellationPolicy}</p>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="inclusions" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Inclusions */}
                <div>
                  <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <span className="text-green-500">✓</span> What's Included
                  </h2>
                  {packageData.inclusions && packageData.inclusions.length > 0 ? (
                    <ul className="space-y-2">
                      {packageData.inclusions.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No inclusions specified</p>
                  )}
                </div>
                
                {/* Exclusions */}
                <div>
                  <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <span className="text-red-500">✗</span> What's Not Included
                  </h2>
                  {packageData.exclusions && packageData.exclusions.length > 0 ? (
                    <ul className="space-y-2">
                      {packageData.exclusions.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-red-500 mt-1">✗</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No exclusions specified</p>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="gallery" className="mt-6">
              {packageData.images && packageData.images.length > 0 ? (
                <Gallery images={packageData.images} />
              ) : (
                <div className="text-center py-10 border rounded-lg bg-gray-50">
                  <h3 className="text-lg font-medium">No gallery images</h3>
                  <p className="text-muted-foreground mt-1">This package doesn't have any gallery images yet.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/agency/packages/edit/${id}`)} 
                    className="mt-4"
                  >
                    <Edit className="h-4 w-4 mr-2" /> Add Images
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </>
    );
  };

  return (
    <>
      <Helmet>
        <title>
          {packageData ? `${packageData.name} | SafarWay Agency` : 'View Package | SafarWay Agency'}
        </title>
      </Helmet>

      <div className="p-4 md:p-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/agency/packages')}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Packages
          </Button>
          
          {renderContent()}
        </div>
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
            <AlertDialogAction onClick={handleDeletePackage}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 