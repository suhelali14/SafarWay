import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Building2, Save, Trash, UploadCloud } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Textarea } from '../../../../components/ui/textarea';
import { Label } from '../../../../components/ui/label';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../components/ui/form';
import toast from 'react-hot-toast';
import { adminAPI } from '../../../../services/api';

// Define the form validation schema
const agencyFormSchema = z.object({
  name: z.string().min(2, 'Agency name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').optional().or(z.literal('')),
  contactEmail: z.string().email('Invalid email address'),
  contactPhone: z.string().min(10, 'Phone number must be at least 10 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters').optional().or(z.literal('')),
  status: z.enum(['PENDING', 'ACTIVE', 'INACTIVE', 'REJECTED']),
});

type AgencyFormValues = z.infer<typeof agencyFormSchema>;

export default function EditAgencyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  // Initialize the form
  const form = useForm<AgencyFormValues>({
    resolver: zodResolver(agencyFormSchema),
    defaultValues: {
      name: '',
      description: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
      status: 'PENDING',
    },
  });

  // Fetch agency details
  useEffect(() => {
    const fetchAgencyDetails = async () => {
      try {
        setIsLoading(true);
        if (!id) return;
        
        const response = await adminAPI.getAgencyById(id);
        const agency = response.data;
        
        // Set form default values
        form.reset({
          name: agency.name,
          description: agency.description || '',
          contactEmail: agency.contactEmail,
          contactPhone: agency.contactPhone,
          address: agency.address || '',
          status: agency.status,
        });
        
        // Set logo preview if exists
        if (agency.logo) {
          setLogoPreview(agency.logo);
        }
        
        setError(null);
      } catch (error) {
        console.error('Error fetching agency details:', error);
        setError('Failed to load agency details');
        toast.error('Failed to load agency details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgencyDetails();
  }, [id, form]);

  // Handle logo file selection
  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Logo file size must be less than 2MB');
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Logo file must be JPG, PNG or SVG');
        return;
      }
      
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const onSubmit = async (values: AgencyFormValues) => {
    try {
      setIsSubmitting(true);

      // Create form data to handle file upload
      const formData = new FormData();
      
      // Add all form values to the formData
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key as keyof AgencyFormValues] as string);
      });
      
      // Add logo file if selected
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      // Update the agency
      await adminAPI.updateAgency(id!, formData);
      
      toast.success('Agency updated successfully');
      navigate(`/admin/agencies/${id}`);
    } catch (error) {
      console.error('Error updating agency:', error);
      toast.error('Failed to update agency');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh]">
        <p className="text-lg text-red-600 mb-4">{error}</p>
        <Button onClick={() => navigate(`/admin/agencies/${id}`)}>
          Go Back to Agency
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit Agency | SafarWay Admin</title>
      </Helmet>

      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/admin/agencies/${id}`)}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Agency
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Agency</h1>
            <p className="text-sm text-gray-500">Update agency information</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              Agency Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Agency Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter agency name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter contact email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Phone *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter contact phone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            {...field}
                          >
                            <option value="PENDING">Pending</option>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                            <option value="REJECTED">Rejected</option>
                          </select>
                        </FormControl>
                        <FormDescription>
                          Changing status will affect agency's ability to manage packages and bookings.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter agency address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter agency description" 
                            className="min-h-32"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="md:col-span-2">
                    <Label htmlFor="logo">Agency Logo</Label>
                    <div className="mt-2 flex items-center gap-4">
                      {logoPreview ? (
                        <div className="relative w-24 h-24">
                          <img 
                            src={logoPreview} 
                            alt="Logo preview" 
                            className="w-24 h-24 object-cover rounded-md border" 
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 rounded-full p-1 h-6 w-6"
                            onClick={() => {
                              setLogoFile(null);
                              setLogoPreview(null);
                            }}
                          >
                            &times;
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 w-full relative overflow-hidden">
                          <UploadCloud className="w-10 h-10 mb-2" />
                          <p className="text-sm">Click to upload or drag and drop</p>
                          <p className="text-xs">SVG, PNG, JPG (max. 2MB)</p>
                          <input
                            id="logo"
                            type="file"
                            accept="image/jpeg,image/png,image/svg+xml"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleLogoChange}
                          />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Leave this empty to keep the current logo.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate(`/admin/agencies/${id}`)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
} 