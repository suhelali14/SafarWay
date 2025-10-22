import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Compass, Play, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import NewBadge from '../ui/NewBadge';

const FeatureShowcase: React.FC = () => {
  const newFeatures = [
    {
      title: "Travel Posts",
      description: "Share your travel experiences with stunning photos and stories",
      icon: Camera,
      href: "/posts",
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600",
      badge: true
    },
    {
      title: "Explore Feed",
      description: "Discover amazing travel destinations through community posts",
      icon: Compass,
      href: "/explore",
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600",
      badge: true
    },
    {
      title: "Video Reels",
      description: "Watch short travel videos and create your own",
      icon: Play,
      href: "/reels",
      color: "bg-purple-50 border-purple-200",
      iconColor: "text-purple-600",
      badge: true
    }
  ];

  return (
    <div className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="h-6 w-6 text-orange-500" />
            <h2 className="text-3xl font-bold text-gray-900">New Features</h2>
            <NewBadge />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our exciting new social features designed to enhance your travel experience and connect you with fellow travelers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newFeatures.map((feature) => (
            <Card 
              key={feature.title} 
              className={`relative ${feature.color} border-2 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
            >
              <CardContent className="p-6">
                {feature.badge && (
                  <div className="absolute -top-2 -right-2">
                    <NewBadge />
                  </div>
                )}
                
                <div className={`inline-flex p-3 rounded-lg ${feature.iconColor} bg-white mb-4`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>
                
                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full border-current hover:bg-white/50"
                >
                  <Link to={feature.href}>
                    Try It Now
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600">
            <Link to="/posts">
              Start Sharing Your Journey
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeatureShowcase;
