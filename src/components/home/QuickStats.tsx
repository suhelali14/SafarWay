import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Briefcase, Calendar, Heart, Award } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

export interface CustomerStats {
  totalBookings: number;
  upcomingTrips: number;
  ongoingTrips?: number;
  countriesVisited?: number;
  loyaltyPoints?: number;
  savedPackages?: number;
  wishlistItems?: number;
  totalSpent?: number;
  visitedLocations?: number;
}

interface QuickStatsProps {
  stats: CustomerStats;
  isLoading: boolean;
}

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  className = '' 
}: { 
  title: string; 
  value: number; 
  icon: React.ElementType; 
  className?: string;
}) => (
  <Card className={`${className} h-full`}>
    <CardContent className="flex items-center justify-between p-6">
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
        <Icon className="h-6 w-6 text-primary" />
      </div>
    </CardContent>
  </Card>
);

const QuickStats: React.FC<QuickStatsProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Total Bookings" 
        value={stats.totalBookings} 
        icon={Calendar} 
      />
      <StatCard 
        title="Upcoming Trips" 
        value={stats.upcomingTrips} 
        icon={Briefcase} 
      />
      <StatCard 
        title="Saved Packages" 
        value={stats.savedPackages || stats.wishlistItems || 0} 
        icon={Heart} 
      />
      <StatCard 
        title="Ongoing Trips" 
        value={stats.ongoingTrips || 0} 
        icon={Award} 
      />
    </div>
  );
};

export default QuickStats; 