import React from 'react';
import { Card, CardContent, Typography, Avatar, Box, Rating } from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

interface TestimonialCardProps {
  testimonial: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    text: string;
    date: string;
  };
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        pt: 4,
        borderRadius: 2
      }}
      elevation={2}
    >
      <Box 
        sx={{ 
          position: 'absolute', 
          top: -20, 
          left: '50%', 
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Avatar 
          src={testimonial.avatar} 
          alt={testimonial.name}
          sx={{ 
            width: 60, 
            height: 60,
            border: '2px solid white',
            boxShadow: '0px 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          {!testimonial.avatar && testimonial.name.charAt(0)}
        </Avatar>
      </Box>
      
      <CardContent sx={{ flex: 1, textAlign: 'center', pt: 2 }}>
        <Typography variant="h6" gutterBottom>
          {testimonial.name}
        </Typography>
        
        <Rating 
          value={testimonial.rating} 
          readOnly 
          precision={0.5}
          sx={{ mb: 2 }}
        />
        
        <Box sx={{ position: 'relative', mb: 1 }}>
          <FormatQuoteIcon 
            sx={{ 
              position: 'absolute', 
              left: -5, 
              top: -5,
              opacity: 0.2,
              fontSize: '1.5rem',
              transform: 'rotate(180deg)'
            }} 
          />
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              fontStyle: 'italic',
              px: 3
            }}
          >
            {testimonial.text}
          </Typography>
          <FormatQuoteIcon 
            sx={{ 
              position: 'absolute', 
              right: -5, 
              bottom: -5,
              opacity: 0.2,
              fontSize: '1.5rem'
            }} 
          />
        </Box>
        
        <Typography 
          variant="caption" 
          color="text.secondary"
          sx={{ mt: 2, display: 'block' }}
        >
          {testimonial.date}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard; 