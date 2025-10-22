import React, { useState } from 'react';
import { X, Camera, Compass, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import NewBadge from './NewBadge';

const AnnouncementBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white px-4 py-3 relative z-50"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <NewBadge />
              <span className="font-semibold">New Features Available!</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                to="/posts" 
                className="flex items-center space-x-1 hover:text-yellow-200 transition-colors"
              >
                <Camera className="w-4 h-4" />
                <span className="text-sm">Share Posts</span>
              </Link>
              
              <Link 
                to="/explore" 
                className="flex items-center space-x-1 hover:text-yellow-200 transition-colors"
              >
                <Compass className="w-4 h-4" />
                <span className="text-sm">Explore</span>
              </Link>
              
              <Link 
                to="/reels" 
                className="flex items-center space-x-1 hover:text-yellow-200 transition-colors"
              >
                <Play className="w-4 h-4" />
                <span className="text-sm">Watch Reels</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link 
              to="/posts" 
              className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-sm font-medium transition-colors hidden sm:block"
            >
              Try Now
            </Link>
            
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close announcement"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnnouncementBanner;
