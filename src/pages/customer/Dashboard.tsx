import React, { useEffect, useState } from 'react';
import RecentBookings from '../../components/home/RecentBookings';
import { bookingService } from '../../services/api/bookingService';
import { Booking } from '../../components/home/RecentBookings';
import { getUserData } from '../../utils/session';
import { Helmet } from 'react-helmet-async';
import QuickStats, { CustomerStats } from '../../components/home/QuickStats';
import { useToast } from '../../hooks/use-toast';
import { customerAPI } from '../../services/api';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<CustomerStats>({
    totalBookings: 0,
    upcomingTrips: 0,
    visitedLocations: 0,
    totalSpent: 0,
    wishlistItems: 0
  });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const { toast } = useToast();
  const userData = getUserData();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoadingStats(true);
        setIsLoadingBookings(true);
        
        // Fetch customer stats
        const statsResponse = await customerAPI.getDashboardSummary();
        setStats({
          totalBookings: statsResponse.data.totalBookings || 0,
          upcomingTrips: statsResponse.data.upcomingTrips || 0,
          visitedLocations: statsResponse.data.visitedLocations || 0,
          totalSpent: statsResponse.data.totalSpent || 0,
          wishlistItems: statsResponse.data.wishlistItems || 0
        });
        setIsLoadingStats(false);
        
        // Fetch recent bookings
        const bookingsResponse = await bookingService.getRecentBookings();
        setBookings(bookingsResponse);
        setIsLoadingBookings(false);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data. Please try again later.',
          variant: 'destructive',
        });
        setIsLoadingStats(false);
        setIsLoadingBookings(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  return (
    <>
      <Helmet>
        <title>Dashboard | SafarWay</title>
      </Helmet>
      
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Welcome back, {userData?.name || 'Traveler'}!
            </p>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Travel Statistics</h2>
          <QuickStats stats={stats} isLoading={isLoadingStats} />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
          <RecentBookings bookings={bookings} isLoading={isLoadingBookings} />
        </section>
      </div>
    </>
  );
};

export default Dashboard;