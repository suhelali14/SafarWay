import { useState } from 'react';
import { Check, Bell, BellOff, BadgeCheck, AlertTriangle, Ban } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { useToast } from '../../../hooks/use-toast';
import { useAuth } from '../../../contexts/AuthContext';
import { agencyPublicService, AgencyPublicDetails } from '../../../services/api/agencyPublicService';

interface AgencyHeaderProps {
  agency: AgencyPublicDetails;
  className?: string;
}

const AgencyHeader = ({ agency, className = '' }: AgencyHeaderProps) => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [isSubscribed, setIsSubscribed] = useState(agency.isSubscribed || false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscriptionToggle = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to subscribe to this agency",
        variant: "destructive"
      });
      // Redirect to login page with return URL
      window.location.href = `/login?returnUrl=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    try {
      setIsLoading(true);

      if (isSubscribed) {
        await agencyPublicService.unsubscribeFromAgency(agency.id);
        toast({
          title: "Unsubscribed",
          description: `You won't receive updates from ${agency.name}`,
        });
      } else {
        await agencyPublicService.subscribeToAgency(agency.id);
        toast({
          title: "Subscribed!",
          description: `You'll now receive updates from ${agency.name}`,
        });
      }

      setIsSubscribed(!isSubscribed);
    } catch (error) {
      console.error('Error toggling subscription:', error);
      toast({
        title: "Error",
        description: "Failed to update subscription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch (agency.verificationStatus) {
      case 'VERIFIED':
        return (
          <Badge className="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-200">
            <BadgeCheck className="w-4 h-4" />
            Verified
          </Badge>
        );
      case 'UNVERIFIED':
        return (
          <Badge className="flex items-center gap-1 bg-amber-100 text-amber-800 hover:bg-amber-200">
            <AlertTriangle className="w-4 h-4" />
            Unverified
          </Badge>
        );
      case 'SUSPENDED':
        return (
          <Badge className="flex items-center gap-1 bg-red-100 text-red-800 hover:bg-red-200">
            <Ban className="w-4 h-4" />
            Suspended
          </Badge>
        );
      default:
        return null;
    }
  };

  const defaultCoverImage = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1920&auto=format&fit=crop";

  return (
    <div className={`rounded-xl overflow-hidden shadow-md bg-white ${className}`}>
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 lg:h-80 w-full">
        <img 
          src={agency.coverImage || defaultCoverImage} 
          alt={`${agency.name} cover`}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
        
        {/* Agency logo */}
        <div className="absolute -bottom-16 left-8 border-4 border-white rounded-full bg-white shadow-md">
          <img 
            src={agency.logo || "https://ui-avatars.com/api/?name=" + encodeURIComponent(agency.name)}
            alt={`${agency.name} logo`}
            className="w-32 h-32 rounded-full object-cover"
          />
        </div>
        
        {/* Subscribe button */}
        <div className="absolute bottom-4 right-4">
          <Button
            className={`relative overflow-hidden ${isSubscribed ? 'bg-white text-primary hover:bg-gray-100' : ''}`}
            variant={isSubscribed ? "outline" : "default"}
            size="sm"
            onClick={handleSubscriptionToggle}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : isSubscribed ? (
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                Subscribed
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Subscribe to stay updated
              </span>
            )}
          </Button>
        </div>
      </div>
      
      {/* Agency Info */}
      <div className="pt-20 pb-6 px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <motion.h1 
            className="text-2xl md:text-3xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {agency.name}
          </motion.h1>
          
          {getStatusBadge()}
        </div>
        
        <motion.p 
          className="mt-3 text-gray-600 max-w-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {agency.description || "No description provided."}
        </motion.p>
      </div>
    </div>
  );
};

export default AgencyHeader; 