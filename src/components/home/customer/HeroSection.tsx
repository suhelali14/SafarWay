import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Calendar as CalendarIcon, Search, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '../../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { cn } from '../../../lib/utils';

// Hero banner images
const heroBanners = [
  {
    url: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=2080&auto=format&fit=crop',
    alt: 'Beautiful beach destination',
    caption: 'Discover Paradise',
    subcaption: 'Explore the world\'s most stunning beaches'
  },
  {
    url: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=2070&auto=format&fit=crop',
    alt: 'Mountain adventure',
    caption: 'Seek Adventure',
    subcaption: 'Challenge yourself with breathtaking mountain trails'
  },
  {
    url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=2070&auto=format&fit=crop',
    alt: 'Cultural experience',
    caption: 'Experience Culture',
    subcaption: 'Immerse yourself in rich cultural traditions'
  },
  {
    url: 'https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?q=80&w=1965&auto=format&fit=crop',
    alt: 'Wildlife safari',
    caption: 'Wildlife Encounters',
    subcaption: 'Connect with nature on unforgettable safaris'
  }
];

// Popular destinations for quick selection
const popularDestinations = [
  'Bali', 'Paris', 'Tokyo', 'New York', 'Maldives', 
  'Barcelona', 'Santorini', 'Kyoto', 'Cape Town', 'Dubai'
];

export function HeroSection() {
  const navigate = useNavigate();
  
  // State for search form
  const [destination, setDestination] = useState<string>('');
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState<string>('2');
  
  // State for banner rotation
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle banner rotation
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentBannerIndex(prev => (prev + 1) % heroBanners.length);
        setIsFading(false);
      }, 500);
    }, 6000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build query parameters
    const params = new URLSearchParams();
    if (destination) params.append('destination', destination);
    if (checkInDate) params.append('checkIn', format(checkInDate, 'yyyy-MM-dd'));
    if (checkOutDate) params.append('checkOut', format(checkOutDate, 'yyyy-MM-dd'));
    if (guests) params.append('guests', guests);
    
    // Navigate to packages page with search params
    navigate(`/packages?${params.toString()}`);
  };

  // Quick select popular destination
  const selectPopularDestination = (destination: string) => {
    setDestination(destination);
  };

  const currentBanner = heroBanners[currentBannerIndex];

  return (
    <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
      {/* Background image with fade transition */}
      
      {/* Content container */}
      <div className="container relative z-10 mx-auto flex h-full flex-col items-center justify-center px-4 text-black ">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl text-center"
        >
          <h1 className="mb-4 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            {currentBanner.caption}
          </h1>
          <p className="mb-8 text-xl md:text-2xl text-black/90">
            {currentBanner.subcaption}
          </p>
        </motion.div>

        {/* Search container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="w-full max-w-5xl"
        >
          <div className="rounded-xl bg-white/10 backdrop-blur-lg p-6 shadow-lg pb-10 pt-10">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Destination Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Where to?</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-black" />
                    <Input
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="Destination or attraction"
                      className="bg-white/20 border-black/30 pl-10 text-black placeholder:text-black/70"
                    />
                  </div>
                </div>

                {/* Check-in Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Check-in</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full bg-white/20 border-black/30 text-left font-normal",
                          !checkInDate && "text-black/70"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-black" />
                        {checkInDate ? format(checkInDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={checkInDate}
                        onSelect={setCheckInDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Check-out Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Check-out</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full bg-white/20 border-black/30 text-left font-normal",
                          !checkOutDate && "text-black/70"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-black" />
                        {checkOutDate ? format(checkOutDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={checkOutDate}
                        onSelect={setCheckOutDate}
                        initialFocus
                        disabled={(date) => (checkInDate && date < checkInDate) || date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Guests */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Guests</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-2.5 h-5 w-5 text-black" />
                    <Select value={guests} onValueChange={setGuests}>
                      <SelectTrigger className="bg-white/20 border-black/30 pl-10 text-black">
                        <SelectValue placeholder="Number of guests" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <Button 
                  type="submit" 
                  size="xl" 
                  className="w-full bg-orange-500 text-white hover:bg-orange-500/95 md:w-auto rounded-full  absolute -bottom-7"
                >
                  <Search className="mr-2 h-5 w-5 text-white" />
                  Search Packages
                </Button>
                
                {/* Popular destinations tags */}
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  <span className="text-sm text-black/90">Popular:</span>
                  {popularDestinations.slice(0, 5).map((dest) => (
                    <button
                      key={dest}
                      type="button"
                      onClick={() => selectPopularDestination(dest)}
                      className="rounded-full bg-white/20 px-3 py-1 text-xs transition-colors hover:bg-white/30"
                    >
                      {dest}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Banner pagination dots */}
      <div className="absolute bottom-6 left-0 right-0 z-10 flex justify-center space-x-2">
        {heroBanners.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${
              index === currentBannerIndex ? 'bg-black' : 'bg-black/40'
            }`}
            onClick={() => {
              setIsFading(true);
              setTimeout(() => {
                setCurrentBannerIndex(index);
                setIsFading(false);
              }, 500);
            }}
          />
        ))}
      </div>
    </section>
  );
} 