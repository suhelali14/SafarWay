import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Label } from '../ui/label';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { api } from '../../lib/services/api';
import { Icons } from '../Icons';

const agencyInviteSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['AGENCY_ADMIN'], {
    required_error: 'Role is required',
  }),
  companyName: z.string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must not exceed 100 characters'),
});

type AgencyInviteFormValues = z.infer<typeof agencyInviteSchema>;

interface AgencyInviteFormProps {
  onSuccess?: () => void;
}

export function AgencyInviteForm({ onSuccess }: AgencyInviteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AgencyInviteFormValues>({
    resolver: zodResolver(agencyInviteSchema),
    defaultValues: {
      email: '',
      role: 'AGENCY_ADMIN',
      companyName: '',
    },
  });

  async function onSubmit(data: AgencyInviteFormValues) {
    try {
      setIsSubmitting(true);

      await api.inviteAgency({
        email: data.email,
        role: data.role,
        companyName: data.companyName,
      });

      toast.success('Agency invitation sent successfully');
      form.reset();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send invitation');
      console.error('Invite error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full">
      <div className="card-header">
        <h2 className="card-title">Invite New Agency</h2>
        <p className="card-description">
          Send an invitation to an agency to join the platform
        </p>
      </div>
      <div className="card-content">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Agency Email</Label>
            <Input
              id="email"
              placeholder="agency@example.com"
              {...form.register('email')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              placeholder="Travel Agency LLC"
              {...form.register('companyName')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              {...form.register('role')}
              defaultValue="AGENCY_ADMIN"
            >
              <option value="AGENCY_ADMIN">Agency Admin</option>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Sending Invitation...
              </>
            ) : (
              <>
                <Icons.send className="mr-2 h-4 w-4" />
                Send Invitation
              </>
            )}
          </Button>
        </form>
      </div>
    </Card>
  );
}