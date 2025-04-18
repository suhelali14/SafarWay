import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSession } from '../../../hooks/use-session';
import { useToast } from '../../../hooks/use-toast';
import NewPackageForm from './NewPackageForm';

export const PackageEditPage = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const [loading, setLoading] = useState(true);
  const [packageData, setPackageData] = useState(null);
  const { session } = useSession();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/packages/${packageId}`, {
          headers: {
            Authorization: `Bearer ${session?.token}`
          }
        });
        setPackageData(response.data);
      } catch (error) {
        console.error('Error fetching package details:', error);
        toast({
          title: 'Error',
          description: 'Failed to load package details for editing.',
          variant: 'destructive'
        });
        navigate('/agency/packages');
      } finally {
        setLoading(false);
      }
    };

    if (packageId) {
      fetchPackageDetails();
    }
  }, [packageId, session?.token, toast, navigate]);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Package</h1>
        <Card>
          <CardContent className="p-6 flex justify-center">
            <div className="w-full max-w-md">
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Package</h1>
        <Card>
          <CardContent className="p-6">
            <p className="text-center">Package not found or you don't have permission to edit it.</p>
            <div className="flex justify-center mt-4">
              <Button asChild>
                <Link to="/agency/packages">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Packages
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit Package | SafarWay Agency</title>
      </Helmet>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Edit Package: {packageData.name}</h1>
          <Button variant="outline" asChild>
            <Link to={`/agency/packages/${packageId}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Details
            </Link>
          </Button>
        </div>

        <NewPackageForm editMode={true} packageData={packageData} />
      </div>
    </>
  );
}; 