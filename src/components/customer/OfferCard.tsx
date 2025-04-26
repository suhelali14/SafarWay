import React from 'react';
import { Card, CardContent, Typography, Box, Button, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// Styled components
const OfferImage = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '120px',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
  position: 'relative',
}));

const DiscountBadge = styled(Box)(() => ({
  position: 'absolute',
  top: 16,
  right: 16,
  backgroundColor: '#EC5B24',
  color: 'white',
  padding: '4px 8px',
  borderRadius: '4px',
  fontWeight: 'bold',
  fontSize: '0.875rem',
}));

interface OfferCardProps {
  offer: {
    id: string;
    title: string;
    description: string;
    code: string;
    discount: number;
    validUntil: string;
    imageUrl?: string;
  };
  onCopyCode?: (code: string) => void;
}

const OfferCard: React.FC<OfferCardProps> = ({ 
  offer, 
  onCopyCode = () => {} 
}) => {
  const {
 
    title,
    description,
    code,
    discount,
    validUntil,
    imageUrl = 'https://images.unsplash.com/photo-1580910051074-3eb694886505?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  } = offer;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    onCopyCode(code);
  };
  
  const daysRemaining = () => {
    const today = new Date();
    const expiry = new Date(validUntil);
    const diffTime = Math.abs(expiry.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
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
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
        }
      }}
    >
      <OfferImage sx={{ backgroundImage: `url(${imageUrl})` }}>
        <DiscountBadge>
          {discount}% OFF
        </DiscountBadge>
      </OfferImage>
      
      <CardContent sx={{ flex: 1, p: 2 }}>
        <Box display="flex" alignItems="center" mb={1}>
          <LocalOfferIcon color="primary" fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="h6" component="div" fontWeight="bold">
            {title}
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
        
        <Box 
          display="flex" 
          alignItems="center" 
          justifyContent="space-between"
          bgcolor="#f5f5f5" 
          p={1}
          borderRadius={1}
          mb={2}
        >
          <Typography variant="body2" fontWeight="bold" sx={{ letterSpacing: 1 }}>
            {code}
          </Typography>
          <Button 
            size="small" 
            startIcon={<ContentCopyIcon />}
            onClick={handleCopyCode}
          >
            Copy
          </Button>
        </Box>
        
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Chip 
            label={`Valid till ${formatDate(validUntil)}`} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
          <Typography variant="caption" color="error" fontWeight="bold">
            {daysRemaining()} days left
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OfferCard; 