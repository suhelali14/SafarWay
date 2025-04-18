import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, MapPin, Calendar, Star, Package } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { AgencyDetails } from '../../lib/api/agency';
import { formatDate } from '../../utils/formatters';

interface AgencyCardProps {
  agency: AgencyDetails;
}

export function AgencyCard({ agency }: AgencyCardProps) {
  const {
    id,
    name,
    logo,
    location,
    rating,
    reviewCount,
    packageCount,
    isVerified,
    founded,
    description
  } = agency;

  // Fallback logo
  const fallbackLogo = 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80';
  
  return (
    <motion.div
      className="rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow h-full"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Agency Logo/Banner */}
      <div className="relative h-40 bg-gray-100">
        <img 
          src={logo || fallbackLogo} 
          alt={`${name} logo`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Verified Badge */}
        {isVerified && (
          <Badge 
            className="absolute top-2 right-2 bg-green-500 hover:bg-green-600"
          >
            Verified
          </Badge>
        )}
      </div>
      
      {/* Agency Content */}
      <div className="p-4 flex flex-col h-[calc(100%-10rem)]">
        <div className="flex flex-col space-y-2 flex-grow">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold line-clamp-1">{name}</h3>
            
            {/* Star Rating */}
            <div className="flex items-center">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500 mr-1" />
              <span className="text-sm font-medium">
                {rating.toFixed(1)} ({reviewCount})
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>{location}</span>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">{description}</p>
          
          <div className="flex gap-4 mt-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Package className="h-4 w-4 text-gray-500" />
              <span>{packageCount} packages</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>Since {new Date(founded).getFullYear()}</span>
            </div>
          </div>
        </div>
        
        <Button asChild className="w-full mt-4">
          <Link to={`/agency/${id}`}>View Agency</Link>
        </Button>
      </div>
    </motion.div>
  );
} 