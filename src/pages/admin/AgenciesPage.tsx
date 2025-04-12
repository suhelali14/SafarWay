import { useState } from 'react';
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
import { Search, MoreVertical, Building2, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

interface Agency {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'pending' | 'suspended';
  packagesCount: number;
  bookingsCount: number;
  createdAt: string;
}

export const AgenciesPage = () => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');

  const fetchAgencies = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/agencies', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setAgencies(data);
    } catch (error) {
      console.error('Error fetching agencies:', error);
      toast.error('Failed to load agencies');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (agencyId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/agencies/${agencyId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setAgencies(agencies.map(agency => 
          agency.id === agencyId ? { ...agency, status: newStatus as 'active' | 'pending' | 'suspended' } : agency
        ));
        toast.success('Agency status updated successfully');
      } else {
        throw new Error('Failed to update agency status');
      }
    } catch (error) {
      console.error('Error updating agency status:', error);
      toast.error('Failed to update agency status');
    }
  };

  const filteredAgencies = agencies.filter(agency => {
    const matchesSearch = agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || agency.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <Helmet>
        <title>Agencies Management | SafarWay Admin</title>
      </Helmet>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Agencies Management</h1>
          <Button>
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
              <DropdownMenuItem onClick={() => setFilter('suspended')}>
                Suspended
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
                <TableHead>Bookings</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Loading agencies...
                  </TableCell>
                </TableRow>
              ) : filteredAgencies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No agencies found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAgencies.map((agency) => (
                  <TableRow key={agency.id}>
                    <TableCell>{agency.name}</TableCell>
                    <TableCell>{agency.email}</TableCell>
                    <TableCell>{agency.phone}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        agency.status === 'active' ? 'bg-green-100 text-green-800' :
                        agency.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {agency.status}
                      </span>
                    </TableCell>
                    <TableCell>{agency.packagesCount}</TableCell>
                    <TableCell>{agency.bookingsCount}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleStatusChange(agency.id, 'active')}>
                            Activate Agency
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(agency.id, 'suspended')}>
                            Suspend Agency
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            View Details
                          </DropdownMenuItem>
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