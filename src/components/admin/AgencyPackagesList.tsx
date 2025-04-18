import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Spinner } from '../ui/spinner';
import { adminAPI } from '../../services/api';

type PackageType = {
  id: string;
  name: string;
  description: string;
  destination: string;
  price: number;
  duration: number;
  status: 'ACTIVE' | 'DRAFT' | 'INACTIVE';
  image: string | null;
};

type AgencyPackagesListProps = {
  agencyId: string;
};

export function AgencyPackagesList({ agencyId }: AgencyPackagesListProps) {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Mock data for development
        const mockPackages: PackageType[] = [
          {
            id: "pkg1",
            name: "Bali Adventure",
            description: "Experience the beauty of Bali with this 7-day package",
            destination: "Bali, Indonesia",
            price: 1299.99,
            duration: 7,
            status: "ACTIVE",
            image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400"
          },
          {
            id: "pkg2",
            name: "Paris Getaway",
            description: "Romantic 5-day trip to the city of love",
            destination: "Paris, France",
            price: 2499.99,
            duration: 5,
            status: "ACTIVE",
            image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400"
          },
          {
            id: "pkg3",
            name: "Tokyo Explorer",
            description: "Discover the wonders of Tokyo in this 10-day tour",
            destination: "Tokyo, Japan",
            price: 3199.99,
            duration: 10,
            status: "DRAFT",
            image: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=400"
          }
        ];
        
        setPackages(mockPackages);
        setFilteredPackages(mockPackages);
        
        // Uncomment when API is ready
        // const response = await adminAPI.getAgencyPackages(agencyId);
        // setPackages(response.data.packages);
        // setFilteredPackages(response.data.packages);
      } catch (err) {
        console.error('Error fetching agency packages:', err);
        setError('Failed to load packages. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [agencyId]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPackages(packages);
    } else {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = packages.filter(
        (pkg) =>
          pkg.name.toLowerCase().includes(lowercaseQuery) ||
          pkg.destination.toLowerCase().includes(lowercaseQuery) ||
          pkg.description.toLowerCase().includes(lowercaseQuery)
      );
      setFilteredPackages(filtered);
    }
  }, [searchQuery, packages]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Status badge color mapping
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
              <Package className="w-5 h-5 mr-2" />
              Tour Packages
            </CardTitle>
            <CardDescription>
              {packages.length > 0
                ? `Managing ${packages.length} tour packages for this agency`
                : 'No packages found for this agency'}
            </CardDescription>
          </div>
          <Button onClick={() => navigate(`/admin/packages/create?agencyId=${agencyId}`)}>
            Add New Package
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search packages by name or destination..."
              className="pl-10"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>

        {filteredPackages.length > 0 ? (
          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredPackages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <a
                        href={`/admin/packages/${pkg.id}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {pkg.name}
                      </a>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{pkg.destination}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{pkg.duration} days</td>
                    <td className="px-4 py-3 whitespace-nowrap">${pkg.price.toLocaleString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge className={getStatusBadgeClass(pkg.status)}>{pkg.status}</Badge>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/admin/packages/${pkg.id}`)}
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
                <p className="text-gray-500 mb-4">No packages found matching "{searchQuery}".</p>
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              </>
            ) : (
              <>
                <Package className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-gray-500 mb-4">This agency has not created any packages yet.</p>
                <Button onClick={() => navigate(`/admin/packages/create?agencyId=${agencyId}`)}>
                  Create First Package
                </Button>
              </>
            )}
          </div>
        )}
      </CardContent>
      {filteredPackages.length > 0 && (
        <CardFooter>
          <Button 
            variant="outline" 
            onClick={() => navigate(`/admin/packages?agencyId=${agencyId}`)}
            className="w-full"
          >
            View All Packages
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

// Make sure to export the component properly
export default AgencyPackagesList; 