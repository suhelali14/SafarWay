import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { RefreshCw } from 'lucide-react';

interface ChartData {
  name: string;
  bookings: number;
  revenue: number;
}

interface PieData {
  name: string;
  value: number;
  color: string;
}

const mockMonthlyData: ChartData[] = [
  { name: 'Jan', bookings: 65, revenue: 4000 },
  { name: 'Feb', bookings: 59, revenue: 3500 },
  { name: 'Mar', bookings: 80, revenue: 5000 },
  { name: 'Apr', bookings: 81, revenue: 5200 },
  { name: 'May', bookings: 56, revenue: 3800 },
  { name: 'Jun', bookings: 55, revenue: 3700 },
  { name: 'Jul', bookings: 40, revenue: 3000 },
];

const mockTopPackages: PieData[] = [
  { name: 'Paris Adventure', value: 35, color: '#FF6B6B' },
  { name: 'Tokyo Explorer', value: 25, color: '#4ECDC4' },
  { name: 'Safari Trip', value: 20, color: '#45B7D1' },
  { name: 'Beach Resort', value: 15, color: '#96CEB4' },
  { name: 'Mountain Trek', value: 5, color: '#FFEEAD' },
];

export const AnalyticsPage = () => {
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  });
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const handleRefresh = async () => {
    // TODO: Implement API call to refresh data
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {formatDate(lastUpdated)}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, start: e.target.value }))
              }
              className="px-4 py-2 rounded-lg border bg-background"
            />
            <span>to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, end: e.target.value }))
              }
              className="px-4 py-2 rounded-lg border bg-background"
            />
          </div>
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card p-6 rounded-lg border"
        >
          <h2 className="text-lg font-medium mb-4">Monthly Bookings</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Monthly Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card p-6 rounded-lg border"
        >
          <h2 className="text-lg font-medium mb-4">Monthly Revenue</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  tickFormatter={(value) =>
                    new Intl.NumberFormat('en-US', {
                      notation: 'compact',
                      compactDisplay: 'short',
                      style: 'currency',
                      currency: 'INR',
                    }).format(value)
                  }
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
                <Bar
                  dataKey="revenue"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Packages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card p-6 rounded-lg border"
        >
          <h2 className="text-lg font-medium mb-4">Top Packages</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockTopPackages}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.name} (${entry.value}%)`}
                >
                  {mockTopPackages.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Destination Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card p-6 rounded-lg border"
        >
          <h2 className="text-lg font-medium mb-4">Destination Popularity</h2>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">
              Map visualization coming soon...
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}; 