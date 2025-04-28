import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { 
  Card, 
 
} from '../../../components/ui/card'; // Update the path to the correct module

import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Link } from 'react-router-dom';
import { Icons } from '../../../components/Icons';
import { DataTable } from '../../../components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { formatDate } from '../../../lib/utils';
import { toast } from 'sonner';
import axios from '../../../lib/axios';

interface Agency {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  logo?: string;
  packagesCount: number;
  bookingsCount: number;
}

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/admin/agencies');
      setAgencies(response.data.agencies);
    } catch (error) {
      toast.error('Failed to fetch agencies');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED') => {
    try {
      await axios.patch(`/admin/agencies/${id}/status`, { status });
      toast.success(`Agency status updated to ${status.toLowerCase()}`);
      
      // Update the agencies list
      setAgencies(agencies.map(agency => 
        agency.id === id ? { ...agency, status } : agency
      ));
    } catch (error) {
      toast.error('Failed to update agency status');
      console.error(error);
    }
  };

  const columns: ColumnDef<Agency>[] = [
    {
      accessorKey: 'name',
      header: 'Agency',
      cell: ({ row }) => {
        const agency = row.original;
        return (
          <div className="flex items-center gap-3">
            {agency.logo ? (
              <img 
                src={agency.logo} 
                alt={agency.name} 
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <Icons.building className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
            <div>
              <div className="font-medium">{agency.name}</div>
              <div className="text-sm text-muted-foreground">{agency.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'phone',
      header: 'Contact',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const statusMap: Record<string, { label: string, variant: 'default' | 'outline' | 'secondary' | 'destructive' | 'success' }> = {
          ACTIVE: { label: 'Active', variant: 'success' },
          PENDING: { label: 'Pending', variant: 'secondary' },
          INACTIVE: { label: 'Inactive', variant: 'outline' },
          SUSPENDED: { label: 'Suspended', variant: 'destructive' },
        };
        
        const badgeInfo = statusMap[status] || { label: status, variant: 'default' };
        
        return (
          <Badge variant={badgeInfo.variant} label={badgeInfo.label}>
            
          </Badge>
        );
      },
    },
    {
      accessorKey: 'packagesCount',
      header: 'Packages',
    },
    {
      accessorKey: 'bookingsCount',
      header: 'Bookings',
    },
    {
      accessorKey: 'createdAt',
      header: 'Joined',
      cell: ({ row }) => formatDate(row.getValue('createdAt')),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const agency = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/admin/agencies/${agency.id}`}>
                <Icons.view className="h-4 w-4 mr-1" />
                View
              </Link>
            </Button>
            
            {agency.status === 'ACTIVE' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleStatusChange(agency.id, 'SUSPENDED')}
              >
                <Icons.ban className="h-4 w-4 mr-1" />
                Suspend
              </Button>
            )}
            
            {agency.status === 'SUSPENDED' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleStatusChange(agency.id, 'ACTIVE')}
              >
                <Icons.check className="h-4 w-4 mr-1" />
                Activate
              </Button>
            )}
            
            {agency.status === 'PENDING' && (
              <Button 
                variant="default" 
                size="sm"
                onClick={() => handleStatusChange(agency.id, 'ACTIVE')}
              >
                <Icons.check className="h-4 w-4 mr-1" />
                Approve
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Helmet>
        <title>Agencies - SafarWay Admin</title>
      </Helmet>
      
      <AdminLayout>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Agencies</h1>
            <p className="text-muted-foreground">
              Manage agencies registered on the platform
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/admin/agencies/invite">
                <Icons.mail className="mr-2 h-4 w-4" />
                Invite Agency
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/admin/agencies/create">
                <Icons.plus className="mr-2 h-4 w-4" />
                Add Agency
              </Link>
            </Button>
          </div>
        </div>
        
        <Card>
          <div className="p-1">
            <DataTable
              columns={columns}
              data={agencies}
              showColumnVisibility={isLoading}
              searchPlaceholder="Search agencies..."
              searchKey="name"
            />
          </div>
        </Card>
      </AdminLayout>
    </>
  );
} 