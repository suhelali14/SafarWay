import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { AgencySummary } from '../../components/agency/AgencySummary';
import { BookingChart } from '../../components/agency/BookingChart';
import { RecentPackages } from '../../components/agency/RecentPackages';
import { RecentBookings } from '../../components/agency/RecentBookings';

import { toast } from '../../components/ui/use-toast';
import { agencyAPI } from '../../services/api';

import { getUserData } from '../../utils/session';

export default function AgencyDashboardPage() {
  const [chartData, setChartData] = useState([]);
  const [recentPackages, setRecentPackages] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [_isLoading, setIsLoading] = useState(true);

  const userData = getUserData();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch dashboard data
        const dashboardData = await agencyAPI.getDashboardSummary(`?agencyId=${userData?.agencyId}`);
        
        // Set chart data
        if (dashboardData.data) {
          setChartData(dashboardData.data);
        }
        
        // Fetch recent packages
        const packagesData = await agencyAPI.getAllPackages({ agencyId: userData?.agencyId || undefined });
        console.log("packagesData",packagesData)
        setRecentPackages(
          packagesData.data.package
            .slice(0, 5)
            .map((pkg: {
              id: string;
              title: string;
              destination: string;
              price: number;
              rating: number;
              totalReviews: number;
              status: string;
              imageUrl: string;
            }) => ({
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
        const bookingsData = await agencyAPI.getAllBookings();
        setRecentBookings(
          bookingsData.data.bookings
           
           
        );
      } catch (error) {
        toast.success({
          title: "Error loading dashboard",
          description: "Failed to load dashboard data. Please try again later.",
          
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