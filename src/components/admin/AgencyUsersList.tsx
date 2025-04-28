import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Spinner } from '../ui/spinner';

import { InviteUserModal } from './InviteUserModal';

type UserType = {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'AGENT';
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE';
  createdAt: string;
  lastLoginAt: string | null;
};

type AgencyUsersListProps = {
  agencyId: string;
};

export function AgencyUsersList({ agencyId }: AgencyUsersListProps) {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Define fetchUsers as useCallback to be able to reference it later
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Mock data for development purposes
      const mockUsers: UserType[] = [
        {
          id: "user1",
          name: "John Doe",
          email: "john@example.com",
          role: "ADMIN",
          status: "ACTIVE",
          createdAt: "2023-01-15T08:30:00Z",
          lastLoginAt: "2023-06-22T14:45:00Z"
        },
        {
          id: "user2",
          name: "Jane Smith",
          email: "jane@example.com",
          role: "MANAGER",
          status: "ACTIVE",
          createdAt: "2023-02-10T10:15:00Z",
          lastLoginAt: "2023-06-21T09:30:00Z"
        }
      ];
      
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      
      // Uncomment this when API is ready
      // const response = await adminAPI.getUsers();
      // setUsers(response.data.users);
      // setFilteredUsers(response.data.users);
    } catch (err) {
      console.error('Error fetching agency users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [agencyId]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
      return;
    }

    const lowercaseQuery = searchQuery.toLowerCase();
    const filtered = users.filter(
      user =>
        user.name.toLowerCase().includes(lowercaseQuery) ||
        user.email.toLowerCase().includes(lowercaseQuery) ||
        user.role.toLowerCase().includes(lowercaseQuery)
    );
    
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Status badge color mapping
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'INACTIVE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Role badge color mapping
  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800';
      case 'MANAGER':
        return 'bg-purple-100 text-purple-800';
      case 'AGENT':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle successful invite
  const handleInviteSuccess = () => {
    // Refresh users list after successful invite
    fetchUsers();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-red-50 rounded-lg">
        <p className="text-red-600 mb-4">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Agency Users
            </CardTitle>
            <CardDescription>
              {users.length > 0
                ? `${users.length} users in this agency`
                : 'No users found for this agency'}
            </CardDescription>
          </div>
          <Button onClick={() => setIsInviteModalOpen(true)}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Invite User
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name, email, or role..."
            className="pl-10"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {filteredUsers.length > 0 ? (
          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="ml-3 font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm">{user.email}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge className={getRoleBadgeClass(user.role)} variant="outline" label={user.role} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge className={getStatusBadgeClass(user.status)} label={user.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm">{formatDate(user.lastLoginAt)}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/admin/users/${user.id}`)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-md">
            {searchQuery ? (
              <>
                <Search className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-gray-500 mb-4">No users match your search query.</p>
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </Button>
              </>
            ) : (
              <>
                <Users className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-gray-500 mb-4">This agency doesn't have any users yet.</p>
                <Button onClick={() => setIsInviteModalOpen(true)}>
                  Invite First User
                </Button>
              </>
            )}
          </div>
        )}
      </CardContent>
      {filteredUsers.length > 0 && (
        <CardFooter>
          <Button 
            variant="outline" 
            onClick={() => navigate(`/admin/users?agencyId=${agencyId}`)}
            className="w-full"
          >
            Manage All Users
          </Button>
        </CardFooter>
      )}

      {/* Invite User Modal */}
      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        preSelectedAgencyId={agencyId}
        onSuccess={handleInviteSuccess}
      />
    </Card>
  );
} 