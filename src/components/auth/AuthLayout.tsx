import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

export const AuthLayout = ({
  children,
  title,
  subtitle,
  className,
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className={cn("w-full max-w-md space-y-8", className)}>
          <div className="text-center">
            <Link to="/" className="inline-block">
              <img
                src="/logo.svg"
                alt="SafarWay Logo"
                className="h-12 w-auto mx-auto"
              />
            </Link>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
          {children}
        </div>
      </div>

      {/* Right side - Background Image */}
      <div className="hidden md:block md:w-1/2 bg-cover bg-center" 
           style={{ backgroundImage: 'url("/auth-bg.jpg")' }}>
        <div className="h-full w-full bg-black/30 flex items-center justify-center p-8">
          <div className="text-center text-white max-w-lg">
            <h1 className="text-4xl font-bold mb-4">Welcome to SafarWay</h1>
            <p className="text-lg">
              Discover amazing destinations, book unforgettable tours, and create memories that last a lifetime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 