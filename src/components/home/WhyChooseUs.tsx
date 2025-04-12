import { motion } from 'framer-motion';
import { Shield, CreditCard, Users, Globe, Clock, Heart } from 'lucide-react';
import { Card } from '../ui/card';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface WhyChooseUsProps {
  className?: string;
}

export function WhyChooseUs({ className = '' }: WhyChooseUsProps) {
  const features: Feature[] = [
    {
      icon: <Shield className="h-10 w-10 text-amber-500" />,
      title: 'Verified Agencies',
      description: 'All our travel agencies are thoroughly vetted and verified for your safety and peace of mind.',
    },
    {
      icon: <CreditCard className="h-10 w-10 text-amber-500" />,
      title: 'Secure Payments',
      description: 'Your payments are protected with industry-standard encryption and secure payment gateways.',
    },
    {
      icon: <Users className="h-10 w-10 text-amber-500" />,
      title: 'Expert Guides',
      description: 'Travel with knowledgeable local guides who bring destinations to life with their expertise.',
    },
    {
      icon: <Globe className="h-10 w-10 text-amber-500" />,
      title: 'Global Destinations',
      description: 'Explore a wide range of destinations across India and around the world with our curated packages.',
    },
    {
      icon: <Clock className="h-10 w-10 text-amber-500" />,
      title: '24/7 Support',
      description: 'Our customer support team is available around the clock to assist you with any queries.',
    },
    {
      icon: <Heart className="h-10 w-10 text-amber-500" />,
      title: 'Personalized Experiences',
      description: 'Tailored travel experiences designed to match your preferences and create unforgettable memories.',
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
            Why Choose SafarWay
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-lg text-gray-600"
          >
            We're committed to providing you with the best travel experience, from booking to your return home.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full p-6 transition-all duration-300 hover:shadow-lg">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 