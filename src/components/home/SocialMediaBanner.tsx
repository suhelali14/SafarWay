import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Compass, Play, Users, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

const SocialMediaBanner: React.FC = () => {
  const features = [
    {
      icon: Camera,
      title: 'Share Your Journey',
      description: 'Post photos and videos from your amazing travels',
      link: '/posts',
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      icon: Compass,
      title: 'Explore Stories',
      description: 'Discover incredible experiences from fellow travelers',
      link: '/explore',
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      icon: Play,
      title: 'Watch Reels',
      description: 'Enjoy short travel videos and get inspired',
      link: '/reels',
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <span className="text-yellow-400 font-medium text-lg">NEW FEATURES</span>
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Share Your Travel Story
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Join our travel community! Share your experiences, discover amazing destinations, 
            and connect with fellow adventurers around the world.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
            >
              <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-blue-100 mb-4">{feature.description}</p>
              <Link
                to={feature.link}
                className="inline-flex items-center gap-2 text-white hover:text-yellow-400 transition-colors font-medium"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Users className="w-6 h-6 text-yellow-400" />
              <span className="text-yellow-400 font-medium">Join 10,000+ Travelers</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Share Your Adventure?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Upload your travel photos, create engaging reels, and inspire others with your journey. 
              Your next adventure starts with sharing your last one!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8"
              >
                <Link to="/posts" className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Share Your Story
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8"
              >
                <Link to="/explore" className="flex items-center gap-2">
                  <Compass className="w-5 h-5" />
                  Explore Stories
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { number: '50K+', label: 'Travel Posts' },
            { number: '25K+', label: 'Active Users' },
            { number: '100+', label: 'Countries' },
            { number: '1M+', label: 'Memories Shared' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.number}</div>
              <div className="text-blue-200 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialMediaBanner;
