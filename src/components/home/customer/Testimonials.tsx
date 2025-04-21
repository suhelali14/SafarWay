import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Button } from '../../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../../ui/avatar';
import { Badge } from '../../ui/badge';

interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  location: string;
  rating: number;
  date: string;
  text: string;
  tripType: string;
}

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "/avatars/sarah.jpg",
      location: "New York, USA",
      rating: 5,
      date: "June 2024",
      text: "Our family trip to Bali was absolutely magical! SafarWay handled everything perfectly from accommodation to guided tours. Our guide was knowledgeable and friendly, making us feel comfortable throughout the journey. Will definitely book with them again!",
      tripType: "Family Vacation"
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "/avatars/michael.jpg",
      location: "Toronto, Canada",
      rating: 5,
      date: "May 2024",
      text: "As a solo traveler, I was looking for a safe yet adventurous experience in Thailand. SafarWay exceeded all my expectations! The itinerary was perfectly balanced between activities and relaxation. The local experiences they arranged were authentic and unforgettable.",
      tripType: "Solo Adventure"
    },
    {
      id: 3,
      name: "Emma and James",
      avatar: "/avatars/couple.jpg",
      location: "London, UK",
      rating: 4,
      date: "April 2024",
      text: "Our honeymoon in Santorini was like a dream! The private sunset cruise and wine tasting tours were highlights. The only minor issue was a slight delay with our airport transfer, but the team resolved it quickly and professionally.",
      tripType: "Honeymoon"
    },
    {
      id: 4,
      name: "Raj Patel",
      avatar: "/avatars/raj.jpg",
      location: "Mumbai, India",
      rating: 5,
      date: "March 2024",
      text: "The guided tour of Japan during cherry blossom season was spectacular! Our small group bonded quickly, and the local guide's knowledge of hidden gems made the experience truly special. The accommodations were top-notch and the food recommendations were excellent.",
      tripType: "Group Tour"
    },
    {
      id: 5,
      name: "Maria Rodriguez",
      avatar: "/avatars/maria.jpg",
      location: "Barcelona, Spain",
      rating: 5,
      date: "February 2024",
      text: "My African safari experience was once-in-a-lifetime! The attention to detail in planning was impressive - from the luxury eco-lodges to the expert wildlife guides. I witnessed the big five and countless other animals in their natural habitat. Absolutely worth every penny!",
      tripType: "Safari Adventure"
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 7000);
    
    return () => clearInterval(interval);
  }, [autoplay, testimonials.length]);

  // Pause autoplay when user interacts with carousel
  const handleManualNavigation = (index: number) => {
    setActiveIndex(index);
    setAutoplay(false);
    
    // Resume autoplay after 15 seconds of inactivity
    const timeout = setTimeout(() => setAutoplay(true), 15000);
    return () => clearTimeout(timeout);
  };

  const handlePrevious = () => {
    const newIndex = activeIndex === 0 ? testimonials.length - 1 : activeIndex - 1;
    handleManualNavigation(newIndex);
  };

  const handleNext = () => {
    const newIndex = (activeIndex + 1) % testimonials.length;
    handleManualNavigation(newIndex);
  };

  // Render 5 stars with the specified rating filled
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        )}
      />
    ));
  };

  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <Badge variant="outline" className="mb-3">Trusted by Thousands</Badge>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            What Our Travelers Say
          </h2>
          <p className="mx-auto max-w-2xl text-gray-500">
            Read authentic experiences from travelers who've explored the world with SafarWay.
            Their stories inspire us to keep creating memorable journeys.
          </p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          {/* Decorative elements */}
          <div className="absolute -left-6 -top-6 h-20 w-20 rounded-full bg-primary/10" aria-hidden="true" />
          <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-primary/5" aria-hidden="true" />
          <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-secondary/5" aria-hidden="true" />

          {/* Testimonial carousel */}
          <div className="relative overflow-hidden rounded-xl bg-white p-8 shadow-lg">
            <div className="absolute right-8 top-8 text-primary/20">
              <Quote className="h-24 w-24 rotate-180" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="min-h-[300px]"
              >
                <div className="flex flex-col">
                  <div className="mb-6">
                    <Badge variant="secondary" className="mb-3">
                      {testimonials[activeIndex].tripType}
                    </Badge>
                    <div className="mb-2 flex items-center">
                      {renderStars(testimonials[activeIndex].rating)}
                      <span className="ml-2 text-sm text-gray-500">
                        {testimonials[activeIndex].date}
                      </span>
                    </div>
                    <p className="text-lg text-gray-700">
                      "{testimonials[activeIndex].text}"
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="mr-4 h-12 w-12 border-2 border-primary/10">
                        <AvatarImage src={testimonials[activeIndex].avatar} alt={testimonials[activeIndex].name} />
                        <AvatarFallback>
                          {testimonials[activeIndex].name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-gray-900">{testimonials[activeIndex].name}</h4>
                        <p className="text-sm text-gray-500">{testimonials[activeIndex].location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation controls */}
            <div className="mt-8 flex items-center justify-between">
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleManualNavigation(index)}
                    className={cn(
                      "h-2 w-8 rounded-full transition-all",
                      index === activeIndex ? "bg-primary" : "bg-gray-200 hover:bg-gray-300"
                    )}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevious}
                  className="rounded-full"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  className="rounded-full"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 