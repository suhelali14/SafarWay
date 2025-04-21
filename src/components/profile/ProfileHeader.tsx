import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';
import { Edit, Mail, Phone } from 'lucide-react';

interface ProfileHeaderProps {
  user: any;
  isLoading: boolean;
  onEdit: () => void;
}

export function ProfileHeader({ user, isLoading, onEdit }: ProfileHeaderProps) {
  // Define user level based on booking count or some other metric
  const getUserLevel = (user: any) => {
    if (!user) return 'Bronze';
    
    const bookingCount = user.stats?.totalBookings || 0;
    
    if (bookingCount >= 10) return 'Platinum';
    if (bookingCount >= 5) return 'Gold';
    if (bookingCount >= 2) return 'Silver';
    return 'Bronze';
  };
  
  // Get color for the loyalty badge
  const getLoyaltyBadgeColor = (level: string) => {
    switch (level) {
      case 'Platinum':
        return 'bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400';
      case 'Gold':
        return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400';
      case 'Silver':
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400';
      default:
        return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400';
    }
  };

  const userLevel = getUserLevel(user);
  const badgeColor = getLoyaltyBadgeColor(userLevel);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="flex-1 text-center md:text-left">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div>
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Profile Picture */}
        <div className="relative group">
          <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-800 shadow-md">
            <AvatarImage src={user?.profileImage} alt={user?.name} />
            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
              {user?.name?.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <button 
            className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            onClick={onEdit}
          >
            <Edit className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* User Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <Badge className={`${badgeColor} ml-0 md:ml-2`}>
              {userLevel} Member
            </Badge>
          </div>
          
          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600 dark:text-gray-400">
              <Mail className="h-4 w-4" />
              <span>{user?.email}</span>
            </div>
            {user?.phone && (
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600 dark:text-gray-400">
                <Phone className="h-4 w-4" />
                <span>{user?.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Edit Profile Button */}
        <Button onClick={onEdit} className="shrink-0">
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>
    </motion.div>
  );
} 