import {  useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './use-toast';

export function useProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch complete user profile
  const {
    data: profileData,
    isLoading,
    error,
    refetch
  } = useQuery({
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

  // Fetch user bookings
  const {
    data: bookingsData,
    isLoading: isLoadingBookings,
  } = useQuery({
    queryKey: ['userBookings', user?.id],
    queryFn: async () => {
      try {
        const response = await customerAPI.getMyBookings();
        return response.data;
      } catch (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData: any) => {
            if (!user?.id) throw new Error("User ID is undefined");
            const response = await customerAPI.updateCustomer(updatedData, { id: user.id });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    onError: (error) => {
      toast({
        title: "Error updating profile",
        description: "There was an error updating your profile",
        variant: "destructive",
      });
      console.error('Error updating profile:', error);
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (_passwords: {
      currentPassword: string;
      newPassword: string;
    }) => {
      // This would call the API endpoint for password change
      // For now, we'll simulate a successful response
      await new Promise(resolve => setTimeout(resolve, 800));
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error changing password",
        description: "There was an error changing your password",
        variant: "destructive",
      });
      console.error('Error changing password:', error);
    },
  });

  // Update notification preferences mutation
  const updateNotificationsMutation = useMutation({
    mutationFn: async (preferences: any) => {
      // This would call the API endpoint for notification preferences
      // For now, we'll simulate a successful response
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, data: preferences };
    },
    onSuccess: () => {
      toast({
        title: "Preferences updated",
        description: "Your notification preferences have been saved",
      });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    onError: (error) => {
      toast({
        title: "Error updating preferences",
        description: "There was an error saving your notification preferences",
        variant: "destructive",
      });
      console.error('Error updating preferences:', error);
    },
  });

  // Subscribe/unsubscribe to agency mutation
  const toggleAgencySubscriptionMutation = useMutation({
    mutationFn: async ({ subscribed }: { subscribed: boolean }) => {
      // This would call the API endpoint for agency subscription
      // For now, we'll simulate a successful response
      await new Promise(resolve => setTimeout(resolve, 700));
      return { success: true, subscribed };
    },
    onSuccess: (_data, variables) => {
      toast({
        title: variables.subscribed ? "Subscribed" : "Unsubscribed",
        description: variables.subscribed
          ? "You are now subscribed to this agency"
          : "You have unsubscribed from this agency",
      });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "There was an error updating your subscription",
        variant: "destructive",
      });
      console.error('Error updating subscription:', error);
    },
  });

  // Review management mutations
  const updateReviewMutation = useMutation({
    mutationFn: async ({ reviewId, text, rating }: { reviewId: string; text: string; rating?: number }) => {
      // This would call the API endpoint for review update
      // For now, we'll simulate a successful response
      await new Promise(resolve => setTimeout(resolve, 600));
      return { success: true, id: reviewId, text, rating };
    },
    onSuccess: () => {
      toast({
        title: "Review updated",
        description: "Your review has been successfully updated",
      });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    onError: (error) => {
      toast({
        title: "Error updating review",
        description: "There was an error updating your review",
        variant: "destructive",
      });
      console.error('Error updating review:', error);
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async (_reviewId: string) => {
      // This would call the API endpoint for review deletion
      // For now, we'll simulate a successful response
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Review deleted",
        description: "Your review has been successfully deleted",
      });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    onError: (error) => {
      toast({
        title: "Error deleting review",
        description: "There was an error deleting your review",
        variant: "destructive",
      });
      console.error('Error deleting review:', error);
    },
  });

  // Handle errors in React Query
  useEffect(() => {
    if (error) {
      toast({
        title: "Error fetching profile",
        description: "Could not load your profile data. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return {
    profileData,
    isLoading,
    bookingsData,
    isLoadingBookings,
    refetch,
    updateProfile: updateProfileMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isPending,
    changePassword: changePasswordMutation.mutate,
    isChangingPassword: changePasswordMutation.isPending,
    updateNotifications: updateNotificationsMutation.mutate,
    isUpdatingNotifications: updateNotificationsMutation.isPending,
    toggleAgencySubscription: toggleAgencySubscriptionMutation.mutate,
    isTogglingSubscription: toggleAgencySubscriptionMutation.isPending,
    updateReview: updateReviewMutation.mutate,
    isUpdatingReview: updateReviewMutation.isPending,
    deleteReview: deleteReviewMutation.mutate,
    isDeletingReview: deleteReviewMutation.isPending,
  };
} 