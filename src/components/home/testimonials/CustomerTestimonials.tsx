import  { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Quote, Star } from 'lucide-react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Card, CardContent } from '../../ui/card';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  text: string;
  destination: string;
  tripType: string;
  date: string;
  verified: boolean;
}

export function CustomerTestimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Emily Johnson',
      location: 'New York, USA',
      avatar: '/testimonials/emily.jpg',
      rating: 5,
      text: 'Our trip to Santorini was absolutely magical! The SafarWay team took care of every detail from flights to accommodations. The local guides were incredibly knowledgeable, and we discovered hidden gems we would never have found on our own. Definitely exceeded our expectations!',
      destination: 'Santorini, Greece',
      tripType: 'Honeymoon',
      date: '2025-03-15',
      verified: true
    },
    {
      id: '2',
      name: 'Marcus Chen',
      location: 'Toronto, Canada',
      avatar: '/testimonials/marcus.jpg',
      rating: 5,
      text: "The safari experience in Kenya was life-changing. Seeing the \"Big Five\" in their natural habitat was breathtaking. Our guide James was exceptional - his knowledge of wildlife and photography tips made this trip unforgettable. SafarWay's attention to detail and sustainable tourism practices impressed me.",
      destination: 'Maasai Mara, Kenya',
      tripType: 'Safari Adventure',
      date: '2025-02-20',
      verified: true
    },
    {
      id: '3',
      name: 'Sophia Rodriguez',
      location: 'Miami, USA',
      avatar: '/testimonials/sophia.jpg',
      rating: 4,
      text: 'As a solo female traveler, safety was my priority. The Japan tour was perfectly organized with the right balance of guided activities and free time. The cultural experiences arranged by SafarWay were authentic and immersive. My only suggestion would be more food options for dietary restrictions.',
      destination: 'Tokyo & Kyoto, Japan',
      tripType: 'Cultural Tour',
      date: '2025-04-05',
      verified: true
    },
    {
      id: '4',
      name: 'David & Sarah Wilson',
      location: 'London, UK',
      avatar: '/testimonials/david-sarah.jpg',
      rating: 5,
      text: "Traveling with our three children (ages 5-12) seemed daunting, but SafarWay's family package to Costa Rica was perfect! The kids-friendly activities kept everyone engaged and the eco-lodge accommodations were comfortable yet authentic. The private transfers between destinations made traveling with kids stress-free.",
      destination: 'Costa Rica',
      tripType: 'Family Adventure',
      date: '2025-01-30',
      verified: true
    },
    {
      id: '5',
      name: 'Raj Patel',
      location: 'Melbourne, Australia',
      avatar: '/testimonials/raj.jpg',
      rating: 5,
      text: "The Patagonia hiking expedition was challenging and rewarding! SafarWay provided excellent pre-trip preparation guides and top-quality gear recommendations. Our guide was attentive to everyone's pace and abilities. The scenery was spectacular, and the small group size made for a personalized experience.",
      destination: 'Patagonia, Argentina & Chile',
      tripType: 'Hiking Expedition',
      date: '2025-03-01',
      verified: true
    }
  ];

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  // Handle testimonial autoplay
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoplay) {
      interval = setInterval(() => {
        nextTestimonial();
      }, 6000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoplay, activeIndex]);

  // Pause autoplay when user interacts
  const pauseAutoplay = () => {
    setAutoplay(false);
    // Resume after 30 seconds
    setTimeout(() => setAutoplay(true), 30000);
  };

  // Render stars based on rating
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  // Format date to be more readable
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <section className="py-24 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-3">Traveler Stories</Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            What Our Customers Say
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Real experiences from real travelers. Discover why thousands choose SafarWay 
            for their unforgettable adventures around the world.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto" onMouseEnter={pauseAutoplay} onTouchStart={pauseAutoplay}>
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <Card className="border-0 shadow-lg bg-white overflow-hidden">
                    <CardContent className="p-8">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/3 flex flex-col items-center">
                          <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4">
                            <img
                              src={testimonial.avatar}
                              alt={testimonial.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <h3 className="font-semibold text-lg text-center">{testimonial.name}</h3>
                          <p className="text-gray-500 text-sm text-center mb-2">{testimonial.location}</p>
                          
                          <div className="flex items-center mb-3">
                            {renderStars(testimonial.rating)}
                          </div>
                          
                          {testimonial.verified && (
                            <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">
                              Verified Traveler
                            </Badge>
                          )}
                          
                          <div className="mt-4 text-center">
                            <p className="text-sm font-medium">{testimonial.destination}</p>
                            <p className="text-xs text-gray-500">{testimonial.tripType}</p>
                            <p className="text-xs text-gray-500 mt-1">{formatDate(testimonial.date)}</p>
                          </div>
                        </div>
                        
                        <div className="md:w-2/3">
                          <Quote className="h-8 w-8 text-primary/20 mb-4" />
                          <p className="text-gray-700 italic leading-relaxed mb-6">
                            {testimonial.text}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center mt-8 gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => {
                prevTestimonial();
                pauseAutoplay();
              }}
              className="rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            
            <div className="flex items-center gap-2 mx-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    index === activeIndex ? 'bg-primary' : 'bg-gray-300'
                  }`}
                  onClick={() => {
                    setActiveIndex(index);
                    pauseAutoplay();
                  }}
                >
                  <span className="sr-only">Testimonial {index + 1}</span>
                </button>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => {
                nextTestimonial();
                pauseAutoplay();
              }}
              className="rounded-full"
            >
              <ArrowRight className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Badge className="mb-2">
            4.8/5 Average Rating
          </Badge>
          <p className="text-sm text-gray-500">
            Based on 2,483 verified customer reviews
          </p>
        </div>
      </div>
    </section>
  );
} 