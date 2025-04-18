import React from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import TestimonialCard from './TestimonialCard';

interface Testimonial {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  text: string;
  date: string;
}

interface TestimonialSectionProps {
  title?: string;
  testimonials: Testimonial[];
}

const TestimonialSection: React.FC<TestimonialSectionProps> = ({ 
  title = "What Our Travelers Say",
  testimonials 
}) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <Box sx={{ py: 8, backgroundColor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h4" 
          component="h2" 
          align="center" 
          gutterBottom
          sx={{ 
            mb: 6,
            fontWeight: 'bold',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -10,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 80,
              height: 3,
              backgroundColor: 'primary.main',
              borderRadius: 1
            }
          }}
        >
          {title}
        </Typography>
        
        {testimonials.length > 3 ? (
          <Box sx={{ px: { xs: 2, md: 0 } }}>
            <Slider {...settings}>
              {testimonials.map((testimonial) => (
                <Box key={testimonial.id} sx={{ p: 2 }}>
                  <TestimonialCard testimonial={testimonial} />
                </Box>
              ))}
            </Slider>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {testimonials.map((testimonial) => (
              <Grid item xs={12} sm={6} md={4} key={testimonial.id}>
                <TestimonialCard testimonial={testimonial} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default TestimonialSection; 