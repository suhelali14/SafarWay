import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { LoginRequiredModal } from '../../components/modals/LoginRequiredModal';
import { HeroSection } from '../../components/home/customer/HeroSection';
import { FeaturedAgencies } from '../../components/home/customer/FeaturedAgencies';
import { PopularPackages } from '../../components/home/customer/PopularPackages';
import { WhyChooseUs } from '../../components/home/customer/WhyChooseUs';
import { MediaWall } from '../../components/home/customer/MediaWall';
import { CustomerTestimonials } from '../../components/home/customer/CustomerTestimonials';


// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export function CustomerHomePage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [actionAfterLogin, setActionAfterLogin] = useState<{
    type: 'subscribe' | 'book' | 'like' | 'review';
    id: string;
  } | null>(null);

  // Function to handle restricted actions
  const handleRestrictedAction = (actionType: 'subscribe' | 'book' | 'like' | 'review', id: string) => {
    if (!isAuthenticated) {
      setActionAfterLogin({ type: actionType, id });
      setShowLoginModal(true);
      return false;
    }
    return true;
  };

  // Function to handle action after successful login
  const handlePostLoginAction = () => {
    if (!actionAfterLogin) return;
    
    // Perform the action that was attempted before login
    switch (actionAfterLogin.type) {
      case 'subscribe':
        console.log(`Subscribing to agency ${actionAfterLogin.id}`);
        // Call subscribe API here
        break;
      case 'book':
        console.log(`Redirecting to booking page for package ${actionAfterLogin.id}`);
        navigate(`/packages/${actionAfterLogin.id}`);
        break;
      case 'like':
        console.log(`Liking media ${actionAfterLogin.id}`);
        // Call like API here
        break;
      case 'review':
        console.log(`Opening review form for ${actionAfterLogin.id}`);
        // Open review form
        break;
    }
    
    // Reset action after handling
    setActionAfterLogin(null);
  };

  // Handle successful login
  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    handlePostLoginAction();
  };

  return (
    <>
      <Helmet>
        <title>SafarWay - Discover Your Next Adventure</title>
        <meta
          name="description"
          content="Find and book the best travel experiences worldwide. Explore curated packages from verified travel agencies on SafarWay."
        />
      </Helmet>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="flex min-h-screen flex-col"
      >
        {/* Hero Section with Search */}
        <motion.section variants={fadeInUp}>
          <HeroSection />
        </motion.section>

        <main className="flex-1">
          {/* Featured Agencies Section */}
          <motion.section 
            variants={fadeInUp}
            className="py-16 bg-gray-50"
          >
            <FeaturedAgencies onSubscribe={(agencyId) => handleRestrictedAction('subscribe', agencyId)} />
          </motion.section>

          {/* Popular Packages Section */}
          <motion.section 
            variants={fadeInUp}
            className="py-16"
          >
            <PopularPackages onBookNow={(packageId) => handleRestrictedAction('book', packageId)} />
          </motion.section>

          {/* Why Choose Us */}
          <motion.section 
            variants={fadeInUp}
            className="py-16 bg-gray-50"
          >
            <WhyChooseUs />
          </motion.section>

          {/* Media Wall */}
          <motion.section 
            variants={fadeInUp}
            className="py-16"
          >
            <MediaWall onLike={(mediaId) => handleRestrictedAction('like', mediaId)} />
          </motion.section>

          {/* Testimonials */}
          <motion.section 
            variants={fadeInUp}
            className="py-16 bg-gray-50"
          >
            <CustomerTestimonials />
          </motion.section>
        </main>

        {/* Login Required Modal */}
        <LoginRequiredModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
          actionType={actionAfterLogin?.type || 'book'}
        />
      </motion.div>
    </>
  );
} 