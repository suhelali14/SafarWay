import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Edit, Download } from 'lucide-react';
import { useSession } from '../../../hooks/use-session';
import { useToast } from '../../../hooks/use-toast';
import { agencyService, PackageExportData } from '../../../services/agencyService';

interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  duration: number;
  destination: string;
  validFrom?: string;
  validTill?: string;
  minCapacity: number;
  maxPeople: number;
  tourType: string;
  status: string;
  images: string[];
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

export const PackageDetailPage = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const [loading, setLoading] = useState(true);
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [exporting, setExporting] = useState(false);
  const { session } = useSession();
  const { toast } = useToast();

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
          description: 'Failed to load package details.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    if (packageId) {
      fetchPackageDetails();
    }
  }, [packageId, session?.token, toast]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleExport = async () => {
    if (!packageId) return;
    
    try {
      setExporting(true);
      const exportData = await agencyService.exportPackage(packageId);
      
      // Create a JSON file for download
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link and trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${exportData.packageDetails.title.toLowerCase().replace(/\s+/g, '-')}-export.json`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Export Successful',
        description: 'Package data has been exported successfully.',
      });
    } catch (error) {
      console.error('Error exporting package:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export package data. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Package Details</h1>
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
        <h1 className="text-2xl font-bold mb-6">Package Details</h1>
        <Card>
          <CardContent className="p-6">
            <p className="text-center">Package not found or you don't have permission to view it.</p>
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
        <title>{packageData.name} | SafarWay Agency</title>
      </Helmet>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{packageData.name}</h1>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/agency/packages">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
            <Button 
              variant="outline" 
              onClick={handleExport}
              disabled={exporting}
            >
              <Download className="w-4 h-4 mr-2" />
              {exporting ? 'Exporting...' : 'Export Package'}
            </Button>
            <Button asChild>
              <Link to={`/agency/packages/${packageId}/edit`}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Package
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {packageData.coverImage ? (
                  <img 
                    src={packageData.coverImage} 
                    alt={packageData.name} 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">No image available</p>
                  </div>
                )}
                
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Price</h3>
                    <p className="text-lg font-semibold">{formatCurrency(packageData.price)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                    <p className="text-lg font-semibold">{packageData.duration} days</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Destination</h3>
                    <p className="text-lg font-semibold">{packageData.destination}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <p className="text-lg font-semibold">{packageData.status}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Valid From</h3>
                    <p className="text-lg font-semibold">{formatDate(packageData.validFrom)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Valid Until</h3>
                    <p className="text-lg font-semibold">{formatDate(packageData.validTill)}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-700 mb-6">{packageData.description}</p>
                
                <h2 className="text-xl font-semibold mb-2">Capacity</h2>
                <p className="text-gray-700 mb-6">Min: {packageData.minCapacity}, Max: {packageData.maxPeople} people</p>
                
                <h2 className="text-xl font-semibold mb-2">Package Type</h2>
                <p className="text-gray-700 mb-6">{packageData.tourType}</p>
                
                <h2 className="text-xl font-semibold mb-2">Created</h2>
                <p className="text-gray-700">{formatDate(packageData.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}; 