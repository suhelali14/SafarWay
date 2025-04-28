import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PackageForm } from './PackageForm';
import { packageService } from '../../../services/api/packageService';
import { useToast } from '../../../hooks/use-toast';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../../components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Skeleton } from '../../../components/ui/skeleton';
import { agencyAPI, TourPackage } from '../../../services/api';

export function EditPackagePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [packageData, setPackageData] = useState<TourPackage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
      const response = await agencyAPI.getPackageById(id as string);
      setPackageData(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching package:', error);
      setError("Failed to load package data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: Partial<TourPackage>) => {
    if (!id || !agencyId) {
      toast({
        title: "Error",
        description: "Missing package ID or agency ID",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await packageService.updatePackage(agencyId, id, data);
      toast({
        title: "Success",
        description: "Package updated successfully"
      });
      navigate('/agency/packages');
    } catch (error) {
      console.error('Error updating package:', error);
      toast({
        title: "Error",
        description: "Failed to update package. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-36 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
          <Skeleton className="h-36 w-full" />
          <div className="flex justify-end">
            <Skeleton className="h-10 w-24 mr-2" />
            <Skeleton className="h-10 w-24" />
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
      <PackageForm 
        initialData={packageData} 
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        isEdit={true}
      />
    );
  };

  return (
    <>
      <Helmet>
        <title>Edit Package | SafarWay Agency</title>
      </Helmet>

      <div className="p-4 md:p-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/agency/packages')}
            className="mr-4"
            disabled={isSubmitting}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Packages
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-8 w-48" />
              ) : (
                `Edit Package: ${packageData?.name || 'Unknown'}`
              )}
            </h1>
            <p className="text-muted-foreground">
              {isSubmitting && (
                <span className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving changes...
                </span>
              )}
            </p>
          </div>
        </div>

        {renderContent()}
      </div>
    </>
  );
} 