import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';

import { Icons } from '../../../components/Icons';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { formatDate, formatCurrency } from '../../../lib/utils';
import { DataTable } from '../../../components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';
import axios from '../../../lib/axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  createdAt: string;
}

interface Package {
  id: string;
  name: string;
  destination: string;
  price: number;
  duration: number;
  status: string;
  createdAt: string;
  bookingsCount: number;
}

interface Booking {
  id: string;
  packageName: string;
  customerName: string;
  status: string;
  totalAmount: number;
  createdAt: string;
}

interface Agency {
  id: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  logo?: string;
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  users: User[];
  packages: Package[];
  bookings: Booking[];
  stats: {
    totalPackages: number;
    totalBookings: number;
    totalRevenue: number;
    pendingBookings: number;
  };
}

export default function AgencyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [agency, setAgency] = useState<Agency | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchAgencyDetails(id);
    }
  }, [id]);

  const fetchAgencyDetails = async (agencyId: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/admin/agencies/${agencyId}`);
      setAgency(response.data.agency);
    } catch (error) {
      toast.error('Failed to fetch agency details');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED') => {
    if (!agency) return;
    
    try {
      await axios.patch(`/admin/agencies/${agency.id}/status`, { status });
      setAgency({ ...agency, status });
      toast.success(`Agency status updated to ${status.toLowerCase()}`);
    } catch (error) {
      toast.error('Failed to update agency status');
      console.error(error);
    }
  };

  const packageColumns: ColumnDef<Package>[] = [
    {
      accessorKey: 'name',
      header: 'Package Name',
    },
    {
      accessorKey: 'destination',
      header: 'Destination',
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => formatCurrency(row.getValue('price')),
    },
    {
      accessorKey: 'duration',
      header: 'Duration',
      cell: ({ row }) => `${row.getValue('duration')} days`,
    },
    {
      accessorKey: 'bookingsCount',
      header: 'Bookings',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const statusMap: Record<string, { label: string, variant: 'default' | 'outline' | 'secondary' | 'destructive' | 'success' }> = {
          PUBLISHED: { label: 'Published', variant: 'success' },
          DRAFT: { label: 'Draft', variant: 'secondary' },
          ARCHIVED: { label: 'Archived', variant: 'outline' },
        };
        
        const badgeInfo = statusMap[status] || { label: status, variant: 'default' };
        
        return (
          <Badge variant={badgeInfo.variant}>
            {badgeInfo.label}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const pkg = row.original;
        return (
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/admin/packages/${pkg.id}`}>
              <Icons.view className="h-4 w-4 mr-1" />
              View
            </Link>
          </Button>
        );
      },
    },
  ];

  const bookingColumns: ColumnDef<Booking>[] = [
    {
      accessorKey: 'packageName',
      header: 'Package',
    },
    {
      accessorKey: 'customerName',
      header: 'Customer',
    },
    {
      accessorKey: 'totalAmount',
      header: 'Amount',
      cell: ({ row }) => formatCurrency(row.getValue('totalAmount')),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const statusMap: Record<string, { label: string, variant: 'default' | 'outline' | 'secondary' | 'destructive' | 'success' }> = {
          CONFIRMED: { label: 'Confirmed', variant: 'success' },
          PENDING: { label: 'Pending', variant: 'secondary' },
          CANCELLED: { label: 'Cancelled', variant: 'destructive' },
          COMPLETED: { label: 'Completed', variant: 'default' },
        };
        
        const badgeInfo = statusMap[status] || { label: status, variant: 'default' };
        
        return (
          <Badge variant={badgeInfo.variant}>
            {badgeInfo.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Booked On',
      cell: ({ row }) => formatDate(row.getValue('createdAt')),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/admin/bookings/${booking.id}`}>
              <Icons.view className="h-4 w-4 mr-1" />
              View
            </Link>
          </Button>
        );
      },
    },
  ];

  const userColumns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.getValue('role') as string;
        return <Badge variant="outline">{role}</Badge>;
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Member Since',
      cell: ({ row }) => formatDate(row.getValue('createdAt')),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/admin/users/${user.id}`}>
              <Icons.view className="h-4 w-4 mr-1" />
              View
            </Link>
          </Button>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground">Loading agency details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!agency) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <Icons.warning className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Agency Not Found</h2>
          <p className="text-muted-foreground mb-6">The agency you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button asChild>
            <Link to="/admin/agencies">
              <Icons.arrowLeft className="mr-2 h-4 w-4" />
              Back to Agencies
            </Link>
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <Helmet>
        <title>{agency.name} - Agency Details | SafarWay Admin</title>
      </Helmet>
      
      <AdminLayout>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/agencies">
                <Icons.arrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">{agency.name}</h1>
            <Badge variant={
              agency.status === 'ACTIVE' ? 'success' : 
              agency.status === 'PENDING' ? 'secondary' : 
              agency.status === 'SUSPENDED' ? 'destructive' : 'outline'
            }>
              {agency.status}
            </Badge>
          </div>
          
          <div className="flex gap-2">
            {agency.status === 'ACTIVE' && (
              <Button 
                variant="outline" 
                onClick={() => handleStatusChange('SUSPENDED')}
              >
                <Icons.ban className="mr-2 h-4 w-4" />
                Suspend Agency
              </Button>
            )}
            
            {agency.status === 'SUSPENDED' && (
              <Button 
                variant="outline" 
                onClick={() => handleStatusChange('ACTIVE')}
              >
                <Icons.check className="mr-2 h-4 w-4" />
                Activate Agency
              </Button>
            )}
            
            {agency.status === 'PENDING' && (
              <Button 
                onClick={() => handleStatusChange('ACTIVE')}
              >
                <Icons.check className="mr-2 h-4 w-4" />
                Approve Agency
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Packages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{agency.stats.totalPackages}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{agency.stats.totalBookings}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{agency.stats.pendingBookings}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(agency.stats.totalRevenue)}</div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                {agency.logo ? (
                  <img 
                    src={agency.logo} 
                    alt={agency.name} 
                    className="w-28 h-28 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-lg bg-muted flex items-center justify-center">
                    <Icons.building className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">{agency.name}</h2>
                  <p className="text-muted-foreground mt-1">{agency.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Icons.mail className="h-4 w-4 text-muted-foreground" />
                        <span>{agency.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icons.phone className="h-4 w-4 text-muted-foreground" />
                        <span>{agency.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Address</h3>
                    <div className="flex items-start gap-2">
                      <Icons.mapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span>{agency.address}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Registration Info</h3>
                  <div className="flex items-center gap-2">
                    <Icons.calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Registered on {formatDate(agency.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="packages" className="mb-6">
          <TabsList>
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="team">Team Members</TabsTrigger>
          </TabsList>
          
          <TabsContent value="packages" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Travel Packages</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={packageColumns}
                  data={agency.packages}
                  searchPlaceholder="Search packages..."
                  searchColumn="name"
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="bookings" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Bookings</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={bookingColumns}
                  data={agency.bookings}
                  searchPlaceholder="Search bookings..."
                  searchColumn="packageName"
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="team" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Team Members</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={userColumns}
                  data={agency.users}
                  searchPlaceholder="Search team members..."
                  searchColumn="name"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </AdminLayout>
    </>
  );
} 