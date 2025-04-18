import { Package } from '../services/api/customerAPI';

/**
 * Generate a mock package for testing and development
 * @param id Optional ID to use (default is a random UUID)
 * @returns A mock Package object
 */
export const generateMockPackage = (id?: string): Package => {
  const packageId = id || `pkg-${Math.floor(Math.random() * 10000)}`;
  
  return {
    id: packageId,
    title: 'Bali Adventure: Ultimate Island Experience',
    destination: 'Bali, Indonesia',
    description: 'Experience the ultimate Bali adventure with this 7-day all-inclusive package. Explore stunning beaches, ancient temples, lush rice terraces, and vibrant cultural experiences.',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
    images: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
      'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b',
      'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8'
    ],
    price: 1299,
    currency: 'USD',
    rating: 4.8,
    reviews: [
      {
        author: 'Jane Smith',
        date: '2023-08-15',
        rating: 5,
        comment: 'Amazing experience! The tour guides were knowledgeable and friendly.'
      },
      {
        author: 'John Doe',
        date: '2023-07-22',
        rating: 4,
        comment: 'Great trip overall. Wish we had more time at the beaches.'
      }
    ],
    features: ['All Inclusive', 'Beach', 'Guided Tours', 'Meals Included', 'Hotel Transfer'],
    inclusions: [
      'Airport transfers',
      'All accommodations (6 nights)',
      'Daily breakfast, 4 lunches, 3 dinners',
      'All entrance fees to attractions',
      'English-speaking guides',
      'Transportation throughout',
      'Welcome dinner with cultural performance'
    ],
    exclusions: [
      'International airfare',
      'Travel insurance',
      'Personal expenses',
      'Additional activities not in itinerary',
      'Alcoholic beverages'
    ],
    itinerary: [
      {
        title: 'Arrival & Welcome Dinner',
        description: 'Arrive at Ngurah Rai International Airport. Transfer to your hotel in Seminyak. Evening welcome dinner with traditional Balinese performances.'
      },
      {
        title: 'Beaches & Sunset',
        description: 'Morning at Seminyak Beach. Afternoon visit to Tanah Lot Temple. Sunset dinner at Jimbaran Bay with fresh seafood.'
      },
      {
        title: 'Ubud Cultural Day',
        description: 'Visit Ubud Monkey Forest. Explore Ubud Art Market. Tour a traditional Balinese house compound. Evening fire dance performance.'
      }
    ],
    duration: 7,
    startDates: [
      '2023-12-06',
      '2023-12-13',
      '2023-12-20',
      '2024-01-10'
    ],
    availableSeats: 20,
    discount: 15,
    isPopular: true,
    agency: {
      id: 'agency-1',
      name: 'Bali Travel Experts',
      logo: 'https://via.placeholder.com/150',
      rating: 4.9,
      contact: {
        email: 'contact@balitravelexperts.com',
        phone: '+1234567890'
      }
    }
  };
};

/**
 * Generate an array of mock packages
 * @param count Number of packages to generate
 * @returns Array of mock Package objects
 */
export const generateMockPackages = (count: number = 5): Package[] => {
  return Array(count)
    .fill(null)
    .map((_, index) => {
      const mockPackage = generateMockPackage(`pkg-${index + 1}`);
      
      // Vary some properties for diversity
      mockPackage.title = `${['Amazing', 'Exciting', 'Relaxing', 'Cultural', 'Adventure'][index % 5]} Trip to ${['Bali', 'Tokyo', 'Paris', 'New York', 'Sydney'][index % 5]}`;
      mockPackage.destination = ['Bali, Indonesia', 'Tokyo, Japan', 'Paris, France', 'New York, USA', 'Sydney, Australia'][index % 5];
      mockPackage.price = 800 + (index * 200);
      mockPackage.rating = 3.5 + (index % 3) * 0.5;
      mockPackage.discount = index % 3 === 0 ? 10 + (index * 5) : undefined;
      mockPackage.isPopular = index % 4 === 0;
      
      return mockPackage;
    });
};

/**
 * Generate mock tour data for the packages page
 */
export interface MockTour {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  maxGroupSize: number;
  difficulty: 'easy' | 'moderate' | 'challenging';
  rating: number;
  image: string;
  location: string;
  startDate: string;
  agency: {
    id: string;
    name: string;
    rating: number;
  };
}

/**
 * Generate a mock tour for the packages page
 */
export const generateMockTour = (id?: string): MockTour => {
  const tourId = id || `tour-${Math.floor(Math.random() * 10000)}`;
  
  const difficulties: ['easy', 'moderate', 'challenging'] = ['easy', 'moderate', 'challenging'];
  const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
  
  return {
    id: tourId,
    title: 'Explore the Beauty of Nature',
    description: 'Experience breathtaking landscapes and incredible wildlife on this unforgettable tour.',
    price: 1200 + Math.floor(Math.random() * 2000),
    duration: 3 + Math.floor(Math.random() * 10),
    maxGroupSize: 6 + Math.floor(Math.random() * 10),
    difficulty: randomDifficulty,
    rating: 3.5 + Math.random() * 1.5,
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800',
    location: 'Bali, Indonesia',
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * Math.random()).toISOString(),
    agency: {
      id: 'agency-1',
      name: 'Adventure Tours',
      rating: 4.2 + Math.random() * 0.7,
    }
  };
};

/**
 * Generate an array of mock tours for the packages page
 */
export const generateMockTours = (count: number = 12): MockTour[] => {
  const locations = [
    'Bali, Indonesia',
    'Paris, France',
    'Tokyo, Japan',
    'New York, USA',
    'Sydney, Australia',
    'Cape Town, South Africa',
    'Rio de Janeiro, Brazil',
    'London, UK',
    'Barcelona, Spain',
    'Dubai, UAE'
  ];
  
  const titles = [
    'Cultural Experience',
    'Adventure Trek',
    'City Explorer',
    'Wildlife Safari',
    'Beach Paradise',
    'Mountain Expedition',
    'Historical Journey',
    'Culinary Tour',
    'Relaxation Retreat',
    'Photography Tour'
  ];
  
  const images = [
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800', // General travel
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1', // Mountains
    'https://images.unsplash.com/photo-1536782376847-5c9d14d97cc0', // Beach
    'https://images.unsplash.com/photo-1514282401047-d79a71a590e8', // Safari
    'https://images.unsplash.com/photo-1519741497674-611481863552', // City
    'https://images.unsplash.com/photo-1551632811-561732d1e306', // Cultural
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', // Tropical
    'https://images.unsplash.com/photo-1476900543704-4312b78632f8', // Nature
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c', // Hiking
    'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b'  // Resort
  ];
  
  return Array(count)
    .fill(null)
    .map((_, index) => {
      const mockTour = generateMockTour(`tour-${index + 1}`);
      
      // Vary properties for diversity
      mockTour.title = `${titles[index % titles.length]} in ${locations[index % locations.length].split(',')[0]}`;
      mockTour.location = locations[index % locations.length];
      mockTour.image = images[index % images.length];
      mockTour.price = 800 + (index * 200);
      mockTour.difficulty = ['easy', 'moderate', 'challenging'][index % 3] as 'easy' | 'moderate' | 'challenging';
      
      return mockTour;
    });
}; 