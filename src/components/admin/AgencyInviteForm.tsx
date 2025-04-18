import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Form } from '../ui/form';
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
      
      const response = await api.post('/admin/agencies/invite', {
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
      <Card.Header>
        <Card.Title>Invite New Agency</Card.Title>
        <Card.Description>
          Send an invitation to an agency to join the platform
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Agency Email</Label>
              <Form.Field
                control={form.control}
                name="email"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Control>
                      <Input
                        id="email"
                        placeholder="agency@example.com"
                        {...field}
                      />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Form.Field
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Control>
                      <Input
                        id="companyName"
                        placeholder="Travel Agency LLC"
                        {...field}
                      />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Form.Field
                control={form.control}
                name="role"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Control>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <Select.Trigger id="role" className="w-full">
                          <Select.Value placeholder="Select a role" />
                        </Select.Trigger>
                        <Select.Content>
                          <Select.Item value="AGENCY_ADMIN">Agency Admin</Select.Item>
                        </Select.Content>
                      </Select>
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
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
        </Form>
      </Card.Content>
    </Card>
  );
} 