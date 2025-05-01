import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

interface WelcomeBannerProps {
  userName: string;
  hasActiveBooking: boolean;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  userName,
  hasActiveBooking,
}) => {
  const navigate = useNavigate();
  
  // Get time of day for greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white mb-8">
      <div className="absolute inset-0 bg-cover bg-center opacity-20" 
        style={{ backgroundImage: "url('/images/travel-bg.jpg')" }} />
      
      <div className="relative z-10">
        <h1 className="text-3xl font-bold mb-2">
          {getTimeBasedGreeting()}, {userName.split(' ')[0]}!
        </h1>
        <p className="text-lg mb-6 text-blue-100">
          {hasActiveBooking 
            ? "Your adventure awaits! Continue with your travel plans."
            : "Let's plan your next unforgettable adventure together."}
        </p>
        
        <Button 
          onClick={() => navigate(hasActiveBooking ? '/bookings' : '/tour-packages')}
          className="bg-white text-blue-700 hover:bg-blue-50 hover:text-blue-800 transition-colors"
        >
          {hasActiveBooking ? 'Continue your trip' : 'Explore Packages'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      <div className="absolute bottom-0 right-0 transform translate-y-1/4 translate-x-1/4">
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="100" fill="rgba(255, 255, 255, 0.1)" />
        </svg>
      </div>
    </div>
  );
};

export default WelcomeBanner; 