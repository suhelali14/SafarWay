import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { inviteUserSchema } from '../../lib/validations/invite';
import { createInvite } from '../../lib/store/slices/inviteSlice';
import { RootState, AppDispatch } from '../../lib/store';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../ui/use-toast';
import { Loader2 } from 'lucide-react';

type InviteUserFormData = {
  email: string;
  role: 'AGENCY_ADMIN' | 'AGENCY_USER';
  agencyId?: string;
};

interface InviteUserFormProps {
  userRole: 'SAFARWAY_ADMIN' | 'SAFARWAY_USER' | 'AGENCY_ADMIN' | 'AGENCY_USER' | 'CUSTOMER';
  agencyId?: string;
  onSuccess?: () => void;
}

export function InviteUserForm({ userRole, agencyId, onSuccess }: InviteUserFormProps) {
  const dispatch: AppDispatch = useDispatch();
  const { toast } = useToast();
  const { loading } = useSelector((state: RootState) => state.invite);
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<InviteUserFormData>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: '',
      role: 'AGENCY_USER',
      agencyId: agencyId,
    },
  });

  const onSubmit = async (data: InviteUserFormData) => {
    try {
      await dispatch(createInvite(data)).unwrap();
      toast({
        title: 'Success',
        description: 'Invitation sent successfully',
      });
      reset();
      setIsOpen(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error || 'Failed to send invitation',
        variant: 'destructive',
      });
    }
  };

  const handleRoleChange = (value: string) => {
    setValue('role', value as 'AGENCY_ADMIN' | 'AGENCY_USER');
  };

  // Determine which roles can be invited based on the current user's role
  const getAvailableRoles = () => {
    switch (userRole) {
      case 'SAFARWAY_ADMIN':
        return ['AGENCY_ADMIN', 'AGENCY_USER'];
      case 'SAFARWAY_USER':
        return ['AGENCY_ADMIN', 'AGENCY_USER'];
      case 'AGENCY_ADMIN':
        return ['AGENCY_ADMIN', 'AGENCY_USER'];
      case 'AGENCY_USER':
        return ['AGENCY_USER'];
      default:
        return ['AGENCY_USER'];
    }
  };

  const availableRoles = getAvailableRoles();

  return (
    <div className="space-y-4">
      <Button onClick={() => setIsOpen(!isOpen)} variant="outline">
        {isOpen ? 'Cancel' : 'Invite User'}
      </Button>

      {isOpen && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-md">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select onValueChange={handleRoleChange} defaultValue="AGENCY_USER">
              <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.includes('AGENCY_ADMIN') && (
                  <SelectItem value="AGENCY_ADMIN">Agency Admin</SelectItem>
                )}
                {availableRoles.includes('AGENCY_USER') && (
                  <SelectItem value="AGENCY_USER">Agency User</SelectItem>
                )}
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Invitation...
              </>
            ) : (
              'Send Invitation'
            )}
          </Button>
        </form>
      )}
    </div>
  );
}