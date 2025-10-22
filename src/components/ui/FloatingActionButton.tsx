import React, { useState } from 'react';
import { Camera, Compass, Play, X, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import NewBadge from './NewBadge';

const FloatingActionButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const actions = [
    {
      label: 'Create Post',
      icon: Camera,
      href: '/posts',
      color: 'bg-blue-500 hover:bg-blue-600',
      delay: 0.1
    },
    {
      label: 'Explore',
      icon: Compass,
      href: '/explore',
      color: 'bg-green-500 hover:bg-green-600',
      delay: 0.2
    },
    {
      label: 'Watch Reels',
      icon: Play,
      href: '/reels',
      color: 'bg-purple-500 hover:bg-purple-600',
      delay: 0.3
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="mb-4 space-y-3"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            {actions.map((action) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: action.delay }}
                className="flex items-center"
              >
                <div className="bg-white px-3 py-2 rounded-lg shadow-lg mr-3 whitespace-nowrap border relative">
                  <span className="text-sm font-medium text-gray-700">{action.label}</span>
                  <NewBadge className="absolute -top-1 -right-1 scale-75" />
                </div>
                <Link 
                  to={action.href}
                  className={`p-3 rounded-full text-white shadow-lg transition-all duration-200 hover:scale-110 ${action.color}`}
                  onClick={() => setIsOpen(false)}
                >
                  <action.icon className="w-5 h-5" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.button
        onClick={toggleOpen}
        className="relative w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </motion.div>
        
        {!isOpen && (
          <div className="absolute -top-1 -right-1">
            <NewBadge />
          </div>
        )}
      </motion.button>
    </div>
  );
};

export default FloatingActionButton;
