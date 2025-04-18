import { 
  DashboardSummary, 
  RecentBooking, 
  PackagePerformance,
  ChartDataPoint,
  Booking,
  Payment,
  AgencyProfile,
  Review
} from './agencyService';

// Mock dashboard summary data
export const mockDashboardSummary = (): DashboardSummary => {
  const today = new Date();
  
  // Generate chart data for the last 6 months
  const chartData: ChartDataPoint[] = [];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  for (let i = 5; i >= 0; i--) {
    const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthKey = `${monthNames[month.getMonth()]} ${month.getFullYear()}`;
    chartData.push({
      name: monthKey,
      value: Math.floor(Math.random() * 500000) + 100000 // Random revenue between 100k and 600k
    });
  }
  
  // Generate recent bookings
  const recentBookings: RecentBooking[] = [
    {
      id: "b1",
      customer: "Rahul Mehta",
      package: "Golden Triangle Tour",
      destination: "Delhi-Agra-Jaipur",
      status: "CONFIRMED",
      amount: 45000,
      date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
    },
    {
      id: "b2",
      customer: "Priya Sharma",
      package: "Kerala Backwaters Package",
      destination: "Kochi-Alleppey-Kumarakom",
      status: "PENDING",
      amount: 60000,
      date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
    },
    {
      id: "b3",
      customer: "Amar Patel",
      package: "Goa Beach Vacation",
      destination: "North & South Goa",
      status: "COMPLETED",
      amount: 35000,
      date: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
    },
    {
      id: "b4",
      customer: "Sneha Reddy",
      package: "Andaman Island Explorer",
      destination: "Port Blair-Havelock-Neil",
      status: "CANCELLED",
      amount: 75000,
      date: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString() // 15 days ago
    },
    {
      id: "b5",
      customer: "Vikram Singh",
      package: "Himalayan Adventure",
      destination: "Manali-Leh-Ladakh",
      status: "CONFIRMED",
      amount: 92000,
      date: new Date(today.getTime() - 18 * 24 * 60 * 60 * 1000).toISOString() // 18 days ago
    }
  ];
  
  // Generate package performance data
  const packages: PackagePerformance[] = [
    {
      id: "p1",
      title: "Golden Triangle Tour",
      validFrom: new Date(today.getFullYear(), today.getMonth() - 2, 1).toISOString(),
      validTill: new Date(today.getFullYear(), today.getMonth() + 4, 1).toISOString(),
      bookingsCount: 24,
      status: "PUBLISHED"
    },
    {
      id: "p2",
      title: "Kerala Backwaters Package",
      validFrom: new Date(today.getFullYear(), today.getMonth() - 1, 15).toISOString(),
      validTill: new Date(today.getFullYear(), today.getMonth() + 6, 15).toISOString(),
      bookingsCount: 16,
      status: "PUBLISHED"
    },
    {
      id: "p3",
      title: "Goa Beach Vacation",
      validFrom: new Date(today.getFullYear(), today.getMonth() - 3, 10).toISOString(),
      validTill: new Date(today.getFullYear(), today.getMonth() - 1, 10).toISOString(), // expired
      bookingsCount: 31,
      status: "ARCHIVED"
    },
    {
      id: "p4",
      title: "Andaman Island Explorer",
      validFrom: new Date(today.getFullYear(), today.getMonth(), 5).toISOString(),
      validTill: new Date(today.getFullYear(), today.getMonth() + 3, 5).toISOString(),
      bookingsCount: 7,
      status: "PUBLISHED"
    },
    {
      id: "p5",
      title: "Himalayan Adventure",
      validFrom: new Date(today.getFullYear(), today.getMonth(), 20).toISOString(),
      validTill: new Date(today.getFullYear(), today.getMonth() + 1, 5).toISOString(), // expiring soon
      bookingsCount: 19,
      status: "PUBLISHED"
    },
    {
      id: "p6",
      title: "Rajasthan Royal Heritage",
      validFrom: new Date(today.getFullYear(), today.getMonth() + 1, 1).toISOString(),
      validTill: new Date(today.getFullYear(), today.getMonth() + 7, 1).toISOString(),
      bookingsCount: 0,
      status: "DRAFT"
    }
  ];
  
  return {
    totalBookings: 97,
    totalRevenue: 3850000,
    totalPackages: 6,
    activePackages: 4,
    upcomingPackages: 3,
    pendingBookings: 12,
    completedBookings: 65,
    cancelledBookings: 8,
    monthlyRevenue: 950000,
    totalCustomers: 85,
    recentBookings,
    packages,
    chartData
  };
};

// Mock agency profile data
export const mockAgencyProfile = (): AgencyProfile => {
  return {
    id: "agency123",
    name: "Incredible India Tours",
    description: "Specializing in authentic Indian travel experiences since 2010.",
    logo: "https://via.placeholder.com/150",
    contactEmail: "info@incredibleindiatours.com",
    contactPhone: "+91 98765 43210",
    address: "123 Tourism Road, New Delhi",
    city: "New Delhi",
    country: "India",
    website: "www.incredibleindiatours.com",
    socialMedia: {
      facebook: "facebook.com/incredibleindiatours",
      instagram: "instagram.com/incredibleindiatours",
    },
    status: "VERIFIED",
    createdAt: "2020-03-15T00:00:00Z",
    updatedAt: "2023-04-20T00:00:00Z"
  };
};

// Mock reviews data
export const mockReviews = (): Review[] => {
  return [
    {
      id: "rev1",
      customerName: "Priya Singh",
      rating: 5,
      comment: "Excellent service! The tour was perfectly organized and the guide was knowledgeable.",
      date: "2023-05-15T10:30:00Z"
    },
    {
      id: "rev2",
      customerName: "Rahul Sharma",
      rating: 4,
      comment: "Great experience overall, but the transportation was slightly delayed.",
      date: "2023-05-10T14:20:00Z"
    },
    {
      id: "rev3",
      customerName: "Meera Patel",
      rating: 5,
      comment: "Amazing destinations and very good customer service. Will book again!",
      date: "2023-05-05T09:15:00Z"
    },
    {
      id: "rev4",
      customerName: "Vikram Malhotra",
      rating: 3,
      comment: "The tour was good but the accommodation wasn't up to the promised standards.",
      date: "2023-04-28T16:45:00Z"
    },
    {
      id: "rev5",
      customerName: "Aisha Khan",
      rating: 5,
      comment: "Perfect holiday! Every detail was taken care of. Highly recommended!",
      date: "2023-04-20T11:10:00Z"
    },
    {
      id: "rev6",
      customerName: "Arjun Nair",
      rating: 4,
      comment: "The itinerary was well planned with ample free time. Would recommend.",
      date: "2023-04-15T08:30:00Z"
    },
    {
      id: "rev7",
      customerName: "Neha Gupta",
      rating: 2,
      comment: "Disappointed with the food options. Not what was promised in the package.",
      date: "2023-04-10T17:20:00Z"
    }
  ];
}; 