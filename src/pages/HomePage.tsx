import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Helmet } from 'react-helmet-async';
import CustomerHomePage from './customer/HomePage';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user role - except for customers who stay on the home page
      if (user.role === 'AGENCY_ADMIN' || user.role === 'AGENCY_USER') {
        navigate('/agency/dashboard');
      } else if (user.role === 'SAFARWAY_ADMIN' || user.role === 'SAFARWAY_USER') {
        navigate('/admin/dashboard');
      }
      // Customers stay on this page, but we render CustomerHomePage for them
    }
  }, [isAuthenticated, navigate, user]);

  // If the user is authenticated and has CUSTOMER role, render the CustomerHomePage
  if (isAuthenticated && user?.role === 'CUSTOMER') {
    return <CustomerHomePage />;
  }

  // For non-authenticated users, show landing page
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>SafarWay - Your Gateway to Unforgettable Travel Experiences</title>
        <meta
          name="description"
          content="Discover amazing travel packages, tours, and adventures with SafarWay. Book your next unforgettable journey today!"
        />
      </Helmet>
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to SafarWay</h1>
        <p className="text-xl mb-8 max-w-2xl">Your gateway to unforgettable travel experiences.</p>
        
        <div className="flex gap-4">
          <Button onClick={() => navigate('/login')} size="lg">
            Sign In
          </Button>
          <Button onClick={() => navigate('/register')} variant="outline" size="lg">
            Register
          </Button>
        </div>
      </main>
    </div>
  );
};

export default HomePage; 