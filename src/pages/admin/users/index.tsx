import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../components/ui/dropdown-menu';
import { DataTable } from '../../../components/ui/data-table';
import { Spinner } from '../../../components/ui/spinner';
import { UserPlus, MoreVertical, Mail, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../../services/api/adminAPI';
import { inviteAPI } from '../../../services/api/inviteAPI';
import { InviteUserModal } from '../../../components/admin/InviteUserModal';
import type { ColumnDef } from '@tanstack/react-table';

// Define user type
interface User {
  id: string;
  name: string;
  email: string;
  role: 'SAFARWAY_ADMIN' | 'SAFARWAY_USER' | 'AGENCY_ADMIN' | 'AGENCY_USER' | 'CUSTOMER';
  status: 'ACTIVE' | 'INACTIVE' | 'INVITED' | 'SUSPENDED';
  agencyId?: string;
  agencyName?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export default function UsersPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedAgencyId = searchParams.get('agencyId');
  
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [_searchTerm, _setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  
  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Fetch all active users
        const usersResponse = await adminAPI.getUsers({ status: 'ACTIVE' });
        setActiveUsers(usersResponse.data);
        
        // Fetch pending invitations
        const pendingUsers = await inviteAPI.getPendingInvitations();

        setPendingInvitations(pendingUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again.');
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  // Format role for display
  const formatRole = (role: string) => {
    return role.replace('_', ' ').replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Handle user status change
  const handleStatusChange = async (_userId: string, newStatus: string) => {
    try {
      // Logic for updating user status
      toast.success(`User status updated to ${newStatus}`);
      
      // Refresh the user list
      const usersResponse = await adminAPI.getUsers({ status: 'ACTIVE' });
      setActiveUsers(usersResponse.data);
    } catch (err) {
      console.error('Error updating user status:', err);
      toast.error('Failed to update user status');
    }
  };
  
  // Handle resend invitation
  const handleResendInvite = async (userId: string) => {
    try {
      await inviteAPI.resendInvite(userId);
      toast.success('Invitation resent successfully');
    } catch (err) {
      console.error('Error resending invitation:', err);
      toast.error('Failed to resend invitation');
    }
  };
  
  // Handle revoke invitation
  const handleRevokeInvite = async (userId: string) => {
    try {
      await inviteAPI.revokeInvite(userId);
      toast.success('Invitation revoked successfully');
      
      // Remove the invitation from the list
      setPendingInvitations(pendingInvitations.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Error revoking invitation:', err);
      toast.error('Failed to revoke invitation');
    }
  };

  // Refresh user data after successful invitation
  const handleInviteSuccess = async () => {
    try {
      // Fetch pending invitations
      const pendingUsers = await inviteAPI.getPendingInvitations();
      setPendingInvitations(pendingUsers);
      
      // Switch to invitations tab
      setActiveTab('invitations');
    } catch (err) {
      console.error('Error refreshing invitations:', err);
    }
  };

  // Define active users columns
  const userColumns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
            {row.original.name?.charAt(0).toUpperCase() || row.original.email.charAt(0).toUpperCase()}
          </div>
          <span className="ml-3 font-medium">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <Badge className={
          row.original.role.includes('ADMIN') ? 'bg-blue-100 text-blue-800' :
          row.original.role.includes('USER') ? 'bg-indigo-100 text-indigo-800' :
          'bg-gray-100 text-gray-800'
        }
        label= {formatRole(row.original.role)}
        >
         
        </Badge>
      ),
    },
    {
      accessorKey: 'agencyName',
      header: 'Agency',
      cell: ({ row }) => row.original.agencyName || '-',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge className={
          row.original.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
          row.original.status === 'INACTIVE' ? 'bg-yellow-100 text-yellow-800' :
          row.original.status === 'SUSPENDED' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }
          label={row.original.status}
        >
          
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/admin/users/${row.original.id}`)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange(row.original.id, 'ACTIVE')}>
              Set Active
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange(row.original.id, 'INACTIVE')}>
              Set Inactive
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange(row.original.id, 'SUSPENDED')}>
              Suspend
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Define pending invitations columns
  const invitationColumns: ColumnDef<User>[] = [
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <Badge className={
          row.original.role.includes('ADMIN') ? 'bg-blue-100 text-blue-800' :
          row.original.role.includes('USER') ? 'bg-indigo-100 text-indigo-800' :
          'bg-gray-100 text-gray-800'
        }
        label= {formatRole(row.original.role)}
        >
         
        </Badge>
      ),
    },
    {
      accessorKey: 'agencyName',
      header: 'Agency',
      cell: ({ row }) => row.original.agencyName || '-',
    },
    {
      accessorKey: 'createdAt',
      header: 'Sent',
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={() => handleResendInvite(row.original.id)}>
            <Mail className="h-3.5 w-3.5 mr-1" />
            Resend
          </Button>
          <Button size="sm" variant="ghost" onClick={() => handleRevokeInvite(row.original.id)}>
            Revoke
          </Button>
        </div>
      ),
    },
  ];
  console.log(pendingInvitations, 'pendingInvitations');
  return (
    <>
      <Helmet>
        <title>Users Management | SafarWay Admin</title>
      </Helmet>
      
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Users Management</h1>
          <Button onClick={() => setIsInviteModalOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Invite User
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="users">
              Active Users
            </TabsTrigger>
            <TabsTrigger value="invitations">
              Pending Invitations
              {pendingInvitations.length > 0 && (
                <Badge className="ml-2 bg-blue-100 text-blue-800" label={`${pendingInvitations.length}`} ></Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Active Users</CardTitle>
                    <CardDescription>
                      Manage all active users in the system.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <Spinner size="lg" />
                  </div>
                ) : error ? (
                  <div className="text-center p-6 bg-red-50 rounded-lg">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button variant="outline" onClick={() => window.location.reload()}>
                      Retry
                    </Button>
                  </div>
                ) : (
                  <DataTable
                    columns={userColumns}
                    data={activeUsers}
                    searchPlaceholder="Search users by name, email, or role..."
                    searchKey="email"
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="invitations">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Pending Invitations</CardTitle>
                    <CardDescription>
                      Manage pending invitations that have not been accepted yet.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <Spinner size="lg" />
                  </div>
                ) : (
                  pendingInvitations.length > 0 ? (
                    <DataTable
                      columns={invitationColumns}
                      data={pendingInvitations}
                      searchPlaceholder="Search invitations by email or role..."
                      searchKey="email"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-md">
                      <Clock className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-gray-500 mb-4">No pending invitations found.</p>
                      <Button onClick={() => setIsInviteModalOpen(true)}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Invite New User
                      </Button>
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Invite User Modal */}
      <InviteUserModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        preSelectedAgencyId={preSelectedAgencyId || undefined}
        onSuccess={handleInviteSuccess}
      />
    </>
  );
} 