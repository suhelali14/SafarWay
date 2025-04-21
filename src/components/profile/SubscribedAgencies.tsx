import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Skeleton } from '../ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { format } from 'date-fns';
import { Building2, Bell, Eye, Calendar } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface SubscribedAgenciesProps {
  data: any[];
  isLoading: boolean;
}

export function SubscribedAgencies({ data, isLoading }: SubscribedAgenciesProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [subscribedAgencies, setSubscribedAgencies] = useState<any[]>(data || []);
  
  // Function to toggle notifications for an agency
  const toggleNotifications = (agencyId: string) => {
    setSubscribedAgencies(prev => 
      prev.map(agency => 
        agency.id === agencyId 
          ? { ...agency, notificationsEnabled: !agency.notificationsEnabled } 
          : agency
      )
    );
    
    toast({
      title: "Notification preferences updated",
      description: "Your notification settings have been saved.",
    });
  };
  
  // Function to unsubscribe from an agency
  const unsubscribe = (agencyId: string) => {
    // Call API to unsubscribe
    // For now, just update local state
    setSubscribedAgencies(prev => prev.filter(agency => agency.id !== agencyId));
    
    toast({
      title: "Unsubscribed",
      description: "You've successfully unsubscribed from this agency.",
    });
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Unknown date';
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
            <CardFooter>
              <div className="flex justify-between w-full">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-9 w-28" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (!subscribedAgencies || subscribedAgencies.length === 0) {
    return (
      <Card className="bg-gray-50 dark:bg-gray-800/50 border-dashed">
        <CardContent className="py-12">
          <div className="text-center">
            <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Subscribed Agencies</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              You haven't subscribed to any travel agencies yet. Subscribe to get updates on new packages and offers.
            </p>
            <Button onClick={() => navigate('/agencies')}>
              Browse Agencies
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
    >
      {subscribedAgencies.map((agency, index) => (
        <motion.div
          key={agency.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border">
                  <AvatarImage src={agency.logo} alt={agency.name} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {agency.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{agency.name}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Subscribed {formatDate(agency.subscribedDate || agency.createdAt)}</span>
                    </div>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm">Notifications</span>
                </div>
                <Switch 
                  checked={agency.notificationsEnabled} 
                  onCheckedChange={() => toggleNotifications(agency.id)} 
                />
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex justify-between w-full">
                <Button variant="ghost" className="gap-1 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                  onClick={() => unsubscribe(agency.id)}
                >
                  Unsubscribe
                </Button>
                <Button variant="outline" className="gap-1"
                  onClick={() => navigate(`/agency/${agency.id}`)}
                >
                  <Eye className="h-4 w-4" />
                  View Agency
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
} 