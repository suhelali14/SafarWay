import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { AgencyLayout } from '../../components/layouts/AgencyLayout';
import { AgencySummary } from '../../components/agency/AgencySummary';
import { BookingChart } from '../../components/agency/BookingChart';
import { RecentPackages } from '../../components/agency/RecentPackages';
import { RecentBookings } from '../../components/agency/RecentBookings';
import { agencyService } from '../../services/agencyService';
import { toast } from '../../components/ui/use-toast';

export default function AgencyDashboardPage() {
  const [chartData, setChartData] = useState([]);
  const [recentPackages, setRecentPackages] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch dashboard data
        const dashboardData = await agencyService.getDashboardSummary('weekly');
        
        // Set chart data
        if (dashboardData.bookingsChartData) {
          setChartData(dashboardData.bookingsChartData);
        }
        
        // Fetch recent packages
        const packagesData = await agencyService.getAllPackages();
        setRecentPackages(
          packagesData.packages
            .slice(0, 5)
            .map(pkg => ({
              id: pkg.id,
              title: pkg.title,
              destination: pkg.destination,
              price: pkg.price,
              rating: pkg.rating || 0,
              totalReviews: pkg.totalReviews || 0,
              status: pkg.status,
              imageUrl: pkg.imageUrl,
            }))
        );
        
        // Fetch recent bookings
        const bookingsData = await agencyService.getAllBookings();
        setRecentBookings(
          bookingsData.bookings
            .slice(0, 5)
            .map(booking => ({
              id: booking.id,
              bookingId: booking.bookingId,
              customerName: booking.customerName,
              packageName: booking.packageName,
              date: booking.bookingDate,
              amount: booking.totalAmount,
              status: booking.status,
            }))
        );
      } catch (error) {
        toast({
          title: "Error loading dashboard",
          description: "Failed to load dashboard data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard | SafarWay Agency Portal</title>
      </Helmet>
      <>
        <div className="space-y-8">
          <AgencySummary />
          
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <BookingChart 
              data={chartData}
              title="Booking Trends"
              description="Number of bookings over the past weeks"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <RecentPackages packages={recentPackages} />
            <RecentBookings bookings={recentBookings} />
          </div>
        </div>
      </>
    </>
  );
} 