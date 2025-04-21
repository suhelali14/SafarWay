import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ArrowRight, Users, Calendar, Star, ChevronRight } from 'lucide-react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';

interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  rating: number;
  reviewCount: number;
  popularSeason: string;
  price: number;
  featured: boolean;
  description: string;
}

export function FeaturedDestinations() {
  const destinations: Destination[] = [
    {
      id: 'bali',
      name: 'Bali',
      country: 'Indonesia',
      image: '/destinations/bali.jpg',
      rating: 4.8,
      reviewCount: 2453,
      popularSeason: 'Apr - Oct',
      price: 1299,
      featured: true,
      description: 'Discover paradise on earth with pristine beaches, lush rice terraces, and vibrant culture.'
    },
    {
      id: 'santorini',
      name: 'Santorini',
      country: 'Greece',
      image: '/destinations/santorini.jpg',
      rating: 4.9,
      reviewCount: 1872,
      popularSeason: 'May - Sep',
      price: 1599,
      featured: true,
      description: 'Experience the iconic blue domes, spectacular sunsets and crystal-clear Aegean waters.'
    },
    {
      id: 'kyoto',
      name: 'Kyoto',
      country: 'Japan',
      image: '/destinations/kyoto.jpg',
      rating: 4.7,
      reviewCount: 1653,
      popularSeason: 'Mar - May, Oct - Nov',
      price: 1899,
      featured: true,
      description: 'Immerse yourself in ancient traditions, stunning temples and beautiful cherry blossoms.'
    },
    {
      id: 'machu-picchu',
      name: 'Machu Picchu',
      country: 'Peru',
      image: '/destinations/machu-picchu.jpg',
      rating: 4.9,
      reviewCount: 1945,
      popularSeason: 'May - Sep',
      price: 2199,
      featured: false,
      description: 'Explore the ancient Incan citadel set high in the Andes Mountains.'
    },
    {
      id: 'marrakech',
      name: 'Marrakech',
      country: 'Morocco',
      image: '/destinations/marrakech.jpg',
      rating: 4.6,
      reviewCount: 1429,
      popularSeason: 'Mar - May, Sep - Nov',
      price: 1099,
      featured: true,
      description: 'Get lost in colorful souks, stunning riads and the magical atmosphere of this ancient city.'
    },
    {
      id: 'maldives',
      name: 'Maldives',
      country: 'Maldives',
      image: '/destinations/maldives.jpg',
      rating: 4.9,
      reviewCount: 2189,
      popularSeason: 'Nov - Apr',
      price: 2699,
      featured: true,
      description: 'Relax in overwater bungalows surrounded by turquoise lagoons and white sandy beaches.'
    }
  ];

  // Filter for featured destinations
  const featuredDestinations = destinations.filter(dest => dest.featured);

  return (
    <section className="py-24 bg-slate-50">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div className="mb-6 md:mb-0">
            <Badge variant="outline" className="mb-3">Popular Destinations</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Discover Dream Destinations
            </h2>
            <p className="text-gray-500 max-w-2xl">
              Explore our handpicked selection of the world's most breathtaking destinations,
              from tropical paradises to ancient cultural wonders.
            </p>
          </div>
          <Button variant="ghost" asChild className="group self-start">
            <Link href="/destinations">
              <span>View all destinations</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredDestinations.map((destination) => (
            <Link 
              href={`/destinations/${destination.id}`} 
              key={destination.id}
              className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={destination.image}
                  alt={`${destination.name}, ${destination.country}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  width={500}
                  height={300}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                <Badge className="absolute left-4 top-4 bg-primary/90">
                  Featured
                </Badge>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{destination.name}</h3>
                    <div className="flex items-center text-gray-500">
                      <MapPin className="mr-1 h-4 w-4" />
                      <span>{destination.country}</span>
                    </div>
                  </div>
                  <div className="flex items-center rounded-full bg-primary/10 px-2 py-1 text-sm">
                    <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{destination.rating}</span>
                    <span className="text-xs text-gray-500">
                      ({destination.reviewCount})
                    </span>
                  </div>
                </div>

                <p className="mb-4 text-gray-600 line-clamp-2">
                  {destination.description}
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>{destination.popularSeason}</span>
                  </div>
                  <div className="text-lg font-bold text-primary">
                    ${destination.price}
                    <span className="text-sm font-normal text-gray-500">/person</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center text-primary transition-colors group-hover:text-primary-dark">
                  <span className="font-medium">View packages</span>
                  <ChevronRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4">Not sure where to go?</h3>
          <p className="text-gray-500 mx-auto max-w-2xl mb-6">
            Let our travel experts help you find the perfect destination based on your preferences, 
            budget, and travel style.
          </p>
          <Button size="lg" asChild>
            <Link href="/quiz">
              Find your perfect destination
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
} 