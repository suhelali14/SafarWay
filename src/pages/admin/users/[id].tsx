import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Spinner } from '../../../components/ui/spinner';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import { ArrowLeft, MoreVertical, Mail, RefreshCw, Ban, CheckCircle, User, Building, Key, Clock, Calendar } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../components/ui/dropdown-menu';
import toast from 'react-hot-toast';
import { adminAPI } from '../../../services/api/adminAPI';
import { inviteAPI } from '../../../services/api/inviteAPI';

// Define a more detailed User type
interface User {
  id: string;
  name: string;
  email: string;
  role: 'SAFARWAY_ADMIN' | 'SAFARWAY_USER' | 'AGENCY_ADMIN' | 'AGENCY_USER' | 'CUSTOMER';
  status: 'ACTIVE' | 'INACTIVE' | 'INVITED' | 'SUSPENDED';
  agencyId?: string;
  agencyName?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  profileImage?: string;
  invitedAt?: string;
  completedAt?: string;
}

export default function UserDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
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
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Failed to load user details. Please try again.');
        toast.error('Failed to load user details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserDetails();
  }, [id]);
  
  // Handle status change
  const handleStatusChange = async (status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED') => {
    if (!user) return;
    
    try {
      // Logic for updating user status
      // For demo purposes, we're updating the local state immediately
      setUser({ ...user, status });
      toast.success(`User status updated to ${status}`);
    } catch (err) {
      console.error('Error updating user status:', err);
      toast.error('Failed to update user status');
    }
  };
  
  // Handle resend invitation
  const handleResendInvite = async () => {
    if (!user || user.status !== 'INVITED') return;
    
    try {
      await inviteAPI.resendInvite(user.id);
      toast.success('Invitation resent successfully');
    } catch (err) {
      console.error('Error resending invitation:', err);
      toast.error('Failed to resend invitation');
    }
  };
  
  // Format dates for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Format role for display
  const formatRole = (role: string) => {
    return role.replace('_', ' ').replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };
  
  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-100 text-green-800" label={status} ></Badge>;
      case 'INACTIVE':
        return <Badge className="bg-yellow-100 text-yellow-800" label={status}></Badge>;
      case 'SUSPENDED':
        return <Badge className="bg-red-100 text-red-800" label={status}></Badge>;
      case 'INVITED':
        return <Badge className="bg-blue-100 text-blue-800" label={status}></Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800" label={status}></Badge>;
    }
  };
  
  // Get role badge color
  const getRoleBadge = (role: string) => {
    if (role.includes('ADMIN')) {
      return <Badge className="bg-blue-100 text-blue-800" label={formatRole(role)}></Badge>;
    } else if (role.includes('USER')) {
      return <Badge className="bg-indigo-100 text-indigo-800" label={formatRole(role)} ></Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-800" label={formatRole(role)}></Badge>;
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
  
  if (error || !user) {
    return (
      <AdminLayout>
        <div className="container py-6">
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
          
          <Alert variant="destructive">
            <AlertDescription>
              {error || 'User not found'}
            </AlertDescription>
          </Alert>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <Helmet>
        <title>{user.name || user.email} | SafarWay Admin</title>
      </Helmet>
      
      <div className="container py-6">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate('/admin/users')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border border-gray-200">
              {user.profileImage ? (
                <img src={user.profileImage} alt={user.name} />
              ) : (
                <AvatarFallback className="text-xl">
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{user.name || 'No Name'}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline"  label={` ID: ${user.id.substring(0, 8)}`}>
                  
                 
                </Badge>
                {getRoleBadge(user.role)}
                {getStatusBadge(user.status)}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            {user.status === 'INVITED' ? (
              <Button variant="outline" onClick={handleResendInvite}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Resend Invitation
              </Button>
            ) : (
              <>
                {user.status !== 'ACTIVE' && (
                  <Button 
                    variant="default" 
                    onClick={() => handleStatusChange('ACTIVE')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Activate
                  </Button>
                )}
                {user.status !== 'INACTIVE' && (
                  <Button 
                    variant="outline" 
                    onClick={() => handleStatusChange('INACTIVE')}
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Deactivate
                  </Button>
                )}
                {user.status !== 'SUSPENDED' && (
                  <Button 
                    variant="outline" 
                    onClick={() => handleStatusChange('SUSPENDED')}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    Suspend
                  </Button>
                )}
              </>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                >
                  Edit User
                </DropdownMenuItem>
                {user.status === 'INVITED' && (
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => {
                      // Here you'd implement revoking the invitation
                      toast.success('Invitation revoked successfully');
                      navigate('/admin/users');
                    }}
                  >
                    Revoke Invitation
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="flex items-center mt-1">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {user.email}
                    </p>
                  </div>
                  
                  {user.phone && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                      <p className="mt-1">{user.phone}</p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Role</h3>
                    <p className="mt-1">{getRoleBadge(user.role)}</p>
                  </div>
                  
                  {user.agencyId && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Agency</h3>
                      <p className="flex items-center mt-1">
                        <Building className="w-4 h-4 mr-2 text-gray-400" />
                        {user.agencyName || 'Unknown Agency'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Account Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <p className="mt-1">{getStatusBadge(user.status)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Created On</h3>
                    <p className="flex items-center mt-1">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                  
                  {user.lastLoginAt && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Last Login</h3>
                      <p className="flex items-center mt-1">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        {formatDate(user.lastLoginAt)}
                      </p>
                    </div>
                  )}
                  
                  {user.status === 'INVITED' && (
                    <>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Invited On</h3>
                        <p className="mt-1">{formatDate(user.invitedAt)}</p>
                      </div>
                      <div className="rounded-md bg-blue-50 p-4">
                        <p className="text-sm text-blue-700">
                          This user has been invited but has not yet completed their registration.
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>
                  View the user's recent activity and login history.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-gray-500 mb-4">
                    Activity tracking is not available in this demo.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Bookings</CardTitle>
                <CardDescription>
                  View all bookings made by this user.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-gray-500 mb-4">
                    No bookings found for this user.
                  </p>
                  <Button variant="outline">
                    View All Bookings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
} 