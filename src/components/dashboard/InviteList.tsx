import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getInvites, cancelInvite } from '../../lib/store/slices/inviteSlice';
import { RootState } from '../../lib/store';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import { Loader2, X } from 'lucide-react';

export function InviteList() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { loading, invites, error } = useSelector((state: RootState) => state.invite);

  useEffect(() => {
    dispatch(getInvites());
  }, [dispatch]);

  const handleCancelInvite = async (inviteId: string) => {
    try {
      await dispatch(cancelInvite(inviteId)).unwrap();
      toast({
        title: 'Success',
        description: 'Invitation cancelled successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error || 'Failed to cancel invitation',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>{error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => dispatch(getInvites())}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (invites.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No pending invitations</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {invites.map((invite) => (
        <div
          key={invite.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
        >
          <div>
            <p className="font-medium">{invite.email}</p>
            <p className="text-sm text-gray-500">
              Role: {invite.role}
              {invite.agencyId && ` • Agency ID: ${invite.agencyId}`}
            </p>
            <p className="text-sm text-gray-500">
              Invited: {new Date(invite.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleCancelInvite(invite.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      ))}
    </div>
  );
} 