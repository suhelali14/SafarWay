import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock, Percent, Tag, Users } from 'lucide-react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';

interface Offer {
  id: string;
  title: string;
  description: string;
  image: string;
  discount: number;
  originalPrice: number;
  currentPrice: number;
  expiresAt: string;
  duration: string;
  category: 'vacation' | 'cruise' | 'adventure' | 'hotel';
  groupSize: number;
  featured: boolean;
  code?: string;
}

export function SpecialOffers() {
  const [activeTab, setActiveTab] = useState<string>('all');

  const offers: Offer[] = [
    {
      id: 'summer-bali',
      title: 'Summer in Bali: All-inclusive Resort Package',
      description: 'Enjoy 7 nights at a 5-star beach resort with all meals, activities, and airport transfers included.',
      image: '/offers/bali-resort.jpg',
      discount: 25,
      originalPrice: 2499,
      currentPrice: 1874,
      expiresAt: '2025-06-30',
      duration: '7 days',
      category: 'vacation',
      groupSize: 2,
      featured: true,
      code: 'SUMMER25'
    },
    {
      id: 'mediterranean-cruise',
      title: 'Mediterranean Cruise: Spain, Italy & Greece',
      description: 'Explore the best Mediterranean destinations with luxury accommodation and gourmet dining.',
      image: '/offers/mediterranean-cruise.jpg',
      discount: 20,
      originalPrice: 3299,
      currentPrice: 2639,
      expiresAt: '2025-07-15',
      duration: '10 days',
      category: 'cruise',
      groupSize: 2,
      featured: true
    },
    {
      id: 'swiss-alps-adventure',
      title: 'Swiss Alps Adventure Package',
      description: 'Hiking, paragliding, and exploring picturesque villages with expert local guides.',
      image: '/offers/swiss-alps.jpg',
      discount: 15,
      originalPrice: 1899,
      currentPrice: 1614,
      expiresAt: '2025-08-20',
      duration: '5 days',
      category: 'adventure',
      groupSize: 4,
      featured: true
    },
    {
      id: 'dubai-luxury',
      title: 'Dubai Luxury Hotel Stay',
      description: 'Experience unparalleled luxury at a 5-star hotel with breathtaking views of the city skyline.',
      image: '/offers/dubai-hotel.jpg',
      discount: 30,
      originalPrice: 2799,
      currentPrice: 1959,
      expiresAt: '2025-09-10',
      duration: '5 days',
      category: 'hotel',
      groupSize: 2,
      featured: false,
      code: 'LUXDUBAI30'
    },
    {
      id: 'thailand-adventure',
      title: 'Thailand Adventure Tour',
      description: 'Explore hidden temples, bustling markets, pristine beaches, and authentic cuisine.',
      image: '/offers/thailand-adventure.jpg',
      discount: 18,
      originalPrice: 1599,
      currentPrice: 1311,
      expiresAt: '2025-08-15',
      duration: '8 days',
      category: 'adventure',
      groupSize: 6,
      featured: true
    },
    {
      id: 'alaska-cruise',
      title: 'Alaska Wilderness Cruise',
      description: 'Witness breathtaking glaciers, wildlife, and the northern lights on this unforgettable journey.',
      image: '/offers/alaska-cruise.jpg',
      discount: 22,
      originalPrice: 4299,
      currentPrice: 3353,
      expiresAt: '2025-07-30',
      duration: '12 days',
      category: 'cruise',
      groupSize: 2,
      featured: false
    }
  ];

  // Filter for featured offers or apply category filter
  const filteredOffers = activeTab === 'all'
    ? offers.filter(offer => offer.featured)
    : offers.filter(offer => offer.category === activeTab && offer.featured);

  // Calculate days remaining for each offer
  const calculateDaysRemaining = (expiresAt: string): number => {
    const today = new Date();
    const expiryDate = new Date(expiresAt);
    const timeDiff = expiryDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  // Format date to be more readable
  const formatExpiry = (expiresAt: string): string => {
    return new Date(expiresAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section className="py-24">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-3">Limited Time Offers</Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Special Deals & Promotions
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Take advantage of these exclusive limited-time offers and save on your next adventure.
            Book now before these deals expire!
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full mb-10" onValueChange={setActiveTab}>
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="all">All Offers</TabsTrigger>
              <TabsTrigger value="vacation">Vacation Packages</TabsTrigger>
              <TabsTrigger value="cruise">Cruises</TabsTrigger>
              <TabsTrigger value="adventure">Adventures</TabsTrigger>
              <TabsTrigger value="hotel">Hotels</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="vacation" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cruise" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="adventure" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="hotel" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-10">
          <Button size="lg" asChild>
            <Link href="/offers">
              View all special offers
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function OfferCard({ offer }: { offer: Offer }) {
  const daysRemaining = calculateDaysRemaining(offer.expiresAt);
  const formattedExpiry = formatExpiry(offer.expiresAt);
  
  // Format discount badge based on discount percentage
  const discountLabel = `${offer.discount}% OFF`;
  
  return (
    <Card className="overflow-hidden flex flex-col h-full transition-all hover:shadow-lg">
      <div className="relative">
        <div className="relative h-48 w-full">
          <Image
            src={offer.image}
            alt={offer.title}
            className="h-full w-full object-cover"
            width={400}
            height={200}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60" />
        </div>
        
        <Badge className="absolute right-3 top-3 bg-red-500">
          {discountLabel}
        </Badge>
        
        {offer.code && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/80 px-3 py-1 text-sm text-white">
            <Tag className="h-3.5 w-3.5" />
            <span className="font-medium">Code: {offer.code}</span>
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-xl">{offer.title}</CardTitle>
        </div>
        <CardDescription className="line-clamp-2 mt-1">
          {offer.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="mr-1 h-4 w-4" />
            <span>{offer.duration}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Users className="mr-1 h-4 w-4" />
            <span>For {offer.groupSize}+ people</span>
          </div>
        </div>

        <div className="mt-4 flex items-center">
          <Percent className="mr-1 h-4 w-4 text-red-500" />
          <span className="text-sm font-medium">
            Save ${offer.originalPrice - offer.currentPrice}
          </span>
        </div>

        <div className="mt-4 flex items-center">
          <Clock className="mr-1 h-4 w-4 text-amber-500" />
          <span className="text-sm">
            {daysRemaining > 0 ? (
              <>
                <span className="font-medium">
                  Expires in {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
                </span>
                <span className="text-gray-500"> ({formattedExpiry})</span>
              </>
            ) : (
              <span className="text-red-500 font-medium">Offer expired</span>
            )}
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-start pt-4 border-t">
        <div className="flex items-baseline mb-3">
          <span className="text-xs text-gray-500 line-through mr-1">
            ${offer.originalPrice}
          </span>
          <span className="text-2xl font-bold text-primary">
            ${offer.currentPrice}
          </span>
          <span className="text-xs text-gray-500 ml-1">per person</span>
        </div>

        <Button className="w-full">
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
}

// Helper functions (defined outside the component to prevent recreation on each render)
function calculateDaysRemaining(expiresAt: string): number {
  const today = new Date();
  const expiryDate = new Date(expiresAt);
  const timeDiff = expiryDate.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

function formatExpiry(expiresAt: string): string {
  return new Date(expiresAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
} 