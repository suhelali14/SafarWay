import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Calendar, Clock, Users, MapPin, Check, X, Phone, Mail, MessageCircle, Star, Share2, Heart, ArrowLeft } from "lucide-react"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion"

// Mock data - replace with actual API call
const mockTour = {
  id: "1",
  title: "Himalayan Adventure Trek",
  subtitle: "Experience the majesty of the Himalayas",
  description: "Embark on an unforgettable journey through the majestic Himalayas, where towering peaks touch the sky and ancient monasteries cling to mountainsides. This 7-day adventure takes you through pristine trails, offering breathtaking views of snow-capped mountains, lush valleys, and remote villages. Experience the rich culture of the Sherpa people, visit ancient monasteries, and camp under the stars in the world's highest mountain range. Whether you're an experienced trekker or a first-time adventurer, this tour is designed to provide an authentic Himalayan experience with the perfect balance of challenge and comfort.",
  price: 29999,
  duration: 7,
  maxGroupSize: 12,
  type: "adventure",
  coverImage: "https://images.unsplash.com/photo-1544731612-de7f96afe55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  gallery: [
    "https://images.unsplash.com/photo-1544731612-de7f96afe55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
    "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
  ],
  highlights: [
    "Trek through pristine Himalayan trails",
    "Camp under the stars",
    "Visit ancient monasteries",
    "Experience local culture",
    "Breathtaking mountain views",
    "Professional guides",
    "All meals included",
    "Transportation provided"
  ],
  included: [
    "Professional guide",
    "All meals during trek",
    "Camping equipment",
    "First aid kit",
    "Transportation",
    "Permits and entrance fees",
    "Accommodation in teahouses",
    "Airport transfers"
  ],
  excluded: [
    "Personal expenses",
    "Travel insurance",
    "Tips for guides",
    "Additional meals",
    "International flights",
    "Visa fees",
    "Personal trekking gear"
  ],
  itinerary: [
    {
      day: 1,
      title: "Arrival in Kathmandu",
      description: "Welcome to Nepal! Transfer to hotel, evening briefing.",
      activities: [
        {
          time: "14:00",
          title: "Airport Pickup",
          description: "Meet and greet at Tribhuvan International Airport"
        },
        {
          time: "19:00",
          title: "Welcome Dinner",
          description: "Traditional Nepali dinner with the team"
        }
      ],
      meals: {
        breakfast: false,
        lunch: false,
        dinner: true
      },
      accommodation: {
        name: "Hotel Yak & Yeti",
        type: "Luxury Hotel"
      },
      transport: {
        type: "car",
        details: "Private vehicle transfer"
      }
    },
    {
      day: 2,
      title: "Kathmandu to Lukla",
      description: "Early morning flight to Lukla, trek to Phakding.",
      activities: [
        {
          time: "06:00",
          title: "Flight to Lukla",
          description: "Scenic flight to Tenzing-Hillary Airport"
        },
        {
          time: "10:00",
          title: "Start Trekking",
          description: "Begin trek to Phakding village"
        }
      ],
      meals: {
        breakfast: true,
        lunch: true,
        dinner: true
      },
      accommodation: {
        name: "Teahouse in Phakding",
        type: "Mountain Lodge"
      },
      transport: {
        type: "flight",
        details: "Domestic flight + trekking"
      }
    },
    {
      day: 3,
      title: "Phakding to Namche Bazaar",
      description: "Trek to the bustling town of Namche Bazaar.",
      activities: [
        {
          time: "08:00",
          title: "Morning Trek",
          description: "Cross suspension bridges and ascend to Namche"
        },
        {
          time: "14:00",
          title: "Arrival in Namche",
          description: "Explore the vibrant market town"
        }
      ],
      meals: {
        breakfast: true,
        lunch: true,
        dinner: true
      },
      accommodation: {
        name: "Teahouse in Namche",
        type: "Mountain Lodge"
      },
      transport: {
        type: "trekking",
        details: "On foot"
      }
    }
  ],
  contactInfo: {
    phone: "+91 9876543210",
    email: "info@himalayanadventures.com",
    whatsapp: "+91 9876543210"
  },
  location: "Nepal",
  rating: 4.8,
  reviews: 124,
  featured: true,
  tags: ["trekking", "camping", "photography"]
};

