import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import RecentBookings, { Booking } from '../../components/home/RecentBookings';
import { bookingService, BookingFilters } from '../../services/api/bookingService';
import { toast } from 'react-hot-toast';
import { Pagination } from '../../components/ui/pagination';

const CustomerBookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  const fetchBookings = async (tab: string = activeTab, page: number = 1) => {
    setIsLoading(true);
    
    try {
      const filters: BookingFilters = {
        page,
        limit: 10
      };
      
      // Apply status filter based on active tab
      if (tab !== 'all') {
        filters.status = tab;
      }
      
      const response = await bookingService.getMyBookings(filters);
      
      setBookings(response.data);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalItems: response.totalItems
      });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(activeTab);
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handlePageChange = (page: number) => {
    fetchBookings(activeTab, page);
  };

  const handleViewBooking = (bookingId: string) => {
    navigate(`/bookings/${bookingId}`);
  };

  return (
    <>
      <Helmet>
        <title>My Bookings | SafarWay</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-gray-500">View and manage your travel bookings</p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Bookings</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>
                  {activeTab === 'all' 
                    ? 'All Bookings' 
                    : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Bookings`}
                </CardTitle>
                <CardDescription>
                  {pagination.totalItems} booking{pagination.totalItems !== 1 ? 's' : ''} found
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentBookings
                  bookings={bookings}
                  isLoading={isLoading}
                  title=""
                  onViewBooking={handleViewBooking}
                />
                
                {pagination.totalPages > 1 && (
                  <div className="mt-6 flex justify-center">
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default CustomerBookingsPage;
