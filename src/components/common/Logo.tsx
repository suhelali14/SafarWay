import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'light';
}

export function Logo({ variant = 'default', className, ...props }: LogoProps) {
  const textColor = variant === 'light' ? 'text-white' : 'text-primary-600';

  return (
    <div className={`flex items-center ${className}`} {...props}>
      <Link to="/" className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8 mr-2 text-primary"
        >
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span className={`text-xl font-bold ${textColor}`}>SafarWay</span>
      </Link>
    </div>
  );
} 