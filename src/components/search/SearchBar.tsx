import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from '../ui/calendar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { 
  CalendarIcon, 
  Search, 
  Users, 
  MapPin, 
  Package,
  ChevronDown,
  Plus,
  Minus,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../utils/cn';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface SearchBarProps {
  variant?: 'default' | 'hero';
  className?: string;
  initialLocation?: string;
  initialStartDate?: Date | null;
  initialEndDate?: Date | null;
  initialGuests?: number;
  initialPackageType?: string;
  onSearch?: (searchParams: any) => void;
}

const PACKAGE_TYPES = [
  { value: 'all', label: 'All Package Types' },
  { value: 'adventure', label: 'Adventure Tours' },
  { value: 'family', label: 'Family Packages' },
  { value: 'honeymoon', label: 'Honeymoon Specials' },
  { value: 'business', label: 'Business Travel' },
  { value: 'solo', label: 'Solo Traveler' },
];

export function SearchBar({
  variant = 'default',
  className = '',
  initialLocation = '',
  initialStartDate = null,
  initialEndDate = null,
  initialGuests = 1,
  initialPackageType = 'all',
  onSearch
}: SearchBarProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [location, setLocation] = useState(initialLocation);
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate);
  const [guests, setGuests] = useState(initialGuests);
  const [packageType, setPackageType] = useState(initialPackageType);
  const [showGuestCounter, setShowGuestCounter] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const locationInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (locationInputRef.current) {
      locationInputRef.current.focus();
    }
  }, []);

  const handleSearch = async () => {
    if (!location) {
      toast.error('Please enter a destination');
      return;
    }

    if (!startDate || !endDate) {
      toast.error('Please select both check-in and check-out dates');
      return;
    }

    setIsSearching(true);

    const searchParams = {
      location,
      startDate,
      endDate,
      guests,
      packageType
    };

    if (onSearch) {
      onSearch(searchParams);
    }

    if (!isAuthenticated) {
      navigate('/login', { 
        state: { 
          from: '/packages', 
          searchParams,
          message: 'Please log in to continue your search' 
        } 
      });
      return;
    }

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      navigate('/packages', { state: searchParams });
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const incrementGuests = () => {
    setGuests(prev => Math.min(prev + 1, 20));
  };

  const decrementGuests = () => {
    setGuests(prev => Math.max(prev - 1, 1));
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-xl bg-white/5 p-6 backdrop-blur-md',
        variant === 'hero' && 'shadow-2xl',
        className
      )}
    >
      {/* Search Fields Container */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Destination */}
        <div className="lg:col-span-4">
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              ref={locationInputRef}
              type="text"
              placeholder="Where would you like to go?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={cn(
                'h-14 rounded-xl border-0 bg-white/10 pl-12 text-lg font-medium shadow-none transition-colors placeholder:text-gray-400 focus:bg-white/20 focus:ring-0',
                variant === 'hero' && 'text-white placeholder:text-gray-300'
              )}
            />
          </div>
        </div>

        {/* Dates Container */}
        <div className="flex gap-2 lg:col-span-2">
          {/* Check-in Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'h-14 flex-1 justify-start rounded-xl border-0 bg-white/10 font-medium shadow-none transition-colors hover:bg-white/20',
                  variant === 'hero' && 'text-white hover:text-white'
                )}
              >
                <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
                <div className="text-left">
                  <div className="text-xs text-gray-400">Check-in</div>
                  <div className="text-sm">
                    {startDate ? format(startDate, 'MMM dd') : 'Select date'}
                  </div>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>

          {/* Check-out Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'h-14 flex-1 justify-start rounded-xl border-0 bg-white/10 font-medium shadow-none transition-colors hover:bg-white/20',
                  variant === 'hero' && 'text-white hover:text-white'
                )}
              >
                <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
                <div className="text-left">
                  <div className="text-xs text-gray-400">Check-out</div>
                  <div className="text-sm">
                    {endDate ? format(endDate, 'MMM dd') : 'Select date'}
                  </div>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
                disabled={(date) =>
                  startDate ? date < startDate : date < new Date()
                }
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Package Type & Guests */}
        <div className="flex gap-2">
          {/* Package Type */}
          <Select value={packageType} onValueChange={setPackageType}>
            <SelectTrigger className={cn(
              "h-14 flex-1 rounded-xl border-0 bg-white/10 font-medium shadow-none transition-colors hover:bg-white/20",
              variant === 'hero' && 'text-white hover:text-white'
            )}>
              <div className="flex items-center">
                <Package className="mr-2 h-5 w-5 text-gray-400" />
                <div className="text-left">
                  <div className="text-xs text-gray-400">Package</div>
                  <div className="text-sm truncate">
                    {PACKAGE_TYPES.find(t => t.value === packageType)?.label.split(' ')[0] || 'Select type'}
                  </div>
                </div>
              </div>
            </SelectTrigger>
            <SelectContent>
              {PACKAGE_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Guests Counter */}
          <div className="relative">
            <Button
              variant="outline"
              className={cn(
                'h-14 w-[120px] justify-between rounded-xl border-0 bg-white/10 font-medium shadow-none transition-colors hover:bg-white/20',
                variant === 'hero' && 'text-white hover:text-white'
              )}
              onClick={() => setShowGuestCounter(!showGuestCounter)}
            >
              <div className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-gray-400" />
                <div className="text-left">
                  <div className="text-xs text-gray-400">Guests</div>
                  <div className="text-sm">{guests}</div>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </Button>
            
            {showGuestCounter && (
              <div className={cn(
                "absolute right-0 top-16 z-10 w-[200px] rounded-xl border border-gray-100 bg-white p-4 shadow-xl",
                variant === 'hero' && 'bg-white/95 backdrop-blur-sm'
              )}>
                <div className="mb-4">
                  <div className="mb-2 text-sm font-semibold text-gray-900">Number of Guests</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Adults</span>
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 rounded-full"
                        onClick={decrementGuests}
                        disabled={guests <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-6 text-center font-medium">{guests}</span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 rounded-full"
                        onClick={incrementGuests}
                        disabled={guests >= 20}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <Button 
                  className="w-full"
                  onClick={() => setShowGuestCounter(false)}
                >
                  Apply
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Button */}
      <Button
        onClick={handleSearch}
        disabled={isSearching}
        className={cn(
          'mt-2 h-14 w-full rounded-xl bg-[#ff6200] text-lg font-semibold text-white transition-all hover:bg-[#ff6200]/90 disabled:opacity-50 md:mt-0 md:w-auto md:px-12',
          variant === 'hero' && 'bg-white text-[#ff6200] hover:bg-white/90'
        )}
      >
        {isSearching ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Search className="mr-2 h-5 w-5" />
        )}
        Find Packages
      </Button>
    </div>
  );
} 