export default function TourDetailsPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === mockTour.gallery.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? mockTour.gallery.length - 1 : prev - 1
    );
  };

  // Format price with commas
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    });
  };

  return (
    <div className="min-h-screen bg-sky-50">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link to="/tours" className="inline-flex items-center text-sky-600 hover:text-sky-700 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Tours
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px]">
        <img
          src={mockTour.coverImage}
          alt={mockTour.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between animate-fadeIn">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {mockTour.title}
                </h1>
                <p className="text-xl text-white/90 mb-6">{mockTour.subtitle}</p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-white">
                    <MapPin className="h-5 w-5 text-sky-300" />
                    <span>{mockTour.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <Clock className="h-5 w-5 text-sky-300" />
                    <span>{mockTour.duration} days</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <Users className="h-5 w-5 text-sky-300" />
                    <span>Max {mockTour.maxGroupSize} people</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span>{mockTour.rating} ({mockTour.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 md:mt-0 flex gap-2">
                <Button variant="outline" size="icon" className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors">
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={`${isWishlisted ? 'bg-white/20 text-red-500 border-white/30 hover:bg-white/30' : 'bg-white/20 text-white border-white/30 hover:bg-white/30'} transition-colors`}
                  onClick={() => setIsWishlisted(!isWishlisted)}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white rounded-lg shadow-md p-6 animate-fadeIn">
              <TabsList className="mb-8 border-b">
                <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-sky-500">Overview</TabsTrigger>
                <TabsTrigger value="itinerary" className="data-[state=active]:border-b-2 data-[state=active]:border-sky-500">Itinerary</TabsTrigger>
                <TabsTrigger value="gallery" className="data-[state=active]:border-b-2 data-[state=active]:border-sky-500">Gallery</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
                {/* Description */}
                <div>
                  <h2 className="text-2xl font-semibold mb-4">About this tour</h2>
                  <p className="text-gray-600 leading-relaxed">{mockTour.description}</p>
                </div>

                {/* Highlights */}
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Highlights</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockTour.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-3 bg-sky-50 p-3 rounded-lg hover:bg-sky-100 transition-colors">
                        <Check className="h-5 w-5 text-sky-600 mt-1 flex-shrink-0" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What's Included/Excluded */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">What's Included</h2>
                    <div className="space-y-3">
                      {mockTour.included.map((item, index) => (
                        <div key={index} className="flex items-start gap-3 hover:bg-sky-50 p-2 rounded-lg transition-colors">
                          <Check className="h-5 w-5 text-sky-600 mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">What's Excluded</h2>
                    <div className="space-y-3">
                      {mockTour.excluded.map((item, index) => (
                        <div key={index} className="flex items-start gap-3 hover:bg-red-50 p-2 rounded-lg transition-colors">
                          <X className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="itinerary">
                <Accordion type="single" collapsible className="space-y-4">
                  {mockTour.itinerary.map((day, index) => (
                    <AccordionItem key={index} value={`day-${index}`} className="border rounded-lg overflow-hidden hover:border-sky-300 transition-colors">
                      <AccordionTrigger className="px-4 py-3 text-lg font-medium hover:bg-sky-50 transition-colors">
                        Day {day.day}: {day.title}
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <p className="text-gray-600 mb-4">{day.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Activities */}
                          <div>
                            <h3 className="font-medium mb-2">Activities</h3>
                            <div className="space-y-3">
                              {day.activities.map((activity, idx) => (
                                <div key={idx} className="flex gap-3 hover:bg-sky-50 p-2 rounded-lg transition-colors">
                                  <div className="w-16 text-sm text-gray-500">{activity.time}</div>
                                  <div>
                                    <div className="font-medium">{activity.title}</div>
                                    <div className="text-sm text-gray-600">{activity.description}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Meals, Accommodation, Transport */}
                          <div className="space-y-4">
                            <div>
                              <h3 className="font-medium mb-2">Meals</h3>
                              <div className="flex gap-4">
                                {day.meals.breakfast && <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200" label="Breakfast" ></Badge>}
                                {day.meals.lunch && <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200" label="Lunch" ></Badge>}
                                {day.meals.dinner && <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200" label="Dinner"></Badge>}
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="font-medium mb-2">Accommodation</h3>
                              <div className="text-sm">
                                <div className="font-medium">{day.accommodation.name}</div>
                                <div className="text-gray-600">{day.accommodation.type}</div>
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="font-medium mb-2">Transport</h3>
                              <div className="text-sm">
                                <div className="font-medium capitalize">{day.transport.type}</div>
                                <div className="text-gray-600">{day.transport.details}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>

              <TabsContent value="gallery">
                <div className="space-y-4">
                  <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
                    <img
                      src={mockTour.gallery[currentImageIndex]}
                      alt={`Gallery image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {mockTour.gallery.length}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-2">
                    {mockTour.gallery.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`aspect-square rounded-md overflow-hidden ${currentImageIndex === index ? 'ring-2 ring-sky-500' : ''} hover:opacity-80 transition-opacity`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="shadow-md border-sky-100 animate-fadeIn">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span className="text-sky-600">{formatPrice(mockTour.price)}</span>
                    <span className="text-sm text-gray-500">per person</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-5 w-5 text-sky-500" />
                    <span>Select dates</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-5 w-5 text-sky-500" />
                    <span>Max {mockTour.maxGroupSize} people</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-5 w-5 text-sky-500" />
                    <span>{mockTour.duration} days</span>
                  </div>
                  
                  <div className="pt-4">
                    <Link to={`/tours/${id}/book`}>
                      <Button className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 transition-colors">Book Now</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6 shadow-md border-sky-100 animate-fadeIn" style={{ animationDelay: "200ms" }}>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 hover:bg-sky-50 p-2 rounded-lg transition-colors">
                    <Phone className="h-5 w-5 text-sky-500" />
                    <div>
                      <div className="text-sm text-gray-500">Phone</div>
                      <div>{mockTour.contactInfo.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 hover:bg-sky-50 p-2 rounded-lg transition-colors">
                    <Mail className="h-5 w-5 text-sky-500" />
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div>{mockTour.contactInfo.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 hover:bg-sky-50 p-2 rounded-lg transition-colors">
                    <MessageCircle className="h-5 w-5 text-sky-500" />
                    <div>
                      <div className="text-sm text-gray-500">WhatsApp</div>
                      <div>{mockTour.contactInfo.whatsapp}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 