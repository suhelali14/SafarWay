import  { useState, useEffect } from 'react';
import { StatCard } from './StatCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card } from '../ui/card';
import { PackageIcon, Users, CreditCard, TrendingUp } from 'lucide-react';

import { toast } from '../ui/use-toast';
import { agencyAPI } from '../../services/api';

type TimeRange = 'weekly' | 'monthly' | 'yearly';

export function AgencySummary() {
  const [timeRange, setTimeRange] = useState<TimeRange>('weekly');
  const [summaryData, setSummaryData] = useState({
    totalActivePackages:0,
    totalBookings: 0,
    totalCustomers: 0,
    totalPackages: 0,
    revenue: 0,
    bookingsTrend: 0,
    customersTrend: 0,
    packagesTrend: 0,
    revenueTrend: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummaryData = async () => {
      setIsLoading(true);
      try {
        const response = await agencyAPI.getDashboardSummary(timeRange);
        const data=response.data;
        console.log("data",data);
        setSummaryData({
          totalActivePackages:data.totalActivePackages,
          totalBookings: data.totalBookings,
          totalCustomers: data.totalCustomers,
          totalPackages: data.totalPackages,
          revenue: data.revenue,
          bookingsTrend: data.bookingsTrend || 0,
          customersTrend: data.customersTrend || 0,
          packagesTrend: data.packagesTrend || 0,
          revenueTrend: data.revenueTrend || 0,
        });
      } catch (error) {
        toast.error({
          title: "Failed to fetch summary data",
          description: "Could not load dashboard statistics",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummaryData();
  }, [timeRange]);

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value as TimeRange);
  };

  const timeLabel = {
    weekly: 'from last week',
    monthly: 'from last month',
    yearly: 'from last year',
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <Select defaultValue={timeRange} onValueChange={handleTimeRangeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="h-[136px] animate-pulse bg-muted" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Bookings"
            value={summaryData.totalBookings}
            icon={<CreditCard className="h-4 w-4" />}
            trend={{
              value: summaryData.bookingsTrend,
              label: timeLabel[timeRange],
              positive: summaryData.bookingsTrend > 0,
            }}
          />
          <StatCard
            title="Total Customers"
            value={summaryData.totalCustomers}
            icon={<Users className="h-4 w-4" />}
            trend={{
              value: summaryData.customersTrend,
              label: timeLabel[timeRange],
              positive: summaryData.customersTrend > 0,
            }}
          />
          <StatCard
            title="Active Packages"
            value={summaryData.totalPackages}
            icon={<PackageIcon className="h-4 w-4" />}
            trend={{
              value: summaryData.packagesTrend,
              label: timeLabel[timeRange],
              positive: summaryData.packagesTrend > 0,
            }}
          />
          <StatCard
            title="Total Revenue"
            value={`${summaryData.revenue}`}
            icon={<TrendingUp className="h-4 w-4" />}
            trend={{
              value: summaryData.revenueTrend,
              label: timeLabel[timeRange],
              positive: summaryData.revenueTrend > 0,
            }}
          />
        </div>
      )}
    </div>
  );
} 