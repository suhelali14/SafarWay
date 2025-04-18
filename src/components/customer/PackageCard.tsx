import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Button, Chip, IconButton } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

interface PackageProps {
  pkg: {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    destination: string;
    imageUrl: string;
    rating?: number;
  };
  isInWishlist: boolean;
  onAddToWishlist: (id: string) => void;
  onRemoveFromWishlist: (id: string) => void;
}

const PackageCard: React.FC<PackageProps> = ({ 
  pkg, 
  isInWishlist, 
  onAddToWishlist, 
  onRemoveFromWishlist 
}) => {
  return (
    <Card 
      sx={{ 
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
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="180"
          image={pkg.imageUrl}
          alt={pkg.name}
        />
        <IconButton 
          sx={{ 
            position: 'absolute', 
            top: 8, 
            right: 8, 
            backgroundColor: 'rgba(255,255,255,0.8)',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
          }}
          onClick={() => isInWishlist ? 
            onRemoveFromWishlist(pkg.id) : 
            onAddToWishlist(pkg.id)
          }
        >
          {isInWishlist ? 
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
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
          <Typography variant="h6" component="div" fontWeight="bold">
            {pkg.name}
          </Typography>
          {pkg.rating && (
            <Chip 
              size="small" 
              label={`${pkg.rating}★`} 
              sx={{ 
                backgroundColor: '#388e3c', 
                color: 'white',
                fontWeight: 'bold'
              }}
            />
          )}
        </Box>
        
        <Box display="flex" alignItems="center" mb={1}>
          <LocationOnIcon color="primary" fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            {pkg.destination}
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" mb={2}>
          {pkg.description}
        </Typography>
        
        <Box 
          mt="auto" 
          display="flex" 
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" color="primary" fontWeight="bold">
            ${pkg.price}
            <Typography component="span" variant="caption" color="text.secondary">
              /person
            </Typography>
          </Typography>
          
          <Button 
            variant="contained" 
            size="small"
            sx={{ backgroundColor: '#EC5B24', '&:hover': { backgroundColor: '#d44d1a' } }}
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PackageCard; 