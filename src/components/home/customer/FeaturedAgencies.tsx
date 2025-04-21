import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Award, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Card, CardContent, CardFooter } from '../../ui/card';
import { agencyPublicService } from '../../../services/api/agencyPublicService';
import { Skeleton } from '../../ui/skeleton';

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

type Agency = {
  id: string;
  name: string;
  logo: string;
  coverImage: string;
  location: string;
  rating: number;
  totalReviews: number;
  specialties: string[];
  verified: boolean;
  totalTravelers: number;
};

// Placeholder agencies until API data loads
const placeholderAgencies: Agency[] = [
  {
    id: '1',
    name: 'Global Explorers',
    logo: 'https://images.unsplash.com/photo-1622842182827-a04694e05851?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyMzQxNDUyMg&ixlib=rb-1.2.1&q=80&w=100',
    coverImage: 'https://images.unsplash.com/photo-1505832018823-50331d70d237?q=80&w=3270&auto=format&fit=crop',
    location: 'New York, USA',
    rating: 4.8,
    totalReviews: 845,
    specialties: ['Adventure', 'Cultural'],
    verified: true,
    totalTravelers: 12450
  },
  {
    id: '2',
    name: 'Asian Journeys',
    logo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyMzQxNDU0MQ&ixlib=rb-1.2.1&q=80&w=100',
    coverImage: 'https://images.unsplash.com/photo-1464817739973-0128fe77aaa1?q=80&w=3270&auto=format&fit=crop',
    location: 'Tokyo, Japan',
    rating: 4.7,
    totalReviews: 623,
    specialties: ['Cultural', 'Luxury'],
    verified: true,
    totalTravelers: 8970
  },
  {
    id: '3',
    name: 'European Dreams',
    logo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyMzQxNDU2MA&ixlib=rb-1.2.1&q=80&w=100',
    coverImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=3270&auto=format&fit=crop',
    location: 'Paris, France',
    rating: 4.9,
    totalReviews: 1205,
    specialties: ['Luxury', 'Couples'],
    verified: true,
    totalTravelers: 15780
  },
  {
    id: '4',
    name: 'Adventure Seekers',
    logo: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyMzQxNDU3OA&ixlib=rb-1.2.1&q=80&w=100',
    coverImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=3274&auto=format&fit=crop',
    location: 'Queenstown, New Zealand',
    rating: 4.6,
    totalReviews: 782,
    specialties: ['Adventure', 'Nature'],
    verified: true,
    totalTravelers: 9340
  },
  {
    id: '5',
    name: 'Tropical Escapes',
    logo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyMzQxNDU5NQ&ixlib=rb-1.2.1&q=80&w=100',
    coverImage: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?q=80&w=3274&auto=format&fit=crop',
    location: 'Bali, Indonesia',
    rating: 4.8,
    totalReviews: 934,
    specialties: ['Beach', 'Wellness'],
    verified: true,
    totalTravelers: 11280
  }
];

export function FeaturedAgencies() {
  const navigate = useNavigate();
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  // Fetch agencies from API
  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        setLoading(true);
        // Try to fetch from API - replace with actual API call once implemented
        // const response = await agencyPublicService.getFeaturedAgencies();
        // setAgencies(response.data);
        
        // Using placeholder data for now
        setTimeout(() => {
          setAgencies(placeholderAgencies);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching featured agencies:', error);
        setAgencies(placeholderAgencies);
        setLoading(false);
      }
    };

    fetchAgencies();
  }, []);

  // Calculate max scroll position
  useEffect(() => {
    const calculateMaxScroll = () => {
      const container = document.getElementById('agencies-container');
      if (container) {
        setMaxScroll(container.scrollWidth - container.clientWidth);
      }
    };

    calculateMaxScroll();
    window.addEventListener('resize', calculateMaxScroll);
    
    return () => {
      window.removeEventListener('resize', calculateMaxScroll);
    };
  }, [agencies, loading]);

  // Handle agency card click
  const handleAgencyClick = (agencyId: string) => {
    navigate(`/agency/${agencyId}`);
  };

  // Handle scroll buttons
  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('agencies-container');
    if (container) {
      const scrollAmount = 300;
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(maxScroll, scrollPosition + scrollAmount);
      
      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      
      setScrollPosition(newPosition);
    }
  };

  // Handle scroll event
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollPosition(e.currentTarget.scrollLeft);
  };

  // Skeleton loader for agencies
  const renderSkeletons = () => {
    return Array(5).fill(0).map((_, index) => (
      <Card key={index} className="min-w-[300px] max-w-[350px] border shadow-md">
        <Skeleton className="h-40 w-full rounded-t-lg" />
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between p-4 pt-0">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-20" />
        </CardFooter>
      </Card>
    ));
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="mb-2 text-3xl font-bold">Featured Travel Agencies</h2>
            <p className="text-muted-foreground">
              Discover top-rated travel partners for your next adventure
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full"
              onClick={() => scroll('left')}
              disabled={scrollPosition <= 0 || loading}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full"
              onClick={() => scroll('right')}
              disabled={scrollPosition >= maxScroll || loading}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div 
          id="agencies-container"
          className="flex items-stretch gap-5 overflow-x-auto pb-6 scrollbar-hide"
          onScroll={handleScroll}
        >
          {loading ? (
            renderSkeletons()
          ) : (
            <motion.div 
              className="flex gap-5" 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {agencies.map((agency) => (
                <motion.div 
                  key={agency.id}
                  variants={itemVariants}
                  onClick={() => handleAgencyClick(agency.id)}
                  className="cursor-pointer transition-transform hover:translate-y-[-5px]"
                >
                  <Card className="flex min-w-[300px] max-w-[350px] flex-col overflow-hidden border shadow-md">
                    <div 
                      className="h-40 w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${agency.coverImage})` }}
                    />
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={agency.logo} 
                          alt={agency.name} 
                          className="h-16 w-16 rounded-full border-2 border-white object-cover shadow-md" 
                        />
                        <div>
                          <h3 className="text-lg font-semibold">{agency.name}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="mr-1 h-3 w-3" />
                            {agency.location}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center">
                        <div className="flex items-center">
                          <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="mr-1 font-medium">{agency.rating}</span>
                          <span className="text-xs text-muted-foreground">
                            ({agency.totalReviews})
                          </span>
                        </div>
                        
                        {agency.verified && (
                          <div className="ml-auto flex items-center text-blue-500">
                            <Award className="mr-1 h-4 w-4" />
                            <span className="text-xs font-medium">Verified</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-3 flex flex-wrap gap-1">
                        {agency.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="mt-auto flex justify-between border-t p-4">
                      <div className="flex items-center text-sm">
                        <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {agency.totalTravelers.toLocaleString()} travelers
                        </span>
                      </div>
                      <Button size="sm" variant="outline">
                        View Agency
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
} 