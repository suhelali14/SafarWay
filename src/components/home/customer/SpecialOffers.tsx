import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';

// Types for offers
type OfferType = 'flash' | 'seasonal' | 'package' | 'group';
type CountdownType = { days: number; hours: number; minutes: number; seconds: number };

interface Offer {
  id: string;
  title: string;
  description: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  location: string;
  duration: string;
  type: OfferType;
  groupSize?: string;
  endDate: Date;
}

// Sample offers data
const offers: Offer[] = [
  {
    id: 'offer-1',
    title: 'Summer Escape to Maldives',
    description: 'Enjoy pristine beaches and crystal-clear waters with our all-inclusive package',
    image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80',
    originalPrice: 2499,
    discountedPrice: 1899,
    discountPercentage: 24,
    location: 'Maldives',
    duration: '7 days',
    type: 'flash',
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
  },
  {
    id: 'offer-2',
    title: 'Cultural Tour of Morocco',
    description: 'Explore historic cities, bustling markets, and the stunning Atlas Mountains',
    image: 'https://images.unsplash.com/photo-1539020140153-e8c8d4592e7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80',
    originalPrice: 1899,
    discountedPrice: 1499,
    discountPercentage: 21,
    location: 'Morocco',
    duration: '10 days',
    type: 'seasonal',
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
  },
  {
    id: 'offer-3',
    title: 'Family Adventure in Costa Rica',
    description: 'Rainforest exploration, wildlife watching, and beach relaxation for the whole family',
    image: 'https://images.unsplash.com/photo-1518182170546-07661fd94144?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80',
    originalPrice: 3299,
    discountedPrice: 2799,
    discountPercentage: 15,
    location: 'Costa Rica',
    duration: '12 days',
    type: 'package',
    groupSize: 'Family (2-5)',
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
  },
  {
    id: 'offer-4',
    title: 'Greece Island Hopping',
    description: 'Visit Santorini, Mykonos, and Athens with guided tours and luxury accommodations',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80',
    originalPrice: 2199,
    discountedPrice: 1749,
    discountPercentage: 20,
    location: 'Greece',
    duration: '9 days',
    type: 'group',
    groupSize: '8-12 people',
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  }
];

// Badge colors by offer type
const offerTypeColors: Record<OfferType, string> = {
  flash: 'bg-red-100 text-red-800 border-red-200',
  seasonal: 'bg-amber-100 text-amber-800 border-amber-200',
  package: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  group: 'bg-blue-100 text-blue-800 border-blue-200'
};

// Offer type display names
const offerTypeNames: Record<OfferType, string> = {
  flash: 'Flash Sale',
  seasonal: 'Seasonal Offer',
  package: 'Package Deal',
  group: 'Group Discount'
};

export function SpecialOffers() {
  const navigate = useNavigate();
  const [countdowns, setCountdowns] = useState<Record<string, CountdownType>>({});
  const [activeFilter, setActiveFilter] = useState<OfferType | 'all'>('all');
  
  // Filter offers based on active filter
  const filteredOffers = activeFilter === 'all' 
    ? offers 
    : offers.filter(offer => offer.type === activeFilter);

  // Calculate time remaining for each offer
  useEffect(() => {
    const timer = setInterval(() => {
      const newCountdowns: Record<string, CountdownType> = {};
      
      offers.forEach(offer => {
        const now = new Date().getTime();
        const endTime = new Date(offer.endDate).getTime();
        const timeRemaining = endTime - now;
        
        if (timeRemaining > 0) {
          const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
          
          newCountdowns[offer.id] = { days, hours, minutes, seconds };
        } else {
          newCountdowns[offer.id] = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
      });
      
      setCountdowns(newCountdowns);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Handle booking an offer
  const handleBookNow = (offerId: string) => {
    // Navigate to the booking page with the offer ID
    navigate(`/booking/${offerId}`);
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-3xl font-bold">Special Offers</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Limited-time deals and exclusive packages to make your dream vacation more affordable
          </p>
        </div>
        
        {/* Filter tabs */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          <Button
            variant={activeFilter === 'all' ? 'default' : 'outline'}
            className="rounded-full"
            onClick={() => setActiveFilter('all')}
          >
            All Offers
          </Button>
          {Object.entries(offerTypeNames).map(([type, name]) => (
            <Button
              key={type}
              variant={activeFilter === type ? 'default' : 'outline'}
              className="rounded-full"
              onClick={() => setActiveFilter(type as OfferType)}
            >
              {name}
            </Button>
          ))}
        </div>
        
        {/* Offers grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {filteredOffers.map((offer) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="relative">
                  {/* Discount badge */}
                  <div className="absolute left-0 top-4 z-10 rounded-r-lg bg-primary px-3 py-1 text-xs font-bold text-white shadow-md">
                    {offer.discountPercentage}% OFF
                  </div>
                  
                  {/* Offer type badge */}
                  <Badge 
                    className={`absolute right-3 top-4 z-10 ${offerTypeColors[offer.type]}`}
                    label= {offerTypeNames[offer.type]}
                  >
                   
                  </Badge>
                  
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>
                
                <CardContent className="p-5">
                  <h3 className="mb-2 text-xl font-bold">{offer.title}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">{offer.description}</p>
                  
                  <div className="mb-4 flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-primary" />
                    <span className="text-sm">{offer.location}</span>
                  </div>
                  
                  <div className="mb-4 flex flex-wrap gap-3 text-sm">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>{offer.duration}</span>
                    </div>
                    
                    {offer.groupSize && (
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>{offer.groupSize}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Price */}
                  <div className="mb-3 flex items-center">
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(offer.discountedPrice)}
                    </span>
                    <span className="ml-2 text-sm text-muted-foreground line-through">
                      {formatCurrency(offer.originalPrice)}
                    </span>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col space-y-3 border-t p-5">
                  {/* Countdown timer */}
                  {countdowns[offer.id] && (
                    <div className="w-full">
                      <div className="mb-1 flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>Offer ends in:</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 text-center text-xs">
                        <div className="rounded bg-slate-100 p-1">
                          <div className="font-bold">{countdowns[offer.id].days}</div>
                          <div className="text-xs text-muted-foreground">Days</div>
                        </div>
                        <div className="rounded bg-slate-100 p-1">
                          <div className="font-bold">{countdowns[offer.id].hours}</div>
                          <div className="text-xs text-muted-foreground">Hours</div>
                        </div>
                        <div className="rounded bg-slate-100 p-1">
                          <div className="font-bold">{countdowns[offer.id].minutes}</div>
                          <div className="text-xs text-muted-foreground">Mins</div>
                        </div>
                        <div className="rounded bg-slate-100 p-1">
                          <div className="font-bold">{countdowns[offer.id].seconds}</div>
                          <div className="text-xs text-muted-foreground">Secs</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full"
                    onClick={() => handleBookNow(offer.id)}
                  >
                    Book Now
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* View all button */}
        <div className="mt-10 text-center">
          <Button 
            variant="outline" 
            size="lg"
            className="rounded-full"
            onClick={() => navigate('/offers')}
          >
            View All Offers
          </Button>
        </div>
      </div>
    </section>
  );
} 