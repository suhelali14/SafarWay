import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { PackageForm } from '../PackageForm';
import { useToast } from '../../../../hooks/use-toast';
import { packageService } from '../../../../services/api/packageService';
import { useAuth } from '../../../../contexts/AuthContext';
import { Skeleton } from '../../../../components/ui/skeleton';
import { agencyAPI, TourPackage } from '../../../../services/api';

export function EditPackagePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [packageData, setPackageData] = useState<TourPackage | undefined>(undefined);
  
  const agencyId = user?.agencyId || '';

  useEffect(() => {
    if (agencyId && id) {
      fetchPackageData();
    }
  }, [agencyId, id]);

  const fetchPackageData = async () => {
    if (!agencyId || !id) {
      toast({
        title: "Error",
        description: "Missing required information to fetch package",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await agencyAPI.getPackageById(id);
      setPackageData(response.data);
    } catch (error) {
      console.error('Error fetching package details:', error);
      toast({
        title: "Error",
        description: "Failed to load package details",
        variant: "destructive"
      });
      // Navigate back to packages list if package can't be found
      navigate('/agency/packages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (updatedData: Partial<TourPackage>) => {
    if (!agencyId || !id) {
      toast({
        title: "Error",
        description: "Missing required information to update package",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await packageService.updatePackage(agencyId, id, updatedData);
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

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-1/4 mb-2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-[200px] w-full rounded-md" />
          <Skeleton className="h-[200px] w-full rounded-md" />
          <Skeleton className="h-[200px] w-full rounded-md" />
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <h2 className="text-xl font-medium">Package not found</h2>
          <p className="text-gray-500 mt-2">The package you're looking for doesn't exist or you don't have permission to edit it.</p>
          <button 
            onClick={() => navigate('/agency/packages')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
          >
            Go back to packages
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit Package | SafarWay Agency</title>
      </Helmet>

      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Edit Package</h1>
          <p className="text-gray-500">Update your travel package information</p>
        </div>

        <PackageForm 
          initialData={packageData}
          onSubmit={handleSubmit} 
          isLoading={isSubmitting} 
        />
      </div>
    </>
  );
} 