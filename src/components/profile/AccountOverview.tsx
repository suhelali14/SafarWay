import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';
import { ArrowRight, Clipboard, Building2, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AccountOverviewProps {
  data: any;
  isLoading: boolean;
}

export function AccountOverview({ data, isLoading }: AccountOverviewProps) {
  const navigate = useNavigate();

  // Animation variants for cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Function to get the last booking status
  const getLastBookingStatus = () => {
    if (!data?.recentBookings?.length) return null;
    
    const lastBooking = data.recentBookings[0];
    let statusColor = '';
    
    switch (lastBooking.status) {
      case 'CONFIRMED':
        statusColor = 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
        break;
      case 'PENDING':
        statusColor = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
        break;
      case 'CANCELLED':
        statusColor = 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
        break;
      case 'COMPLETED':
        statusColor = 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
        break;
      default:
        statusColor = 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
    
    return (
      <Badge className={statusColor}>
        {lastBooking.status.charAt(0).toUpperCase() + lastBooking.status.slice(1).toLowerCase()}
      </Badge>
    );
  };

  // Function to get latest review snippet
  const getLatestReviewSnippet = () => {
    if (!data?.reviews?.length) return null;
    
    const latestReview = data.reviews[0];
    const snippet = latestReview.text.length > 60 
      ? `${latestReview.text.substring(0, 60)}...` 
      : latestReview.text;
    
    return <p className="text-sm text-gray-500 dark:text-gray-400">{snippet}</p>;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-10 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Account Overview</h2>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Total Bookings Card */}
        <motion.div variants={cardVariants}>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>
                <div className="flex items-center">
                  <Clipboard className="h-4 w-4 mr-1 text-primary" />
                  TOTAL BOOKINGS
                </div>
              </CardDescription>
              <CardTitle className="text-3xl font-bold">
                {data?.stats?.totalBookings || 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                  Last booking:
                </span>
                {getLastBookingStatus() || 'No bookings yet'}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="ghost" 
                className="gap-1"
                onClick={() => navigate('/profile/bookings')}
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
        
        {/* Subscribed Agencies Card */}
        <motion.div variants={cardVariants}>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-1 text-primary" />
                  SUBSCRIBED AGENCIES
                </div>
              </CardDescription>
              <CardTitle className="text-3xl font-bold">
                {data?.subscribedAgencies?.length || 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {data?.subscribedAgencies?.length 
                  ? 'Get updates from agencies you follow' 
                  : 'Subscribe to agencies for updates'
                }
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="ghost" 
                className="gap-1"
                onClick={() => navigate('/profile/agencies')}
              >
                View Agencies
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
        
        {/* Reviews Written Card */}
        <motion.div variants={cardVariants}>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1 text-primary" />
                  REVIEWS WRITTEN
                </div>
              </CardDescription>
              <CardTitle className="text-3xl font-bold">
                {data?.reviews?.length || 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getLatestReviewSnippet() || (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No reviews written yet
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="ghost" 
                className="gap-1"
                onClick={() => navigate('/profile/reviews')}
              >
                View All Reviews
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
} 