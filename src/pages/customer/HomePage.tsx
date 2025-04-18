import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, Card, CardContent, Button, TextField, MenuItem, InputAdornment, Paper, Tabs, Tab, CircularProgress, Divider, IconButton, Chip, Autocomplete } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FlightIcon from '@mui/icons-material/Flight';
import HotelIcon from '@mui/icons-material/Hotel';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import TrainIcon from '@mui/icons-material/Train';
import ExploreIcon from '@mui/icons-material/Explore';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

import { apiService } from '../../services/api';
import PackageCard from '../../components/customer/PackageCard';
import BookingCard from '../../components/customer/BookingCard';
import OfferCard from '../../components/customer/OfferCard';

// Types
interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  destination: string;
  imageUrl: string;
}

interface Theme {
  name: string;
  image: string;
}

interface DashboardStats {
  totalBookings: number;
  upcomingTrips: number;
  completedTrips: number;
  cancelledTrips: number;
  totalSpent: number;
}

interface Booking {
  id: string;
  packageId: string;
  packageName: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: string;
  totalAmount: number;
  imageUrl?: string;
}

interface UpcomingTrip {
  id: string;
  packageName: string;
  destination: string;
  startDate: string;
  endDate: string;
  imageUrl?: string;
}

interface TourPackage extends Package {
  inclusions: string[];
  exclusions: string[];
  itinerary: Array<{ day: number; description: string }>;
  rating: number;
  reviews: number;
}

interface WishlistItem {
  id: string;
  packageId: string;
}

interface Offer {
  id: string;
  title: string;
  description: string;
  code: string;
  discount: number;
  validUntil: string;
  imageUrl?: string;
}

// Styled components
const SearchCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  position: 'relative',
  top: '-40px',
  backgroundColor: 'white',
  zIndex: 2,
}));

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1421&q=80)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '500px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'white',
  textAlign: 'center',
  padding: theme.spacing(4),
}));

