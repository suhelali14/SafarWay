import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { ArrowLeft, Building2, Upload } from 'lucide-react';
import { adminAPI } from '../../../services/api';
import toast from 'react-hot-toast';

// Form validation schema
const agencySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500),
  contactEmail: z.string().email('Must be a valid email address'),
  contactPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  status: z.enum(['ACTIVE', 'PENDING', 'INACTIVE']),
});

type AgencyFormValues = z.infer<typeof agencySchema>;

export default function NewAgencyPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  // Initialize the form with react-hook-form
  const form = useForm<AgencyFormValues>({
    resolver: zodResolver(agencySchema),
    defaultValues: {
      name: '',
      description: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
      status: 'PENDING',
    },
  });

  // Handle logo file change
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Basic validation
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Logo file is too large. Maximum size is 5MB.');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('File must be an image.');
        return;
      }
      
      setLogoFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form submission handler
  const onSubmit = async (data: AgencyFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Create FormData for multipart/form-data submission (for the logo)
      const formData = new FormData();
      
      // Add all form fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      // Add logo if available
      if (logoFile) {
        formData.append('logo', logoFile);
      }
      
      // Call the API to create the agency
      const response = await adminAPI.createAgency(formData);
      
      toast.success('Agency created successfully');
      
      // Navigate to the newly created agency's detail page
      navigate(`/admin/agencies/${response.data.id}`);
    } catch (error) {
      console.error('Error creating agency:', error);
      toast.error('Failed to create agency');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Add New Agency | SafarWay Admin</title>
      </Helmet>

      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin/agencies')}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Agencies
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Add New Agency</h1>
            <p className="text-gray-500 mt-1">Create a new travel agency on the platform</p>
          </div>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              Agency Information
            </CardTitle>
            <CardDescription>
              Enter the details for the new travel agency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Agency Name *</Label>
                  <Input 
                    id="name"
                    placeholder="Enter agency name"
                    {...form.register('name')}
                  />
                  {form.formState.errors.name && (
                    <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    defaultValue={form.getValues('status')}
                    onValueChange={(value) => form.setValue('status', value as 'ACTIVE' | 'PENDING' | 'INACTIVE')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.status && (
                    <p className="text-red-500 text-sm">{form.formState.errors.status.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <Input 
                    id="contactEmail"
                    type="email"
                    placeholder="Enter contact email"
                    {...form.register('contactEmail')}
                  />
                  {form.formState.errors.contactEmail && (
                    <p className="text-red-500 text-sm">{form.formState.errors.contactEmail.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone *</Label>
                  <Input 
                    id="contactPhone"
                    placeholder="Enter contact phone"
                    {...form.register('contactPhone')}
                  />
                  {form.formState.errors.contactPhone && (
                    <p className="text-red-500 text-sm">{form.formState.errors.contactPhone.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea 
                  id="address"
                  placeholder="Enter agency address"
                  {...form.register('address')}
                  rows={3}
                />
                {form.formState.errors.address && (
                  <p className="text-red-500 text-sm">{form.formState.errors.address.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea 
                  id="description"
                  placeholder="Enter agency description"
                  {...form.register('description')}
                  rows={5}
                />
                {form.formState.errors.description && (
                  <p className="text-red-500 text-sm">{form.formState.errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Agency Logo</Label>
                <div className="flex items-center gap-4">
                  {logoPreview ? (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border">
                      <img 
                        src={logoPreview} 
                        alt="Logo preview" 
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 w-6 h-6 p-0 rounded-full"
                        onClick={() => {
                          setLogoFile(null);
                          setLogoPreview(null);
                        }}
                      >
                        ✕
                      </Button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 border border-dashed rounded-lg flex items-center justify-center bg-gray-50 text-gray-400">
                      <Building2 className="w-8 h-8" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex flex-col">
                      <Label 
                        htmlFor="logo-upload" 
                        className="cursor-pointer bg-gray-50 hover:bg-gray-100 text-gray-600 py-2 px-4 rounded border inline-flex items-center justify-center transition-colors w-full"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Logo
                      </Label>
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Recommended: 400x400px. Max 5MB. JPG, PNG or GIF.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/agencies')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⟳</span>
                      Creating...
                    </>
                  ) : (
                    'Create Agency'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
} 