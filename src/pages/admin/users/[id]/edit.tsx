import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AdminLayout } from '../../../../layouts/AdminLayout';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../../../../components/ui/form';
import { Spinner } from '../../../../components/ui/spinner';
import { Alert, AlertDescription } from '../../../../components/ui/alert';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../../../services/api/adminAPI';

// Define form schema
const userFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().optional(),
  role: z.enum(['SAFARWAY_ADMIN', 'SAFARWAY_USER', 'AGENCY_ADMIN', 'AGENCY_USER', 'CUSTOMER'], {
    required_error: 'Please select a role.',
  }),
  agencyId: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED'], {
    required_error: 'Please select a status.',
  }),
});

// Define a User type
interface User {
  id: string;
  name: string;
  email: string;
  role: 'SAFARWAY_ADMIN' | 'SAFARWAY_USER' | 'AGENCY_ADMIN' | 'AGENCY_USER' | 'CUSTOMER';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'INVITED';
  agencyId?: string;
  agencyName?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

interface Agency {
  id: string;
  name: string;
}

export default function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [user, setUser] = useState<User | null>(null);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingAgencies, setLoadingAgencies] = useState(true);
  
  // Initialize form
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: 'AGENCY_USER',
      agencyId: '',
      status: 'ACTIVE',
    },
  });
  
  // Role selection state for conditionally showing agency selection
  const selectedRole = form.watch('role');
  
  // Check if role is agency-related
  const isAgencyRole = ['AGENCY_ADMIN', 'AGENCY_USER'].includes(selectedRole);
  
  // Fetch user data
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!id) {
        setError('User ID is required');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const userData = await adminAPI.getUser(id);
        setUser(userData);
        
        // Pre-populate form with user data
        form.reset({
          name: userData.name || '',
          email: userData.email,
          phone: userData.phone || '',
          role: userData.role,
          agencyId: userData.agencyId || '',
          status: userData.status === 'INVITED' ? 'INACTIVE' : userData.status,
        });
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Failed to load user details. Please try again.');
        toast.error('Failed to load user details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserDetails();
  }, [id, form]);
  
  // Fetch agencies for dropdown
  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        setLoadingAgencies(true);
        const agenciesList = await adminAPI.getAllAgenciesList();
        setAgencies(agenciesList);
      } catch (err) {
        console.error('Error fetching agencies:', err);
        toast.error('Failed to load agencies');
      } finally {
        setLoadingAgencies(false);
      }
    };
    
    if (isAgencyRole) {
      fetchAgencies();
    }
  }, [isAgencyRole]);
  
  // Handle form submission
  const onSubmit = async (values: z.infer<typeof userFormSchema>) => {
    if (!id) return;
    
    setSubmitting(true);
    setError(null);
    
    try {
      // Format data for API
      const userData = {
        ...values,
        agencyId: isAgencyRole ? values.agencyId : null,
      };
      
      await adminAPI.updateUser(id, userData);
      
      toast.success('User updated successfully');
      navigate(`/admin/users/${id}`);
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user. Please try again.');
      toast.error('Failed to update user');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <AdminLayout>
        <div className="container py-6">
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  if (error && !user) {
    return (
      <AdminLayout>
        <div className="container py-6">
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <Alert variant="destructive">
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <Helmet>
        <title>Edit User | SafarWay Admin</title>
      </Helmet>
      
      <div className="container py-6">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate(`/admin/users/${id}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to User Details
        </Button>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Edit User</CardTitle>
            <CardDescription>
              Update the information for this user.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          disabled={submitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="user@example.com"
                          {...field}
                          disabled={true} // Email should not be editable
                        />
                      </FormControl>
                      <FormDescription>
                        Email address cannot be changed.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+1 234 567 8900"
                          {...field}
                          value={field.value || ''}
                          disabled={submitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={submitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SAFARWAY_ADMIN">SafarWay Admin</SelectItem>
                          <SelectItem value="SAFARWAY_USER">SafarWay Staff</SelectItem>
                          <SelectItem value="AGENCY_ADMIN">Agency Admin</SelectItem>
                          <SelectItem value="AGENCY_USER">Agency User</SelectItem>
                          <SelectItem value="CUSTOMER">Customer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The role determines what the user can access in the system.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {isAgencyRole && (
                  <FormField
                    control={form.control}
                    name="agencyId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Agency</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={submitting || loadingAgencies}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={loadingAgencies ? "Loading agencies..." : "Select an agency"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {agencies.map((agency) => (
                              <SelectItem key={agency.id} value={agency.id}>
                                {agency.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The agency this user will be associated with.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={submitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="INACTIVE">Inactive</SelectItem>
                          <SelectItem value="SUSPENDED">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Controls whether the user can log in and access the system.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="mr-2"
                    onClick={() => navigate(`/admin/users/${id}`)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Spinner size="sm" className="mr-2" /> Saving...
                      </>
                    ) : (
                      <>Save Changes</>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
} 