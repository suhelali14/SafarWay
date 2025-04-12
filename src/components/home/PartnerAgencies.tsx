import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface PartnerAgenciesProps {
  className?: string;
}

export function PartnerAgencies({ className = '' }: PartnerAgenciesProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  // Sample partner agencies data
  const partners = [
    {
      id: 1,
      name: 'Adventure Tours India',
      logo: 'https://via.placeholder.com/150x80?text=Adventure+Tours',
    },
    {
      id: 2,
      name: 'Heritage Travels',
      logo: 'https://via.placeholder.com/150x80?text=Heritage+Travels',
    },
    {
      id: 3,
      name: 'Wildlife Expeditions',
      logo: 'https://via.placeholder.com/150x80?text=Wildlife+Expeditions',
    },
    {
      id: 4,
      name: 'Luxury Escapes',
      logo: 'https://via.placeholder.com/150x80?text=Luxury+Escapes',
    },
    {
      id: 5,
      name: 'Cultural Journeys',
      logo: 'https://via.placeholder.com/150x80?text=Cultural+Journeys',
    },
    {
      id: 6,
      name: 'Mountain Adventures',
      logo: 'https://via.placeholder.com/150x80?text=Mountain+Adventures',
    },
    {
      id: 7,
      name: 'Beach Getaways',
      logo: 'https://via.placeholder.com/150x80?text=Beach+Getaways',
    },
    {
      id: 8,
      name: 'Spiritual Tours',
      logo: 'https://via.placeholder.com/150x80?text=Spiritual+Tours',
    },
  ];

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
    <section className={`py-16 bg-gray-50 ${className}`} ref={ref}>
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl"
          >
            Our Trusted Partners
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-lg text-gray-600"
          >
            We collaborate with the best travel agencies to bring you exceptional travel experiences.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8"
        >
          {partners.map((partner) => (
            <motion.div
              key={partner.id}
              variants={itemVariants}
              className="flex items-center justify-center"
            >
              <div className="group relative h-20 w-full overflow-hidden rounded-lg bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="text-sm font-medium text-white">{partner.name}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <a
            href="/agencies"
            className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-amber-600"
          >
            Become a Partner Agency
          </a>
        </motion.div>
      </div>
    </section>
  );
} 