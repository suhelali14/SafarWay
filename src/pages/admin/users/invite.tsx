import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../../../components/ui/form';
import { Spinner } from '../../../components/ui/spinner';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import toast from 'react-hot-toast';
import { inviteAPI } from '../../../services/api/inviteAPI';
import { adminAPI } from '../../../services/api/adminAPI';

// Define form schema for invitation
const inviteFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  role: z.enum(['AGENCY_ADMIN', 'AGENCY_USER', 'SAFARWAY_ADMIN', 'SAFARWAY_USER'], {
    required_error: 'Please select a role.',
  }),
  agencyId: z.string().optional(),
}).refine(data => {
  // If the role is agency-related, agencyId is required
  if (['AGENCY_ADMIN', 'AGENCY_USER'].includes(data.role) && !data.agencyId) {
    return false;
  }
  return true;
}, {
  message: 'Please select an agency for agency roles.',
  path: ['agencyId'],
});

// Extract query param
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function InviteUserPage() {
  const navigate = useNavigate();
  const query = useQuery();
  const preSelectedAgencyId = query.get('agencyId');
  
  const [agencies, setAgencies] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingAgencies, setFetchingAgencies] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize form with zod schema
  const form = useForm<z.infer<typeof inviteFormSchema>>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: '',
      role: 'AGENCY_USER',
      agencyId: preSelectedAgencyId || undefined,
    },
  });

  // Role selection state
  const selectedRole = form.watch('role');
  
  // Check if role is agency-related
  const isAgencyRole = ['AGENCY_ADMIN', 'AGENCY_USER'].includes(selectedRole);

  // Fetch agencies for dropdown
  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        setFetchingAgencies(true);
        const agenciesList = await adminAPI.getAllAgenciesList();
        setAgencies(agenciesList);
      } catch (err) {
        console.error('Error fetching agencies:', err);
        toast.error('Failed to load agencies');
      } finally {
        setFetchingAgencies(false);
      }
    };

    fetchAgencies();
  }, []);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof inviteFormSchema>) => {
    setLoading(true);
    setError(null);
    
    try {
      // Prepare data for API call
      const inviteData = {
        email: values.email,
        role: values.role,
        agencyId: isAgencyRole ? values.agencyId : undefined
      };
      
      // Send invitation
      await inviteAPI.sendInvite(inviteData);
      
      toast.success('Invitation sent successfully!');
      navigate('/admin/users');
    } catch (err: any) {
      console.error('Error sending invitation:', err);
      setError(err.response?.data?.message || 'Failed to send invitation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Invite User | SafarWay Admin</title>
      </Helmet>
      
      <div className="container py-6">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Invite New User</CardTitle>
            <CardDescription>
              Send an invitation to a new user. They'll receive an email with instructions to complete their registration.
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="user@example.com"
                          {...field}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormDescription>
                        The invitation will be sent to this email address.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={loading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="AGENCY_ADMIN">Agency Admin</SelectItem>
                          <SelectItem value="AGENCY_USER">Agency User</SelectItem>
                          <SelectItem value="SAFARWAY_ADMIN">SafarWay Admin</SelectItem>
                          <SelectItem value="SAFARWAY_USER">SafarWay Staff</SelectItem>
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
                          disabled={loading || fetchingAgencies}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={fetchingAgencies ? "Loading agencies..." : "Select an agency"} />
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
                
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="mr-2"
                    onClick={() => navigate(-1)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner size="sm" className="mr-2" /> Sending Invitation...
                      </>
                    ) : (
                      <>Send Invitation</>
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