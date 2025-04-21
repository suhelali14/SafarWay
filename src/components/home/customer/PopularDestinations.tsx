import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, TrendingUp, Package } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};

// Define destination type
type Destination = {
  id: string;
  name: string;
  country: string;
  image: string;
  packageCount: number;
  trending: boolean;
  category: 'Beach' | 'Mountain' | 'City' | 'Cultural' | 'Adventure';
};

// Popular destinations data
const destinations: Destination[] = [
  {
    id: 'bali-indonesia',
    name: 'Bali',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=3538&auto=format&fit=crop',
    packageCount: 128,
    trending: true,
    category: 'Beach'
  },
  {
    id: 'paris-france',
    name: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1499856871958-5b9357976b82?q=80&w=3420&auto=format&fit=crop',
    packageCount: 95,
    trending: true,
    category: 'City'
  },
  {
    id: 'kyoto-japan',
    name: 'Kyoto',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=3540&auto=format&fit=crop',
    packageCount: 72,
    trending: false,
    category: 'Cultural'
  },
  {
    id: 'santorini-greece',
    name: 'Santorini',
    country: 'Greece',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=3474&auto=format&fit=crop',
    packageCount: 86,
    trending: true,
    category: 'Beach'
  },
  {
    id: 'new-york-usa',
    name: 'New York',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=3540&auto=format&fit=crop',
    packageCount: 115,
    trending: false,
    category: 'City'
  },
  {
    id: 'swiss-alps-switzerland',
    name: 'Swiss Alps',
    country: 'Switzerland',
    image: 'https://images.unsplash.com/photo-1491555103944-7c647fd857e6?q=80&w=3540&auto=format&fit=crop',
    packageCount: 64,
    trending: true,
    category: 'Mountain'
  },
  {
    id: 'cape-town-south-africa',
    name: 'Cape Town',
    country: 'South Africa',
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=3474&auto=format&fit=crop',
    packageCount: 58,
    trending: false,
    category: 'Adventure'
  },
  {
    id: 'machu-picchu-peru',
    name: 'Machu Picchu',
    country: 'Peru',
    image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=3540&auto=format&fit=crop',
    packageCount: 43,
    trending: true,
    category: 'Adventure'
  }
];

// Category color mapping
const categoryColors: Record<Destination['category'], string> = {
  Beach: 'bg-blue-100 text-blue-800',
  Mountain: 'bg-green-100 text-green-800',
  City: 'bg-purple-100 text-purple-800',
  Cultural: 'bg-amber-100 text-amber-800',
  Adventure: 'bg-red-100 text-red-800'
};

export function PopularDestinations() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Destination['category'] | 'All'>('All');
  
  // Filter destinations based on selected category
  const filteredDestinations = filter === 'All' 
    ? destinations 
    : destinations.filter(dest => dest.category === filter);
  
  // Handle destination card click
  const handleDestinationClick = (destinationId: string) => {
    // Navigate to packages search page with destination as query parameter
    navigate(`/packages?destination=${destinationId}`);
  };

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-3xl font-bold">Popular Destinations</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Explore our most popular travel destinations around the world and find your next adventure
          </p>
        </div>
        
        {/* Category filters */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {['All', 'Beach', 'Mountain', 'City', 'Cultural', 'Adventure'].map((category) => (
            <Button
              key={category}
              variant={filter === category ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(category as Destination['category'] | 'All')}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>
        
        {/* Destinations grid */}
        <motion.div 
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredDestinations.map((destination) => (
            <motion.div 
              key={destination.id}
              variants={itemVariants}
              onClick={() => handleDestinationClick(destination.id)}
              className="cursor-pointer transition-all duration-300 hover:scale-[1.02]"
            >
              <Card className="overflow-hidden border shadow-md">
                <div className="relative h-48 w-full overflow-hidden">
                  <img 
                    src={destination.image}
                    alt={`${destination.name}, ${destination.country}`}
                    className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Category badge */}
                  <div className="absolute left-3 top-3">
                    <Badge className={categoryColors[destination.category]}>
                      {destination.category}
                    </Badge>
                  </div>
                  
                  {/* Trending badge */}
                  {destination.trending && (
                    <div className="absolute right-3 top-3">
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Trending
                      </Badge>
                    </div>
                  )}
                  
                  {/* Destination name overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="mb-1 text-xl font-bold">
                      {destination.name}
                    </h3>
                    <div className="flex items-center text-sm">
                      <MapPin className="mr-1 h-3 w-3" />
                      {destination.country}
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm">
                      <Package className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {destination.packageCount} packages available
                      </span>
                    </div>
                    <Button size="sm" variant="ghost" className="text-primary">
                      Explore
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        {/* View all button */}
        <div className="mt-10 text-center">
          <Button 
            onClick={() => navigate('/destinations')}
            variant="outline" 
            size="lg"
            className="rounded-full"
          >
            View All Destinations
          </Button>
        </div>
      </div>
    </section>
  );
} 