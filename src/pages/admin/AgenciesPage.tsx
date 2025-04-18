import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Search, MoreVertical, Building2, Filter, EyeIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

interface Agency {
  id: string;
  name: string;
  contactEmail: string;
  contactPhone: string;
  status: string;
  description?: string;
  address?: string;
  logo?: string;
  tourPackages?: any[];
  createdAt: string;
  updatedAt: string;
}

export const AgenciesPage = () => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllAgencies();
      setAgencies(response.data.agencies || []);
    } catch (error) {
      console.error('Error fetching agencies:', error);
      toast.error('Failed to load agencies');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (agencyId: string) => {
    navigate(`/admin/agencies/${agencyId}`);
  };

  const handleApproveAgency = async (agencyId: string) => {
    try {
      await adminAPI.approveAgency(agencyId);
      toast.success('Agency approved successfully');
      // Refresh the list to get updated data
      fetchAgencies();
    } catch (error) {
      console.error('Error approving agency:', error);
      toast.error('Failed to approve agency');
    }
  };

  const handleRejectAgency = async (agencyId: string) => {
    try {
      await adminAPI.rejectAgency(agencyId);
      toast.success('Agency rejected successfully');
      // Refresh the list to get updated data
      fetchAgencies();
    } catch (error) {
      console.error('Error rejecting agency:', error);
      toast.error('Failed to reject agency');
    }
  };

  const filteredAgencies = agencies.filter(agency => {
    const matchesSearch = 
      agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'active' && agency.status === 'ACTIVE') ||
      (filter === 'pending' && agency.status === 'PENDING') ||
      (filter === 'inactive' && agency.status === 'INACTIVE') ||
      (filter === 'rejected' && agency.status === 'REJECTED');
    
    return matchesSearch && matchesFilter;
  });

  // Calculate package counts for each agency
  const getPackageCount = (agency: Agency) => {
    return agency.tourPackages?.length || 0;
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Helmet>
        <title>Agencies Management | SafarWay Admin</title>
      </Helmet>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Agencies Management</h1>
          <Button onClick={() => navigate('/admin/agencies/create')}>
            <Building2 className="w-4 h-4 mr-2" />
            Add New Agency
          </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search agencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilter('all')}>
                All Agencies
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('active')}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('pending')}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('inactive')}>
                Inactive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('rejected')}>
                Rejected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Packages</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading agencies...
                  </TableCell>
                </TableRow>
              ) : filteredAgencies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No agencies found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAgencies.map((agency) => (
                  <TableRow key={agency.id}>
                    <TableCell className="font-medium">{agency.name}</TableCell>
                    <TableCell>{agency.contactEmail}</TableCell>
                    <TableCell>{agency.contactPhone}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(agency.status)}`}>
                        {agency.status}
                      </span>
                    </TableCell>
                    <TableCell>{getPackageCount(agency)}</TableCell>
                    <TableCell>
                      {new Date(agency.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(agency.id)}>
                            <EyeIcon className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {agency.status === 'PENDING' && (
                            <>
                              <DropdownMenuItem onClick={() => handleApproveAgency(agency.id)}>
                                Approve Agency
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleRejectAgency(agency.id)}>
                                Reject Agency
                              </DropdownMenuItem>
                            </>
                          )}
                          {agency.status === 'ACTIVE' && (
                            <DropdownMenuItem onClick={() => handleRejectAgency(agency.id)}>
                              Deactivate Agency
                            </DropdownMenuItem>
                          )}
                          {agency.status === 'INACTIVE' && (
                            <DropdownMenuItem onClick={() => handleApproveAgency(agency.id)}>
                              Activate Agency
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}; 