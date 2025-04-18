import { motion } from 'framer-motion';
import { Users, Package, Star, Calendar } from 'lucide-react';
import { AgencyStats as AgencyStatsType } from '../../lib/api/agency';

interface AgencyStatsProps {
  stats: AgencyStatsType;
}

export function AgencyStats({ stats }: AgencyStatsProps) {
  const {
    totalCustomersServed,
    totalPackagesOffered,
    averageRating,
    yearsActive
  } = stats;
  
  const statItems = [
    {
      icon: <Users className="h-6 w-6 text-blue-500" />,
      value: totalCustomersServed.toLocaleString(),
      label: 'Customers Served',
      color: 'bg-blue-50',
    },
    {
      icon: <Package className="h-6 w-6 text-amber-500" />,
      value: totalPackagesOffered.toLocaleString(),
      label: 'Packages Offered',
      color: 'bg-amber-50',
    },
    {
      icon: <Star className="h-6 w-6 text-green-500" />,
      value: averageRating.toFixed(1),
      label: 'Average Rating',
      color: 'bg-green-50',
    },
    {
      icon: <Calendar className="h-6 w-6 text-purple-500" />,
      value: yearsActive.toString(),
      label: 'Years Active',
      color: 'bg-purple-50',
    },
  ];
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      {statItems.map((item, index) => (
        <motion.div
          key={index}
          className={`${item.color} rounded-lg p-4 shadow-sm`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <div className="flex items-center gap-3 mb-2">
            {item.icon}
            <h3 className="font-semibold text-gray-700">{item.label}</h3>
          </div>
          <p className="text-2xl font-bold">{item.value}</p>
        </motion.div>
      ))}
    </div>
  );
} 