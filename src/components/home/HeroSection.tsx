import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SearchBar } from '../search/SearchBar';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className = '' }: HeroSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const [lastSearched, setLastSearched] = useState({
    location: '',
    startDate: null,
    endDate: null,
    guests: 1,
    packageType: ''
  });

  useEffect(() => {
    // Load last searched values from localStorage if available
    const savedSearch = localStorage.getItem('lastSearch');
    if (savedSearch) {
      try {
        setLastSearched(JSON.parse(savedSearch));
      } catch (error) {
        console.error('Error parsing saved search:', error);
      }
    }
  }, []);

  const handleSearch = (searchParams: any) => {
    // Save search params to localStorage
    localStorage.setItem('lastSearch', JSON.stringify(searchParams));
    setLastSearched(searchParams);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className={`relative overflow-hidden ${className}`}>
      <Helmet>
        <title>SafarWay - Discover Your Next Adventure</title>
        <meta name="description" content="Book exclusive travel packages, verified by SafarWay. Find the perfect tour package for your next adventure." />
      </Helmet>

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
          alt="Travel background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto flex min-h-[80vh] flex-col items-center justify-center px-4 py-20 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          <motion.h1
            variants={itemVariants}
            className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl"
          >
            {isAuthenticated ? (
              <>
                Hey <span className="text-[#ff6200]">{user?.name}</span>, Let's plan your next trip!
              </>
            ) : (
              <>
                Discover Your Next Adventure
                <br />
                <span className="text-[#ff6200]">Powered by Trusted Agencies</span>
              </>
            )}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mb-8 text-lg text-gray-200 md:text-xl"
          >
            {isAuthenticated
              ? 'Explore our curated collection of travel packages and start planning your next journey.'
              : 'Book exclusive travel packages, verified by SafarWay.'}
          </motion.p>

          <motion.div variants={itemVariants} className="mb-8">
            <SearchBar 
              variant="hero" 
              className="mx-auto max-w-4xl" 
              initialLocation={lastSearched.location}
              initialStartDate={lastSearched.startDate}
              initialEndDate={lastSearched.endDate}
              initialGuests={lastSearched.guests}
              initialPackageType={lastSearched.packageType}
              onSearch={handleSearch}
            />
          </motion.div>

          {!isAuthenticated && (
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link to="/register">
                <Button size="lg" className="w-full bg-[#ff6200] hover:bg-[#ff6200]/90 sm:w-auto">
                  Join as an Agency
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full bg-white/10 text-white hover:bg-white/20 sm:w-auto">
                  Book Your Adventure
                </Button>
              </Link>
            </motion.div>
          )}

          {isAuthenticated && (
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link to="/packages">
                <Button size="lg" className="w-full bg-[#ff6200] hover:bg-[#ff6200]/90 sm:w-auto">
                  Explore Packages
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="w-full bg-white/10 text-white hover:bg-white/20 sm:w-auto">
                  Go to Dashboard
                </Button>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center text-white">
          <span className="mb-2 text-sm">Scroll Down</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 animate-bounce"
          >
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </svg>
        </div>
      </motion.div>
    </section>
  );
} 