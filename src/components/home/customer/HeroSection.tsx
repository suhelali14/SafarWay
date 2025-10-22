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

// Hero banner images
const heroBanners = [
  {
    url: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=2080&auto=format&fit=crop',
    alt: 'Beach destination',
    caption: 'Discover Paradise',
  },
  {
    url: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=2070&auto=format&fit=crop',
    alt: 'Mountain adventure',
    caption: 'Seek Adventure',
  },
  {
    url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=2070&auto=format&fit=crop',
    alt: 'Cultural experience',
    caption: 'Experience Culture',
  },
  {
    url: 'https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?q=80&w=1965&auto=format&fit=crop',
    alt: 'Wildlife safari',
    caption: 'Wildlife Encounters',
  },
];

// Popular destinations
const popularDestinations = [
  'Bali', 'Paris', 'Tokyo', 'New York', 'Maldives',
  'Barcelona', 'Santorini', 'Kyoto', 'Cape Town', 'Dubai',
];

export function HeroSection() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({ from: undefined, to: undefined });
  const [guests, setGuests] = useState<string>('2');
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Banner rotation
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % heroBanners.length);
    }, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.append('destination', destination);
    if (dateRange.from) params.append('checkIn', format(dateRange.from, 'yyyy-MM-dd'));
    if (dateRange.to) params.append('checkOut', format(dateRange.to, 'yyyy-MM-dd'));
    if (guests) params.append('guests', guests);
    navigate(`/packages?${params.toString()}`);
  };

  // Select popular destination
  const selectPopularDestination = (dest: string) => {
    setDestination(dest);
  };

  const currentBanner = heroBanners[currentBannerIndex];

  return (
    <section className="relative h-[100vh] min-h-[550px] w-full overflow-hidden bg-gray-900 pt-12">
      {/* Background Image */}
      <motion.div
        key={currentBannerIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${currentBanner.url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            {currentBanner.caption}
          </h1>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg relative pb-10"
        >
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              {/* Destination */}
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <Input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Where to?"
                  className="pl-10 py-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
                />
              </div>

              {/* Date Range */}
              <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left py-3 bg-gray-100 border-none rounded-lg hover:bg-gray-200 text-gray-900"
                    >
                      <CalendarIcon className="mr-2 h-5 w-5 text-gray-500" />
                      {dateRange.from && dateRange.to
                        ? `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd')}`
                        : 'Check-in - Check-out'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="range"
                      selected={dateRange as { from: Date; to?: Date }}
                      onSelect={(range) => setDateRange(range || {})}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Guests */}
              <div className="relative">
                <Users className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <Select value={guests} onValueChange={setGuests}>
                  <SelectTrigger className="pl-10 py-3 bg-gray-100 border-none rounded-lg text-gray-900">
                    <SelectValue placeholder="Guests" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Search Button */}
            <div className="flex justify-center absolute -bottom-5 left-1/2 transform -translate-x-1/2 ">
              <Button
                type="submit"
                className="w-full md:w-48 bg-orange-500 text-white hover:bg-orange-500/95 rounded-full py-3"
              >
                <Search className="mr-2 h-5 w-5" />
                Search
              </Button>
            </div>
          </form>

          {/* Popular Destinations */}
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {popularDestinations.slice(0, 5).map((dest) => (
              <button
                key={dest}
                onClick={() => selectPopularDestination(dest)}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                {dest}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2">
        {heroBanners.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-all ${
              index === currentBannerIndex ? 'bg-white scale-125' : 'bg-white/50'
            }`}
            onClick={() => setCurrentBannerIndex(index)}
          />
        ))}
      </div>
    </section>
  );
}