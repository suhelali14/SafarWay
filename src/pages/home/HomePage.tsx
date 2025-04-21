import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { HeroSection, SpecialOffers, PopularDestinations, FeaturedAgencies, CustomerTestimonials } from '../../components/home';
import { WhyChooseUs } from '../../components/home/WhyChooseUs';
import { Testimonials } from '../../components/home/Testimonials';
import { PartnerAgencies } from '../../components/home/PartnerAgencies';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';
import { Package, Calendar, Star, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import { Helmet } from 'react-helmet-async';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Adventure Enthusiast',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    rating: 5,
    text: 'SafarWay made planning our family vacation a breeze. The packages were well-organized and the local guides were exceptional.',
    location: 'New York, USA',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Business Traveler',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    rating: 5,
    text: 'As a frequent traveler, I appreciate the attention to detail and personalized service SafarWay provides. Highly recommended!',
    location: 'Singapore',
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    role: 'Travel Blogger',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    rating: 5,
    text: 'The cultural experiences and hidden gems SafarWay introduced me to were truly unforgettable. A must-try for authentic travel!',
    location: 'Barcelona, Spain',
  },
];

// Mock data for customer dashboard
const recommendedPackages = [
  {
    id: '1',
    title: 'Bali Paradise',
    description: '7 days of sun, surf, and culture in the Indonesian paradise.',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    rating: 4.8,
  },
  {
    id: '2',
    title: 'Tokyo Explorer',
    description: 'Discover the vibrant culture and cuisine of Japan\'s capital.',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    rating: 4.9,
  },
  {
    id: '3',
    title: 'Paris Romance',
    description: 'Experience the city of love with this romantic getaway package.',
    price: 1799,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80',
    rating: 4.7,
  },
];

// Mock data for active bookings
const activeBookings = [
  {
    id: '1',
    title: 'Bali Paradise',
    startDate: '2023-06-15',
    endDate: '2023-06-22',
    status: 'Confirmed',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  },
  {
    id: '2',
    title: 'Tokyo Explorer',
    startDate: '2023-07-10',
    endDate: '2023-07-17',
    status: 'Pending',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
  },
];

// Mock data for agency dashboard
const agencyStats = [
  { title: 'Total Packages', value: 24, icon: Package },
  { title: 'Active Bookings', value: 18, icon: Calendar },
  { title: 'Average Rating', value: 4.8, icon: Star },
];

export function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if trying to access protected routes
  useEffect(() => {
    if (!isAuthenticated && (location.pathname === '/dashboard' || location.pathname === '/bookings')) {
      navigate('/login');
    }
   
  }, [isAuthenticated, navigate]);
  useEffect(()=>{
    if (isAuthenticated) {
      user?.role=="CUSTOMER"?
          navigate('/') : user?.role == "SAFARWAY_ADMIN" || user?.role =="SAFARWAY_USER" ? navigate('/admin') : navigate('/agency/dashboard')
      
    }
  })
  return (
    <div className="min-h-screen py-12">
      <Helmet>
        <title>
          {isAuthenticated 
            ? `SafarWay - Welcome back, ${user?.name}` 
            : 'SafarWay - Your Gateway to Unforgettable Travel Experiences'}
        </title>
        <meta
          name="description"
          content="Discover amazing travel packages, tours, and adventures with SafarWay. Book your next unforgettable journey today!"
        />
      </Helmet>
      
      <HeroSection />

      <main className="space-y-24 py-16">
        {/* Welcome Section (for authenticated users) */}
        {isAuthenticated && (
          <section className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-xl bg-gradient-to-r from-[#ff6200] to-amber-600 p-8 text-white shadow-lg"
            >
              <h1 className="mb-2 text-3xl font-bold">Welcome back, {user?.name}!</h1>
              <p className="text-lg text-white/90">Ready for your next adventure?</p>
            </motion.div>
          </section>
        )}

        {/* Active Bookings Section (for authenticated users) */}
        {isAuthenticated && activeBookings.length > 0 && (
          <section className="container mx-auto px-4">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Your Active Bookings</h2>
              <Link to="/bookings">
                <Button variant="ghost" className="gap-2">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {activeBookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="overflow-hidden">
                    <div className="relative h-48">
                      <img
                        src={booking.image}
                        alt={booking.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <div className={`absolute right-2 top-2 rounded-full px-2 py-1 text-xs font-medium ${
                        booking.status === 'Confirmed' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'
                      }`}>
                        {booking.status}
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle>{booking.title}</CardTitle>
                      <CardDescription>
                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Link to={`/bookings/${booking.id}`} className="w-full">
                        <Button className="w-full">View Details</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Featured Packages Section */}
        <section className="container mx-auto px-4">
          <PopularDestinations />
        </section>

        {/* Special Offers Section */}
        <section className="container mx-auto px-4">
          <SpecialOffers />
        </section>

        {/* Why Choose Us Section */}
        <section className="container mx-auto px-4">
          <WhyChooseUs />
        </section>

        {/* Testimonials Section */}
        <section className="bg-gray-50 py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold">What Our Travelers Say</h2>
              <p className="text-gray-600">
                Discover why travelers love booking with SafarWay
              </p>
            </div>
            <CustomerTestimonials />
          </div>
        </section>

        {/* Partner Agencies Section */}
        <section className="container mx-auto px-4">
          <FeaturedAgencies />
        </section>

        {/* CTA Section */}
        <section className="bg-[#ff6200]/5 py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied travelers who have experienced the world with
              SafarWay. Your next unforgettable journey is just a click away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-[#ff6200] hover:bg-[#ff6200]/90">
                <Link to="/packages">Browse Packages</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
} 