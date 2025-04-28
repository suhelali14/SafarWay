import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { PackageForm } from './PackageForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/alert';
import { Button } from '../../../components/ui/button';
import { useAuth } from '../../../contexts/AuthContext';
import { Package } from '../../../services/api/packageService';
import { useToast } from '../../../hooks/use-toast';
import { agencyAPI } from '../../../services/api';

export function NewPackagePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const agencyId = user?.agency?.id;
  
  const handleSubmit = async (data: Partial<Package>) => {
    if (!agencyId) {
      toast({
        title: "Error",
        description: "Agency ID is required to create a package",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // Remove validFrom and validTill fields as they're not in the database schema yet
      const dataWithoutValidDates = { ...data };
   
      
      // Convert package data to FormData and map to backend field names
      Object.entries(dataWithoutValidDates).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // Map frontend field names to backend field names
          let fieldName = key;
          if (key === 'maxPeople') fieldName = 'maxGroupSize';
          if (key === 'minCapacity') fieldName = 'minimumAge';
          if (key === 'cancellationPolicy') fieldName = 'cancelationPolicy';
          if (key === 'tourType') fieldName = 'tourType';
          
          // The destination field is kept for backward compatibility
          // The backend will handle creating/connecting to destinations
          if (key === 'destination') fieldName = 'destination';
          
          if (Array.isArray(value)) {
            // Handle arrays (like inclusions, exclusions)
            formData.append(fieldName, JSON.stringify(value));
          } else if (typeof value === 'object' && value !== null && !('size' in value && 'type' in value)) {
            // Handle objects by converting to JSON string
            formData.append(fieldName, JSON.stringify(value));
          } else if (typeof value === 'number') {
            // Convert numbers to strings
            formData.append(fieldName, value.toString());
          } else {
            // Handle string values and File/Blob objects
            formData.append(fieldName, value as string | Blob);
          }
        }
      });
      
      // Ensure required fields are present
      if (data.maxPeople && !formData.has('maxGroupSize')) {
        formData.append('maxGroupSize', data.maxPeople.toString());
      }
      
      // Required by schema, set pricePerPerson to price if not present
      if (data.price && !formData.has('pricePerPerson')) {
        formData.append('pricePerPerson', data.price.toString());
      }
      
      console.log('Sending form data to server');
      
      await agencyAPI.createPackage(formData);
      toast({
        title: "Success",
        description: "Package created successfully"
      });
      navigate('/agency/packages');
    } catch (error) {
      console.error('Error creating package:', error);
      toast({
        title: "Error",
        description: "Failed to create package. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create New Package | SafarWay Agency</title>
      </Helmet>

      <div className="p-4 md:p-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/agency/packages')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Packages
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create New Package</h1>
            <p className="text-muted-foreground">Create a new travel package for your customers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <PackageForm 
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
            />
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Package Creation Guide</CardTitle>
                <CardDescription>Follow these tips to create an effective travel package</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">Compelling Title</h3>
                  <p className="text-sm text-muted-foreground">Choose a memorable, descriptive name that conveys the essence of the experience.</p>
                </div>
                <div>
                  <h3 className="font-medium">Detailed Description</h3>
                  <p className="text-sm text-muted-foreground">Paint a vivid picture of the experience. Include unique selling points and key attractions.</p>
                </div>
                <div>
                  <h3 className="font-medium">Quality Images</h3>
                  <p className="text-sm text-muted-foreground">Upload high-resolution images that showcase the destination's beauty and uniqueness.</p>
                </div>
                <div>
                  <h3 className="font-medium">Clear Inclusions/Exclusions</h3>
                  <p className="text-sm text-muted-foreground">Be specific about what's included and what's not to avoid customer confusion.</p>
                </div>
                <div>
                  <h3 className="font-medium">Transparent Pricing</h3>
                  <p className="text-sm text-muted-foreground">Set competitive prices. Consider offering early bird discounts or special rates.</p>
                </div>
              </CardContent>
            </Card>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Draft Mode</AlertTitle>
              <AlertDescription>
                New packages are saved as drafts. You can preview and make changes before publishing.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </>
  );
} 