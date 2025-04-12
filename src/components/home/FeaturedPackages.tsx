import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PackageCard } from '../packages/PackageCard';
import { Button } from '../ui/button';
import { tourAPI } from '../../services/api';

interface FeaturedPackagesProps {
  className?: string;
  limit?: number;
}

export function FeaturedPackages({ className = '', limit = 6 }: FeaturedPackagesProps) {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = await tourAPI.getAll({ limit, featured: true });
        const packagesData = response?.data?.items || [];
        setPackages(Array.isArray(packagesData) ? packagesData : []);
      } catch (err) {
        console.error('Error fetching featured packages:', err);
        setError('Failed to load featured packages');
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [limit]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl"
          >
            Featured Travel Packages
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-lg text-gray-600"
          >
            Discover our handpicked selection of the most exciting travel experiences.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-center text-gray-500">{error}</p>
          </div>
        ) : packages.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-center text-gray-500">No featured packages available at the moment.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {packages.map((pkg) => (
              <motion.div key={pkg.id} variants={itemVariants}>
                <PackageCard
                  id={pkg.id}
                  title={pkg.title}
                  description={pkg.description}
                  location={pkg.location}
                  price={pkg.price}
                  duration={pkg.duration}
                  maxParticipants={pkg.maxParticipants}
                  rating={pkg.rating || 4.5}
                  imageUrl={pkg.coverImage || 'https://via.placeholder.com/600x400?text=Travel+Package'}
                  agencyName={pkg.agency?.name || 'SafarWay Agency'}
                  agencyLogo={pkg.agency?.logo}
                  discount={pkg.discount}
                  isFeatured={pkg.isFeatured}
                  isPopular={pkg.isPopular}
                  isNew={pkg.isNew}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link to="/packages">
            <Button size="lg" className="gap-2">
              View All Packages
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
} 