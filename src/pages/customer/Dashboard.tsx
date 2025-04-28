import React from 'react';

import { Helmet } from 'react-helmet-async';


const Dashboard: React.FC = () => {
  // const [stats, setStats] = useState<CustomerStats>({
  //   totalBookings: 0,
  //   upcomingTrips: 0,
  //   visitedLocations: 0,
  //   totalSpent: 0,
  //   wishlistItems: 0
  // });
  // const [bookings, setBookings] = useState<Booking[]>([]);
  // const [isLoadingStats, setIsLoadingStats] = useState(true);
  // const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  // const { toast } = useToast();
  // const userData = getUserData();

  // useEffect(() => {
  //   const fetchDashboardData = async () => {
  //     try {
  //       setIsLoadingStats(true);
  //       setIsLoadingBookings(true);
        
  //       // Fetch customer stats
  //       const statsResponse = await customerAPI.getDashboardSummary();
  //       setStats({
  //         totalBookings: statsResponse.data.totalBookings || 0,
  //         upcomingTrips: statsResponse.data.upcomingTrips || 0,
  //         visitedLocations: statsResponse.data.visitedLocations || 0,
  //         totalSpent: statsResponse.data.totalSpent || 0,
  //         wishlistItems: statsResponse.data.wishlistItems || 0
  //       });
  //       setIsLoadingStats(false);
        
  //       // Fetch recent bookings
  //       const bookingsResponse = await bookingService.getRecentBookings();
  //       setBookings(bookingsResponse);
  //       setIsLoadingBookings(false);
  //     } catch (error) {
  //       console.error('Failed to fetch dashboard data:', error);
  //       toast({
  //         title: 'Error',
  //         description: 'Failed to load dashboard data. Please try again later.',
  //         variant: 'destructive',
  //       });
  //       setIsLoadingStats(false);
  //       setIsLoadingBookings(false);
  //     }
  //   };

  //   fetchDashboardData();
  // }, [toast]);

  return (
    <>
      <Helmet>
        <title>Dashboard | SafarWay</title>
      </Helmet>
      
      
    </>
  );
};

export default Dashboard;