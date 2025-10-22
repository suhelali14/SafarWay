import React from 'react';

interface NewBadgeProps {
  className?: string;
}

const NewBadge: React.FC<NewBadgeProps> = ({ className = '' }) => {
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-pink-500 to-purple-600 text-white animate-pulse ${className}`}>
      NEW
    </span>
  );
};

export default NewBadge;
