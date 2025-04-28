import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Mail, Phone, MapPin, Calendar, UserPlus, Loader2 } from 'lucide-react';
import { customerAPI, User } from '../../services/api';
import { formatCurrency, formatDate, formatPhone } from '../../utils/formatters';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

import { Dialog } from '../../components/ui/dialog';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';



interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function CustomersPage() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, _setStatusFilter] = useState('all');
  const [selectedCustomer, _setSelectedCustomer] = useState<User | null>(null);
  const [isDetailsModalOpen, _setIsDetailsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });
  const [_formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, [pagination.page, pagination.limit, statusFilter]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = {
        page: pagination.page,
        limit: pagination.limit,
      };
      
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      const response = await customerAPI.getAllCustomers();
      setCustomers(response.data);
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchCustomers();
  };

  // const handleStatusUpdate = async (customerId: string,customerData: Partial<User>) => {
  //   try {
  //     await customerAPI.updateCustomer(customerId,customerData);
  //     toast.success('Customer created successfully');
  //     fetchCustomers();
  //   } catch (error: any) {
  //     toast.error(error.response?.data?.message || 'Failed to create customer');
  //   }
  // };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const errors: Record<string, string> = {};
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (!formData.phone) errors.phone = 'Phone is required';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      setIsSubmitting(true);
      await customerAPI.createCustomer(formData);
      toast.success('Customer created successfully');
      setIsCreateModalOpen(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
      });
      fetchCustomers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create customer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // const handleLimitChange = (newLimit: number) => {
  //   setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
  // };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer Management</h1>
        {user?.role === 'SAFARWAY_ADMIN' && (
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <UserPlus className="w-4 h-4" />
          Add Customer
        </Button>
        )}
      </div>

      <form onSubmit={handleSearch} className="flex gap-4 mb-6">
        <div className="flex-1">
        <Search className="w-4 h-4" />
              <Input
                placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
           
              />
            </div>
            {/* <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'ACTIVE', label: 'Active' },
                { value: 'INACTIVE', label: 'Inactive' },
                { value: 'SUSPENDED', label: 'Suspended' },
              ]}
            /> */}
        <Button type="submit">Search</Button>
      </form>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                        No customers found
                      </td>
                    </tr>
                  ) : (
                    customers.map((customer) => (
                      <motion.tr
                        key={customer.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {customer.profileImage ? (
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={customer.profileImage}
                        alt={customer.name}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-gray-500 font-medium">
                                    {customer.name.charAt(0)}
                                  </span>
                    </div>
                              )}
                      </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      </div>
                    </div>
                  </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{customer.email}</div>
                          <div className="text-sm text-gray-500">{formatPhone(customer.phone || "")}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(customer.createdAt)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{customer.bookings?.length}</div>
                          {customer.recentBookings && (
                            <div className="text-sm text-gray-500">
                              Last: {formatDate(customer.recentBookings.map(b => formatDate(b.createdAt)).slice(-1)[0])}
                    </div>
                          )}
                  </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{formatCurrency(customer.bookings?.map(
                            b => b.totalAmount).reduce((acc, curr) => acc + curr, 0) || 0)}
                           
                            </div>
                          
                  </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            customer.status === 'ACTIVE' 
                              ? 'bg-green-100 text-green-800' 
                              : customer.status === 'INACTIVE'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                      {customer.status}
                    </span>
                  </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              // onClick={() => {
                              //   setSelectedCustomer(customer);
                              //   setIsDetailsModalOpen(true);
                              // }}
                            >
                              View Details
                            </Button>
                            {user?.role === 'SAFARWAY_ADMIN' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                // onClick={() => handleStatusUpdate(
                                //   customer.id,
                                //   customer.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
                                // )}
                              >
                                {customer.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                    </Button>
                            )}
                          </div>
                  </td>
                      </motion.tr>
                    ))
                  )}
            </tbody>
          </table>
        </div>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-2">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                </span>
                {/* <Select
                  value={pagination.limit.toString()}
                  onChange={(e) => handleLimitChange(parseInt(e.target.value))}
                  options={[
                    { value: '10', label: '10 per page' },
                    { value: '25', label: '25 per page' },
                    { value: '50', label: '50 per page' },
                  ]}
                /> */}
              </div>
              <div className="flex gap-1">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === pagination.page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Customer Details Modal */}
      <Dialog
        open={isDetailsModalOpen}
       
      >
        {selectedCustomer && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Personal Information</h3>
                <div className="space-y-2">
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {selectedCustomer.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {formatPhone(selectedCustomer.phone || "")}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {selectedCustomer.address || 'No address provided'}
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Joined: {formatDate(selectedCustomer.createdAt)}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Booking Summary</h3>
                <div className="space-y-2">
                  <p>Total Bookings: {selectedCustomer.bookings?.length}</p>
                  <p>Total Spent: {formatCurrency(selectedCustomer.bookings?.map(
                    b => b.totalAmount).reduce((acc, curr) => acc + curr, 0) || 0)}
                  </p>
                  {selectedCustomer.recentBookings && (
                    // <p>Last Booking: {formatDate(selectedCustomer.date)}</p>
                    <p>Last Booking: {formatDate(selectedCustomer.recentBookings.map(b => formatDate(b.createdAt)).slice(-1)[0])}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Recent Bookings</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selectedCustomer && selectedCustomer.bookings && selectedCustomer.bookings.length === 0  ? (
                  <p className="text-gray-500">No bookings found</p>
                ) : (
                  selectedCustomer?.bookings?.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div>
                        <p className="font-medium">{booking.tour.name}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(booking.bookingDate)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Agency: {booking.tour.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(booking.totalAmount)}</p>
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === 'CONFIRMED' 
                            ? 'bg-green-100 text-green-800' 
                            : booking.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </Dialog>

      {/* Create Customer Modal */}
      <Dialog
        open={isCreateModalOpen}
       
      >
        <form onSubmit={handleCreateCustomer} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
             
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Customer'
              )}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
} 