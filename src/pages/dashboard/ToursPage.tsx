import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import { tourAPI } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { Dialog } from '../../components/ui/dialog';
import toast from 'react-hot-toast';

interface Tour {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  location: string;
  startDate: string;
  maxParticipants: number;
  currentParticipants: number;
  status: 'active' | 'inactive' | 'cancelled';
  images: string[];
}

export function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    location: '',
    startDate: '',
    maxParticipants: '',
    status: 'active',
    images: [] as string[],
  });

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const response = await tourAPI.getAll();
      // Ensure we have a valid array of tours
      const toursData = response?.data?.items || [];
      setTours(Array.isArray(toursData) ? toursData : []);
    } catch (error) {
      console.error('Error fetching tours:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch tours',
        variant: 'destructive',
      });
      setTours([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTour = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await tourAPI.create(formData);
      toast({
        title: 'Success',
        description: 'Tour created successfully',
      });
      setIsCreateModalOpen(false);
      fetchTours();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create tour',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateTour = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTour) return;

    try {
      await tourAPI.update(selectedTour.id, formData);
      toast({
        title: 'Success',
        description: 'Tour updated successfully',
      });
      setIsEditModalOpen(false);
      fetchTours();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update tour',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTour = async () => {
    if (!selectedTour) return;

    try {
      await tourAPI.delete(selectedTour.id);
      toast({
        title: 'Success',
        description: 'Tour deleted successfully',
      });
      setIsDeleteModalOpen(false);
      fetchTours();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete tour',
        variant: 'destructive',
      });
    }
  };

  const filteredTours = tours.filter((tour) => {
    const matchesSearch = tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tour.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tours Management</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Tour
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search tours..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'cancelled', label: 'Cancelled' },
          ]}
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Location</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Duration</th>
                <th className="px-6 py-3 text-left">Participants</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTours.map((tour) => (
                <motion.tr
                  key={tour.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4">{tour.title}</td>
                  <td className="px-6 py-4">{tour.location}</td>
                  <td className="px-6 py-4">{formatCurrency(tour.price)}</td>
                  <td className="px-6 py-4">{tour.duration} days</td>
                  <td className="px-6 py-4">
                    {tour.currentParticipants}/{tour.maxParticipants}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      tour.status === 'active' ? 'bg-green-100 text-green-800' :
                      tour.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {tour.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedTour(tour);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedTour(tour);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Tour Modal */}
      <Dialog
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Tour"
      >
        <form onSubmit={handleCreateTour} className="space-y-4">
          {/* Form fields */}
          <Button type="submit">Create Tour</Button>
        </form>
      </Dialog>

      {/* Edit Tour Modal */}
      <Dialog
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Tour"
      >
        <form onSubmit={handleUpdateTour} className="space-y-4">
          {/* Form fields */}
          <Button type="submit">Update Tour</Button>
        </form>
      </Dialog>

      {/* Delete Tour Modal */}
      <Dialog
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Tour"
      >
        <p>Are you sure you want to delete this tour?</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteTour}
          >
            Delete
          </Button>
        </div>
      </Dialog>
    </div>
  );
} 