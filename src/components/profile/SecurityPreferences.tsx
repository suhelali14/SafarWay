import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Skeleton } from '../ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Shield, Bell, Mail, MessageSquare, LockKeyhole, SmartphoneNfc, Github, Twitter, UserCircle } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

interface SecurityPreferencesProps {
  data: any;
  isLoading: boolean;
}

export function SecurityPreferences({ data, isLoading }: SecurityPreferencesProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('security');
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // Notification preferences state
  const [notificationPreferences, setNotificationPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appNotifications: true,
    marketingEmails: false,
    packageAlerts: true,
    bookingUpdates: true,
    promotionalOffers: false,
    newsletterSubscription: true,
  });
  
  // OAuth connections state (for demonstration)
  const [connectedAccounts] = useState({
    google: true,
    github: false,
    twitter: false,
  });
  
  // Function to handle password change
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    // Reset form and show success message
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
    });
  };
  
  // Function to handle notification preference change
  const handleNotificationToggle = (key: string) => {
    setNotificationPreferences(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
    
    toast({
      title: "Preferences updated",
      description: "Your notification preferences have been saved.",
    });
  };
  
  // Link/unlink social account
  const toggleSocialAccount = (provider: string) => {
    toast({
      title: connectedAccounts[provider as keyof typeof connectedAccounts] 
        ? `Disconnected ${provider} account` 
        : `Connected ${provider} account`,
      description: connectedAccounts[provider as keyof typeof connectedAccounts]
        ? `Your ${provider} account has been disconnected successfully.`
        : `Your ${provider} account has been connected successfully.`,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full max-w-md mb-4" />
        
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-40 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-9 w-28" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Security tab content
  const renderSecurityContent = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Change Password Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <LockKeyhole className="h-5 w-5 mr-2 text-primary" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input 
                id="current-password" 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input 
                id="new-password" 
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input 
                id="confirm-password" 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {passwordError && (
              <p className="text-sm text-red-500">{passwordError}</p>
            )}
            <Button type="submit" className="mt-2">
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Connected Accounts Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <SmartphoneNfc className="h-5 w-5 mr-2 text-primary" />
            Connected Accounts
          </CardTitle>
          <CardDescription>
            Manage the accounts you've connected to SafarWay
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserCircle className="h-6 w-6 text-red-500" />
              <div>
                <h4 className="font-medium">Google</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {connectedAccounts.google ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>
            <Button 
              variant={connectedAccounts.google ? "outline" : "default"}
              size="sm"
              onClick={() => toggleSocialAccount('google')}
            >
              {connectedAccounts.google ? 'Disconnect' : 'Connect'}
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Github className="h-6 w-6" />
              <div>
                <h4 className="font-medium">GitHub</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {connectedAccounts.github ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>
            <Button 
              variant={connectedAccounts.github ? "outline" : "default"}
              size="sm"
              onClick={() => toggleSocialAccount('github')}
            >
              {connectedAccounts.github ? 'Disconnect' : 'Connect'}
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Twitter className="h-6 w-6 text-blue-400" />
              <div>
                <h4 className="font-medium">Twitter</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {connectedAccounts.twitter ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>
            <Button 
              variant={connectedAccounts.twitter ? "outline" : "default"}
              size="sm"
              onClick={() => toggleSocialAccount('twitter')}
            >
              {connectedAccounts.twitter ? 'Disconnect' : 'Connect'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  // Notifications tab content
  const renderNotificationsContent = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Notification Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2 text-primary" />
            Notification Channels
          </CardTitle>
          <CardDescription>
            Control how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-blue-500" />
              <div>
                <h4 className="font-medium">Email Notifications</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive notifications via email
                </p>
              </div>
            </div>
            <Switch 
              checked={notificationPreferences.emailNotifications} 
              onCheckedChange={() => handleNotificationToggle('emailNotifications')} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-green-500" />
              <div>
                <h4 className="font-medium">SMS Notifications</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive notifications via SMS
                </p>
              </div>
            </div>
            <Switch 
              checked={notificationPreferences.smsNotifications} 
              onCheckedChange={() => handleNotificationToggle('smsNotifications')} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-purple-500" />
              <div>
                <h4 className="font-medium">App Notifications</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive in-app notifications
                </p>
              </div>
            </div>
            <Switch 
              checked={notificationPreferences.appNotifications} 
              onCheckedChange={() => handleNotificationToggle('appNotifications')} 
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Types</CardTitle>
          <CardDescription>
            Manage what types of notifications you receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Booking Updates</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Receive updates about your bookings
              </p>
            </div>
            <Switch 
              checked={notificationPreferences.bookingUpdates} 
              onCheckedChange={() => handleNotificationToggle('bookingUpdates')} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">New Package Alerts</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Be notified when agencies you follow add new packages
              </p>
            </div>
            <Switch 
              checked={notificationPreferences.packageAlerts} 
              onCheckedChange={() => handleNotificationToggle('packageAlerts')} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Promotional Offers</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Receive special offers and discounts
              </p>
            </div>
            <Switch 
              checked={notificationPreferences.promotionalOffers} 
              onCheckedChange={() => handleNotificationToggle('promotionalOffers')} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Newsletter Subscription</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Receive our monthly travel newsletter
              </p>
            </div>
            <Switch 
              checked={notificationPreferences.newsletterSubscription} 
              onCheckedChange={() => handleNotificationToggle('newsletterSubscription')} 
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="security" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>
        
        {/* Security Content */}
        <TabsContent value="security">
          {renderSecurityContent()}
        </TabsContent>
        
        {/* Notifications Content */}
        <TabsContent value="notifications">
          {renderNotificationsContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
} 