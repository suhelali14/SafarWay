import { Package, Calendar, DollarSign, Star, } from 'lucide-react'
import { StatCard } from '../../components/dashboard/cards/stat-card'

export function DashboardPage() {
  const stats = [
    {
      title: 'Total Packages',
      value: '12',
      icon: Package,
      trend: {
        value: 8.2,
        isPositive: true
      },
      description: '3 new packages this month'
    },
    {
      title: 'Active Bookings',
      value: '48',
      icon: Calendar,
      trend: {
        value: 12.5,
        isPositive: true
      },
      description: '16 bookings this week'
    },
    {
      title: 'Total Earnings',
      value: '₹4,89,250',
      icon: DollarSign,
      trend: {
        value: 4.1,
        isPositive: false
      },
      description: 'Compared to last month'
    },
    {
      title: 'Average Rating',
      value: '4.8',
      icon: Star,
      trend: {
        value: 2.3,
        isPositive: true
      },
      description: 'Based on 156 reviews'
    }
  ]

  const recentBookings = [
    {
      id: 1,
      customerName: 'Rahul Sharma',
      package: 'Ladakh Adventure',
      date: '2024-03-15',
      amount: '₹29,999',
      status: 'confirmed'
    },
    {
      id: 2,
      customerName: 'Priya Patel',
      package: 'Kerala Backwaters',
      date: '2024-03-14',
      amount: '₹24,999',
      status: 'pending'
    },
    {
      id: 3,
      customerName: 'Amit Kumar',
      package: 'Rajasthan Heritage',
      date: '2024-03-13',
      amount: '₹27,999',
      status: 'confirmed'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">
          Welcome to your vendor dashboard. Here's what's happening with your packages.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {booking.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {booking.package}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {booking.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {booking.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${
                          booking.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }
                      `}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-200">
          <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
            View all bookings →
          </button>
        </div>
      </div>

      {/* Chart Section - To be implemented with a charting library */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Trends</h2>
        <div className="h-80 flex items-center justify-center text-gray-500">
          Chart will be implemented with a charting library (e.g., Recharts, Chart.js)
        </div>
      </div>
    </div>
  )
} 