import { InviteList } from '../../components/dashboard/InviteList';
import { InviteUserForm } from '../../components/dashboard/InviteUserForm';
import { useSelector } from 'react-redux';
import { RootState } from '../../lib/store';

export default function InvitesPage() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Manage Invitations</h1>
        <p className="text-gray-500">
          Invite new users to join your agency or manage existing invitations.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Invite New User</h2>
          <InviteUserForm
            userRole={user?.role || 'CUSTOMER'} // Default to a valid role
            agencyId={user?.agencyId}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Pending Invitations</h2>
          <InviteList />
        </div>
      </div>
    </div>
  );
}