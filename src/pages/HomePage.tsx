import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Calendar } from '../components/ui/calendar';
import { CalendarIcon, MapPin, Users, Search } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import CustomerHomePage from './customer/HomePage';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Stays');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [guests, setGuests] = useState(4);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user role - except for customers who stay on the home page
      if (user.role === 'AGENCY_ADMIN' || user.role === 'AGENCY_USER') {
        navigate('/agency/dashboard');
      } else if (user.role === 'SAFARWAY_ADMIN' || user.role === 'SAFARWAY_USER') {
        navigate('/admin/dashboard');
      }
      // Customers stay on this page, but we render CustomerHomePage for them
    }
  }, [isAuthenticated, navigate, user]);

  // If the user is authenticated and has CUSTOMER role, render the CustomerHomePage
  if (isAuthenticated && user?.role === 'CUSTOMER') {
    return <CustomerHomePage />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>SafarWay - Your Gateway to Unforgettable Travel Experiences</title>
        <meta
          name="description"
          content="Discover amazing travel packages, tours, and adventures with SafarWay. Book your next unforgettable journey today!"
        />
      </Helmet>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-6 px-10 bg-transparent text-black">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM12 4C16.411 4 20 7.589 20 12C20 16.411 16.411 20 12 20C7.589 20 4 16.411 4 12C4 7.589 7.589 4 12 4ZM10 9L14 12L10 15V9Z" fill="currentColor"/>
            </svg>
            <span className="text-xl font-bold">.fis</span>
          </Link>
          <div className="relative">
            <Button variant="ghost" className="flex items-center space-x-1">
              <span>Travelers</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>
          </div>
        </div>
        <nav className="flex items-center space-x-6">
          <Button variant="ghost" className="flex items-center space-x-1">
            <span>Templates</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Button>
          <Button variant="ghost">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 2C5.589 2 2 5.589 2 10C2 14.411 5.589 18 10 18C14.411 18 18 14.411 18 10C18 5.589 14.411 2 10 2ZM10 4C13.313 4 16 6.687 16 10C16 13.313 13.313 16 10 16C6.687 16 4 13.313 4 10C4 6.687 6.687 4 10 4ZM10 6C8.895 6 8 6.895 8 8C8 9.105 8.895 10 10 10C11.105 10 12 9.105 12 8C12 6.895 11.105 6 10 6Z" fill="currentColor"/>
            </svg>
          </Button>
          <Button variant="outline" className="rounded-full px-4 py-2">List your property</Button>
          <Button variant="ghost" className="relative p-2 rounded-full">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 2C5.589 2 2 5.589 2 10C2 14.411 5.589 18 10 18C14.411 18 18 14.411 18 10C18 5.589 14.411 2 10 2ZM10 4C13.313 4 16 6.687 16 10C16 13.313 13.313 16 10 16C6.687 16 4 13.313 4 10C4 6.687 6.687 4 10 4ZM10 6C8.895 6 8 6.895 8 8C8 9.105 8.895 10 10 10C11.105 10 12 9.105 12 8C12 6.895 11.105 6 10 6Z" fill="currentColor"/>
            </svg>
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>
          <div className="flex items-center space-x-2">
            <img src="https://via.placeholder.com/30" alt="User Avatar" className="w-8 h-8 rounded-full" />
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative flex flex-col items-center justify-center min-h-screen pt-20 px-10">
        <div className="grid grid-cols-2 gap-8 w-full max-w-7xl">
          {/* Left Content */}
          <div className="flex flex-col justify-center">
            <h1 className="text-6xl font-bold leading-tight mb-4">Hotel, car, <br /> experiences</h1>
            <p className="text-xl text-gray-700 mb-8 max-w-md">With us, your trip is filled with amazing experiences.</p>
            <Button className="w-fit px-8 py-3 bg-black text-white rounded-full text-lg">Start your search</Button>

            {/* Search Bar */}
            <div className="mt-16 bg-white p-6 rounded-3xl shadow-lg w-full">
              <div className="flex space-x-6 mb-6">
                {['Stays', 'Experiences', 'Cars', 'Real Estates', 'Flights'].map((tab) => (
                  <Button
                    key={tab}
                    variant="ghost"
                    className={`text-lg font-semibold ${activeTab === tab ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </Button>
                ))}
              </div>
              <div className="flex items-center rounded-full divide-x divide-gray-200 overflow-hidden bg-gray-100">
                {/* Location Input */}
                <div className="flex-1 flex items-center p-3 pl-6">
                  <MapPin className="text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <Input placeholder="Where are you going?" className="bg-transparent border-none p-0 focus-visible:ring-0 text-base" />
                  </div>
                </div>

                {/* Date Range Input */}
                <div className="flex-1 flex items-center p-3">
                  <CalendarIcon className="text-gray-500 mr-2" />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"ghost"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateRange.from && "text-muted-foreground"
                        )}
                      >
                        {dateRange.from ? (
                          dateRange.to ? (
                            <>{format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd")}</>
                          ) : (
                            format(dateRange.from, "MMM dd")
                          )
                        ) : (
                          <span>Feb 06 - Feb 23</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={dateRange as { from: Date; to?: Date }}
                        onSelect={(range) => setDateRange(range || {})}
                        numberOfMonths={2}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Guests Input */}
                <div className="flex-1 flex items-center p-3">
                  <Users className="text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">{guests} Guests</p>
                    <Input type="number" value={guests} onChange={(e) => setGuests((prevGuests) => parseInt(e.target.value) || 0)} className="bg-transparent border-none p-0 focus-visible:ring-0 text-base" />
                  </div>
                </div>

                {/* Search Button */}
                <Button
                  type="submit"
                  size="icon"
                  className="h-16 w-16 bg-purple-600 text-white rounded-full shrink-0"
                >
                  <Search className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Images */}
          <div className="relative flex items-center justify-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gray-200 rounded-lg overflow-hidden shadow-lg transform translate-x-1/4 -translate-y-1/4">
              <img src="https://via.placeholder.com/300x200?text=Image+1" alt="Travel Image 1" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-0 left-0 w-80 h-96 bg-gray-300 rounded-lg overflow-hidden shadow-lg transform -translate-x-1/4 translate-y-1/4">
              <img src="https://via.placeholder.com/400x300?text=Image+2" alt="Travel Image 2" className="w-full h-full object-cover" />
            </div>
            <div className="w-full h-full bg-gray-400 rounded-lg overflow-hidden shadow-lg">
              <img src="https://via.placeholder.com/500x400?text=Image+3" alt="Travel Image 3" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage; 