import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { Loader2, Upload, Building,Info } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { Textarea } from '../../components/ui/textarea';
import { Separator } from '../../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Label } from '../../components/ui/label';
import { Skeleton } from '../../components/ui/skeleton';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { api } from '../../services/api';

// Form schema for agency profile
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Agency name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(6, {
    message: "Phone number must be at least 6 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  country: z.string().min(2, {
    message: "Country must be at least 2 characters.",
  }),
  website: z.string().url({
    message: "Please enter a valid website URL."
  }).optional().or(z.literal('')),
  license: z.string().min(3, {
    message: "License number must be at least 3 characters."
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Mock agency data - replace with actual API call
const mockAgencyData = {
  id: 'agency-123',
  name: 'Adventure Travel Co.',
  description: 'We specialize in adventure travel and unique experiences around the world. Our team of experts will help you find the perfect trip for your interests and abilities.',
  email: 'info@adventuretravelco.com',
  phone: '+1 (555) 123-4567',
  address: '123 Travel Avenue',
  city: 'Adventure City',
  country: 'United States',
  website: 'https://www.adventuretravelco.com',
  license: 'TL-12345-A',
  logo: 'https://randomuser.me/api/portraits/men/32.jpg',
  coverImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
  status: 'approved',
  createdAt: '2022-05-15T14:30:00Z',
  verificationDocuments: [
    { id: 'doc-1', name: 'Business License', url: '#' },
    { id: 'doc-2', name: 'Tourism Authority Certificate', url: '#' }
  ]
};

const AgencyProfilePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [agency, setAgency] = useState<any>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  
  // Initialize form with agency data
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      description: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      website: '',
      license: '',
    },
  });

  useEffect(() => {
    const fetchAgencyProfile = async () => {
      try {
        setIsLoading(true);
        // Uncomment when API is ready:
        // const response = await api.agency.getProfile();
        // const agencyData = response.data;
        
        // Using mock data for now
        setTimeout(() => {
          setAgency(mockAgencyData);
          form.reset({
            name: mockAgencyData.name,
            description: mockAgencyData.description,
            email: mockAgencyData.email,
            phone: mockAgencyData.phone,
            address: mockAgencyData.address,
            city: mockAgencyData.city,
            country: mockAgencyData.country,
            website: mockAgencyData.website,
            license: mockAgencyData.license,
          });
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching agency profile:', error);
        toast.error('Failed to load profile information');
        setIsLoading(false);
      }
    };

    fetchAgencyProfile();
  }, [form]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsSaving(true);
      
      // Create FormData for file uploads
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      if (logoFile) {
        formData.append('logo', logoFile);
      }
      
      if (coverFile) {
        formData.append('coverImage', coverFile);
      }
      
      // Uncomment when API is ready:
      // await api.agency.updateProfile(formData);
      
      // Simulate API call
      setTimeout(() => {
        setIsSaving(false);
        toast.success('Profile updated successfully');
      }, 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Helmet>
          <title>Agency Profile | SafarWay</title>
        </Helmet>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-28" />
          </div>
          <Skeleton className="h-[200px] w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-[400px]" />
            <Skeleton className="h-[400px] lg:col-span-2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Agency Profile | SafarWay</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Agency Profile</h1>
            <p className="text-gray-500">Manage your agency information and settings</p>
          </div>
          
          <Badge variant={agency.status === 'approved' ? 'success' : 'warning'}>
            {agency.status === 'approved' ? 'Approved' : 'Pending Approval'}
          </Badge>
        </div>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General Information</TabsTrigger>
            <TabsTrigger value="documents">Verification Documents</TabsTrigger>
            <TabsTrigger value="settings">Account Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Agency Branding</CardTitle>
                  <CardDescription>Update your agency logo and cover image</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Logo</Label>
                    <div className="flex flex-col items-center gap-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage 
                          src={logoPreview || agency.logo} 
                          alt={agency.name} 
                        />
                        <AvatarFallback>{agency.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="grid w-full max-w-xs">
                        <Label htmlFor="logo-upload" className="cursor-pointer text-center py-2 px-4 border border-dashed rounded-md hover:bg-gray-50 flex flex-col items-center gap-1">
                          <Upload className="h-4 w-4" />
                          <span>Upload Logo</span>
                          <Input 
                            id="logo-upload" 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleLogoChange}
                          />
                        </Label>
                        <p className="text-xs text-gray-500 mt-1 text-center">
                          Recommended: 300x300px, PNG or JPG
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label>Cover Image</Label>
                    <div className="flex flex-col gap-4">
                      <div className="bg-gray-100 rounded-md overflow-hidden h-40 relative">
                        {(coverPreview || agency.coverImage) ? (
                          <img 
                            src={coverPreview || agency.coverImage} 
                            alt="Cover" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">No cover image</p>
                          </div>
                        )}
                      </div>
                      <div className="grid w-full">
                        <Label htmlFor="cover-upload" className="cursor-pointer text-center py-2 px-4 border border-dashed rounded-md hover:bg-gray-50 flex flex-col items-center gap-1">
                          <Upload className="h-4 w-4" />
                          <span>Upload Cover Image</span>
                          <Input 
                            id="cover-upload" 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleCoverChange}
                          />
                        </Label>
                        <p className="text-xs text-gray-500 mt-1 text-center">
                          Recommended: 1200x400px, PNG or JPG
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Agency Information</CardTitle>
                  <CardDescription>Update your agency details</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form id="profile-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Agency Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter agency name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe your agency and services" 
                                className="resize-none min-h-[120px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              This will be displayed on your agency profile and listings
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Email</FormLabel>
                              <FormControl>
                                <Input placeholder="contact@agency.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Phone</FormLabel>
                              <FormControl>
                                <Input placeholder="+1 (123) 456-7890" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter street address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="City" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Input placeholder="Country" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Website</FormLabel>
                              <FormControl>
                                <Input placeholder="https://www.agency.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="license"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>License Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter travel license number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    type="submit"
                    form="profile-form"
                    disabled={isSaving}
                  >
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Verification Documents</CardTitle>
                <CardDescription>
                  Upload and manage your agency verification documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="mb-6">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    All agencies must provide verification documents to offer services on SafarWay.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Uploaded Documents</h3>
                  
                  {agency.verificationDocuments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {agency.verificationDocuments.map((doc: any) => (
                        <div 
                          key={doc.id} 
                          className="border rounded-lg p-4 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <Building className="h-6 w-6 text-gray-400" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-sm text-gray-500">Uploaded on {new Date().toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">View</Button>
                            <Button variant="outline" size="sm">Replace</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center bg-gray-50 py-8 rounded-lg">
                      <p className="text-gray-500">No documents uploaded yet</p>
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Upload New Document</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="document-name">Document Type</Label>
                        <Input 
                          id="document-name" 
                          placeholder="e.g. Business License, Insurance Certificate" 
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="document-upload">Document File</Label>
                        <div className="mt-1">
                          <Label 
                            htmlFor="document-upload" 
                            className="cursor-pointer block border border-dashed rounded-md p-4 text-center hover:bg-gray-50"
                          >
                            <Upload className="h-6 w-6 mx-auto text-gray-400" />
                            <span className="mt-2 block">Click to upload a file</span>
                            <span className="mt-1 block text-xs text-gray-500">
                              PDF, JPG, or PNG file (Max 5MB)
                            </span>
                            <Input 
                              id="document-upload" 
                              type="file" 
                              accept=".pdf,.jpg,.jpeg,.png" 
                              className="hidden" 
                            />
                          </Label>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button>Upload Document</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Email Notifications</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-bookings" className="flex-1">Booking Notifications</Label>
                      <Input 
                        id="notify-bookings" 
                        type="checkbox" 
                        className="h-4 w-4"
                        defaultChecked 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-messages" className="flex-1">Message Notifications</Label>
                      <Input 
                        id="notify-messages" 
                        type="checkbox" 
                        className="h-4 w-4"
                        defaultChecked 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-marketing" className="flex-1">Marketing Updates</Label>
                      <Input 
                        id="notify-marketing" 
                        type="checkbox" 
                        className="h-4 w-4"
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">Agency Visibility</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Public Profile</p>
                      <p className="text-sm text-gray-500">Make your agency visible to customers</p>
                    </div>
                    <Input 
                      id="visibility" 
                      type="checkbox" 
                      className="h-4 w-4"
                      defaultChecked 
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-4">Danger Zone</h3>
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-800 font-medium">Deactivate Agency Account</p>
                    <p className="text-sm text-red-700 mt-1 mb-3">
                      Temporarily deactivate your agency account. Your listings will be hidden, and you won't receive new bookings.
                    </p>
                    <Button variant="destructive" size="sm">Deactivate Account</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AgencyProfilePage; 