const NavbarSection = styled(Box)(({ theme }) => ({
  backgroundColor: '#EC5B24', // Goibibo orange color
  color: 'white',
  padding: theme.spacing(1.5),
  position: 'sticky',
  top: 0,
  zIndex: 10,
}));

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [upcomingTrips, setUpcomingTrips] = useState<UpcomingTrip[]>([]);
  const [recommendedPackages, setRecommendedPackages] = useState<TourPackage[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [searchTab, setSearchTab] = useState(0);
  const [popularDestinations, setPopularDestinations] = useState<Theme[]>([
    { name: 'Maldives', image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80' },
    { name: 'Switzerland', image: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80' },
    { name: 'Paris', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1473&q=80' },
    { name: 'Bali', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1438&q=80' },
  ]);
  
  // Search state
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState<any>(null);
  const [guests, setGuests] = useState(1);
  const [budget, setBudget] = useState('');

  const locations = [
    'Maldives', 'Switzerland', 'Paris', 'Bali', 'Dubai', 
    'New York', 'Tokyo', 'London', 'Singapore', 'Rome',
    'Barcelona', 'Sydney', 'Amsterdam', 'Istanbul', 'Bangkok'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch customer dashboard stats
      const statsResponse = await apiService.get('/customer/dashboard/stats');
      setStats(statsResponse.data);

      // Fetch recent bookings
      const bookingsResponse = await apiService.get('/customer/bookings/recent');
      setRecentBookings(bookingsResponse.data);

      // Fetch upcoming trips
      const tripsResponse = await apiService.get('/customer/trips/upcoming');
      setUpcomingTrips(tripsResponse.data);

      // Fetch recommended packages
      const packagesResponse = await apiService.get('/packages/recommended');
      setRecommendedPackages(packagesResponse.data);

      // Fetch wishlist items
      const wishlistResponse = await apiService.get('/customer/wishlist');
      setWishlistItems(wishlistResponse.data);

      // Fetch offers
      const offersResponse = await apiService.get('/offers');
      setOffers(offersResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      // For demo purposes, set some sample data if API fails
      setRecommendedPackages([
        {
          id: '1',
          name: 'Magical Maldives',
          description: 'Experience the crystal clear waters and white sandy beaches of Maldives',
          price: 1999,
          duration: 7,
          destination: 'Maldives',
          imageUrl: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
          inclusions: ['Accommodation', 'Breakfast', 'Airport Transfer'],
          exclusions: ['Flights', 'Lunch & Dinner', 'Personal Expenses'],
          itinerary: [{ day: 1, description: 'Arrival and check-in' }],
          rating: 4.8,
          reviews: 246,
        },
        {
          id: '2',
          name: 'Swiss Alps Adventure',
          description: 'Explore the breathtaking Swiss Alps with this all-inclusive package',
          price: 2499,
          duration: 10,
          destination: 'Switzerland',
          imageUrl: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
          inclusions: ['Accommodation', 'All Meals', 'Guided Tours'],
          exclusions: ['Flights', 'Personal Expenses', 'Travel Insurance'],
          itinerary: [{ day: 1, description: 'Arrival in Zurich' }],
          rating: 4.7,
          reviews: 183,
        },
        {
          id: '3',
          name: 'Romantic Paris Getaway',
          description: 'Enjoy the city of love with this romantic package',
          price: 1799,
          duration: 5,
          destination: 'Paris',
          imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1473&q=80',
          inclusions: ['Accommodation', 'Breakfast', 'Seine River Cruise'],
          exclusions: ['Flights', 'Lunch & Dinner', 'Museum Tickets'],
          itinerary: [{ day: 1, description: 'Arrival and check-in' }],
          rating: 4.6,
          reviews: 215,
        },
      ]);
      setOffers([
        {
          id: '1',
          title: 'Early Bird Special',
          description: 'Book 3 months in advance and get 15% off',
          code: 'EARLY15',
          discount: 15,
          validUntil: '2023-12-31',
          imageUrl: 'https://images.unsplash.com/photo-1445307806294-bff7f67ff225?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
        },
        {
          id: '2',
          title: 'Summer Sale',
          description: 'Get 20% off on all summer destinations',
          code: 'SUMMER20',
          discount: 20,
          validUntil: '2023-08-31',
          imageUrl: 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1073&q=80',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishlist = async (packageId: string) => {
    try {
      await apiService.post('/customer/wishlist', { packageId });
      setWishlistItems([...wishlistItems, { id: Date.now().toString(), packageId }]);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const handleRemoveFromWishlist = async (packageId: string) => {
    try {
      await apiService.delete(`/customer/wishlist/${packageId}`);
      setWishlistItems(wishlistItems.filter(item => item.packageId !== packageId));
      } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const isInWishlist = (packageId: string) => {
    return wishlistItems.some(item => item.packageId === packageId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  };

  const handleSearchTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSearchTab(newValue);
  };

  const handleSearch = () => {
    console.log('Searching for:', {
      destination,
      travelDate: travelDate ? travelDate.format('YYYY-MM-DD') : null,
      guests,
      budget: budget ? parseInt(budget) : null
    });
    // Implement search functionality
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Goibibo-style Navbar */}
      <NavbarSection>
        <Container>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5" fontWeight="bold">SafarWay</Typography>
            </Grid>
            <Grid item>
              <Box display="flex" gap={2}>
                <Button color="inherit">Packages</Button>
                <Button color="inherit">Hotels</Button>
                <Button color="inherit">Flights</Button>
                <Button color="inherit">Offers</Button>
                <Button color="inherit">My Trips</Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </NavbarSection>

      {/* Hero Section */}
      <HeroSection>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Discover Your Perfect Trip
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: '800px', mb: 4 }}>
          Explore top destinations and find amazing deals on travel packages
        </Typography>
      </HeroSection>

      {/* Search Box - Goibibo style */}
      <Container>
        <SearchCard>
          <Paper elevation={0}>
            <Tabs 
              value={searchTab} 
              onChange={handleSearchTabChange} 
              variant="fullWidth" 
              indicatorColor="primary"
              textColor="primary"
              sx={{ mb: 3 }}
            >
              <Tab icon={<FlightIcon />} label="Flights" />
              <Tab icon={<HotelIcon />} label="Hotels" />
              <Tab icon={<DirectionsBusIcon />} label="Buses" />
              <Tab icon={<TrainIcon />} label="Trains" />
              <Tab icon={<ExploreIcon />} label="Packages" iconPosition="start" />
                </Tabs>
          </Paper>

          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Autocomplete
                options={locations}
                renderInput={(params) => (
                  <TextField 
                    {...params}
                    label="Where to?" 
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <LocationOnIcon color="primary" />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      )
                    }}
                  />
                )}
                value={destination}
                onChange={(event, newValue) => setDestination(newValue || '')}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="When?"
                  value={travelDate}
                  onChange={(newValue) => setTravelDate(newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: 'outlined',
                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarTodayIcon color="primary" />
                          </InputAdornment>
                        )
                      }
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                label="Guests"
                type="number"
                fullWidth
                variant="outlined"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                  inputProps: { min: 1, max: 10 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                label="Budget (Max)"
                type="number"
                fullWidth
                variant="outlined"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      $
                    </InputAdornment>
                  ),
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                size="large" 
                sx={{ height: '100%', backgroundColor: '#EC5B24' }}
                onClick={handleSearch}
                startIcon={<SearchIcon />}
              >
                SEARCH
              </Button>
            </Grid>
          </Grid>
        </SearchCard>

        {/* Special Offers */}
        <Box mb={6}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <Typography variant="h5" fontWeight="bold">
              <LocalOfferIcon color="error" sx={{ mr: 1, verticalAlign: 'middle' }} />
              Special Offers
            </Typography>
            <Button color="primary">View All</Button>
          </Box>
          <Grid container spacing={3}>
            {offers.map((offer) => (
              <Grid item xs={12} md={6} key={offer.id}>
                <OfferCard offer={offer} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Popular Destinations */}
        <Box mb={6}>
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Popular Destinations
          </Typography>
          <Grid container spacing={2}>
            {popularDestinations.map((destination, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <Card sx={{ 
                  height: 180, 
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${destination.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'flex-end',
                  borderRadius: 2,
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    cursor: 'pointer'
                  }
                }}>
                  <CardContent sx={{ width: '100%' }}>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {destination.name}
                    </Typography>
                    </CardContent>
                  </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Featured Packages */}
        <Box mb={6}>
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Featured Packages
          </Typography>
          <Grid container spacing={3}>
            {recommendedPackages.map((pkg) => (
              <Grid item xs={12} sm={6} md={4} key={pkg.id}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                  }
                }}>
                  <Box sx={{ position: 'relative' }}>
                    <Box 
                      component="img"
                        src={pkg.imageUrl} 
                      alt={pkg.name}
                      sx={{ 
                        width: '100%',
                        height: 200,
                        objectFit: 'cover'
                      }}
                    />
                    <IconButton 
                      sx={{ 
                        position: 'absolute', 
                        top: 8, 
                        right: 8, 
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
                      }}
                      onClick={() => isInWishlist(pkg.id) ? 
                        handleRemoveFromWishlist(pkg.id) : 
                        handleAddToWishlist(pkg.id)
                      }
                    >
                      {isInWishlist(pkg.id) ? 
                        <FavoriteIcon color="error" /> : 
                        <FavoriteBorderIcon />
                      }
                    </IconButton>
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        bottom: 0, 
                        left: 0, 
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '4px 8px',
                        borderTopRightRadius: 8
                      }}
                    >
                      {pkg.duration} Days
                    </Box>
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="h6" fontWeight="bold">
                        {pkg.name}
                      </Typography>
                      <Chip 
                        size="small" 
                        label={`${pkg.rating}★`} 
                        sx={{ 
                          backgroundColor: '#388e3c', 
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                    <Box display="flex" alignItems="center" mb={2}>
                      <LocationOnIcon color="primary" fontSize="small" />
                      <Typography variant="body2" color="text.secondary">
                        {pkg.destination}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {pkg.description}
                    </Typography>
                  </CardContent>
                  <Divider />
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      ${pkg.price}
                      <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                        /person
                      </Typography>
                    </Typography>
                    <Button 
                      variant="contained" 
                      size="small" 
                      sx={{ backgroundColor: '#EC5B24', '&:hover': { backgroundColor: '#d44d1a' } }}
                    >
                      View Deal
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box display="flex" justifyContent="center" mt={3}>
            <Button 
              variant="outlined" 
              color="primary" 
              size="large"
              sx={{ borderRadius: 28, px: 4 }}
            >
              View All Packages
            </Button>
          </Box>
        </Box>

        {/* User Travel Summary */}
        {stats && (
          <Box mb={6}>
            <Typography variant="h5" fontWeight="bold" mb={3}>
              Your Travel Summary
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6">Total Bookings</Typography>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      {stats.totalBookings}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6">Upcoming Trips</Typography>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      {stats.upcomingTrips}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6">Completed Trips</Typography>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      {stats.completedTrips}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6">Total Spent</Typography>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      ${stats.totalSpent}
                    </Typography>
                    </CardContent>
                  </Card>
              </Grid>
            </Grid>
          </Box>
        )}

          {/* Recent Bookings */}
        {recentBookings.length > 0 && (
          <Box mb={6}>
            <Typography variant="h5" fontWeight="bold" mb={3}>
              Your Recent Bookings
            </Typography>
            <Grid container spacing={3}>
              {recentBookings.slice(0, 4).map((booking) => (
                <Grid item xs={12} md={6} key={booking.id}>
                  <BookingCard booking={booking} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default HomePage; 