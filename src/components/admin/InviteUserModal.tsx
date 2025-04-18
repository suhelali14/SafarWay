import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Spinner } from '../ui/spinner';
import { Alert, AlertDescription } from '../ui/alert';
import toast from 'react-hot-toast';
import { inviteAPI } from '../../services/api/inviteAPI';
import { adminAPI } from '../../services/api/adminAPI';

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

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedAgencyId?: string;
  onSuccess?: () => void;
}

export function InviteUserModal({ 
  isOpen, 
  onClose, 
  preSelectedAgencyId,
  onSuccess 
}: InviteUserModalProps) {
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

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      form.reset({
        email: '',
        role: 'AGENCY_USER',
        agencyId: preSelectedAgencyId || undefined,
      });
    }
  }, [isOpen, preSelectedAgencyId, form]);

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

    if (isOpen && isAgencyRole) {
      fetchAgencies();
    }
  }, [isOpen, isAgencyRole]);

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
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Close the modal
      onClose();
    } catch (err: any) {
      console.error('Error sending invitation:', err);
      setError(err.response?.data?.message || 'Failed to send invitation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Invite New User"
      className="max-w-lg"
    >
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
          
          <div className="flex justify-end pt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="mr-2"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" /> Sending...
                </>
              ) : (
                <>Send Invitation</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
} 