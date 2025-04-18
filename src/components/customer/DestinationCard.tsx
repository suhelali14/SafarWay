import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface DestinationCardProps {
  destination: {
    id: string;
    name: string;
    imageUrl: string;
    packageCount: number;
  };
  onClick: (id: string) => void;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination, onClick }) => {
  return (
    <Paper
      sx={{
        position: 'relative',
        height: 180,
        borderRadius: 2,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.3s',
        '&:hover': {
          transform: 'scale(1.05)'
        }
      }}
      onClick={() => onClick(destination.id)}
      elevation={3}
    >
      <Box
        component="img"
        src={destination.imageUrl}
        alt={destination.name}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
          p: 2,
          color: 'white'
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {destination.name}
        </Typography>
        <Typography variant="body2">
          {destination.packageCount} packages available
        </Typography>
      </Box>
    </Paper>
  );
};

export default DestinationCard; 