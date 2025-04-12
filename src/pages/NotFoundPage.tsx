import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link
          to="/dashboard"
          className="mt-8 inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg transition-colors"
        >
          <Home className="h-5 w-5" />
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}; 