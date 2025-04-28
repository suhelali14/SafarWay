import { useState, useEffect } from 'react';
import { useToast } from '../../hooks/use-toast';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

import { ProfileHeader } from '../../components/profile/ProfileHeader';
import { AccountOverview } from '../../components/profile/AccountOverview';
import { BookingsTimeline } from '../../components/profile/BookingsTimeline';
import { SubscribedAgencies } from '../../components/profile/SubscribedAgencies';
import { UserReviews } from '../../components/profile/UserReviews';
import { SecurityPreferences } from '../../components/profile/SecurityPreferences';
import { EditProfileModal } from '../../components/profile/EditProfileModal';
import { useQuery } from '@tanstack/react-query';
import { customerAPI } from '../../services/api';
import {  ArrowRight, Calendar, Building2, Star, Shield } from 'lucide-react';

export function UserProfilePage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch complete user profile
  const { data: profileData, isLoading, error, refetch } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      try {
        const response = await customerAPI.getProfile();
        return response.data;
      } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
  });

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error fetching profile",
        description: "Could not load your profile data. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Function to handle profile updates
  const handleProfileUpdate = async () => {
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
    refetch();
    setIsEditModalOpen(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-24 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-20">
              <Card>
                <CardContent className="p-4">
                  <nav className="space-y-2">
                    <Button 
                      variant={activeTab === "overview" ? "default" : "ghost"} 
                      className="w-full justify-start" 
                      onClick={() => setActiveTab("overview")}
                    >
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Overview
                    </Button>
                    <Button 
                      variant={activeTab === "bookings" ? "default" : "ghost"} 
                      className="w-full justify-start" 
                      onClick={() => setActiveTab("bookings")}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      My Bookings
                    </Button>
                    <Button 
                      variant={activeTab === "agencies" ? "default" : "ghost"} 
                      className="w-full justify-start" 
                      onClick={() => setActiveTab("agencies")}
                    >
                      <Building2 className="mr-2 h-4 w-4" />
                      Subscribed Agencies
                    </Button>
                    <Button 
                      variant={activeTab === "reviews" ? "default" : "ghost"} 
                      className="w-full justify-start" 
                      onClick={() => setActiveTab("reviews")}
                    >
                      <Star className="mr-2 h-4 w-4" />
                      My Reviews
                    </Button>
                    <Button 
                      variant={activeTab === "security" ? "default" : "ghost"} 
                      className="w-full justify-start" 
                      onClick={() => setActiveTab("security")}
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Security & Preferences
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <motion.div 
            className="lg:col-span-9"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Header Section (User Summary) */}
            <motion.div variants={itemVariants}>
              <ProfileHeader 
                user={profileData} 
                isLoading={isLoading} 
                onEdit={() => setIsEditModalOpen(true)} 
              />
            </motion.div>

            {/* Mobile Tabs - Only visible on mobile */}
            <div className="mt-6 block lg:hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="bookings">Bookings</TabsTrigger>
                  <TabsTrigger value="agencies">Agencies</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Content Sections */}
            <div className="mt-6 space-y-8">
              {/* Account Overview Section */}
              {(activeTab === "overview" || activeTab === "") && (
                <motion.div variants={itemVariants}>
                  <AccountOverview data={profileData} isLoading={isLoading} />
                  
                  <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">Recent Bookings</h2>
                    <BookingsTimeline 
                      data={profileData?.recentBookings || []} 
                      isLoading={isLoading} 
                      limit={3}
                    />
                    <div className="mt-4 text-right">
                      <Button onClick={() => setActiveTab("bookings")} variant="outline">
                        View All Bookings
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Bookings Timeline Section */}
              {activeTab === "bookings" && (
                <motion.div variants={itemVariants}>
                  <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
                  <BookingsTimeline data={profileData?.bookings  || []} isLoading={isLoading} />
                </motion.div>
              )}

              {/* Subscribed Agencies Section */}
              {activeTab === "agencies" && (
                <motion.div variants={itemVariants}>
                  <h2 className="text-2xl font-bold mb-4">Subscribed Agencies</h2>
                  <SubscribedAgencies data={profileData?.subscribedAgencies || []} isLoading={isLoading} />
                </motion.div>
              )}

              {/* Reviews & Ratings Section */}
              {activeTab === "reviews" && (
                <motion.div variants={itemVariants}>
                  <h2 className="text-2xl font-bold mb-4">My Reviews & Ratings</h2>
                  <UserReviews data={profileData?.reviews || []} isLoading={isLoading} />
                </motion.div>
              )}

              {/* Security & Preferences Section */}
              {activeTab === "security" && (
                <motion.div variants={itemVariants}>
                  <h2 className="text-2xl font-bold mb-4">Security & Preferences</h2>
                  <SecurityPreferences data={profileData} isLoading={isLoading} />
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal 
        user={profileData} 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleProfileUpdate}
      />
    </div>
  );
}

export default UserProfilePage; 