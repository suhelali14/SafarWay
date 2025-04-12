import { motion } from "framer-motion";
import { ArrowRight, Star, MapPin, Tag, Percent, User } from "lucide-react";

const hotelDeals = [
  {
    id: 1,
    name: "The Oberoi",
    location: "New Delhi",
    rating: 4.9,
    reviews: 732,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000",
    price: "₹8,599",
    originalPrice: "₹12,000",
    discount: "28% OFF",
    perks: ["Free Breakfast", "Free Cancellation"],
    categoryLabel: "Luxury"
  },
  {
    id: 2,
    name: "Taj Lake Palace",
    location: "Udaipur",
    rating: 4.8,
    reviews: 546,
    image: "https://images.unsplash.com/photo-1583424396585-64d33eb03698?q=80&w=1000",
    price: "₹25,499",
    originalPrice: "₹32,000",
    discount: "20% OFF",
    perks: ["Free Breakfast", "Pool Access"],
    categoryLabel: "Heritage"
  },
  {
    id: 3,
    name: "Golden Tulip",
    location: "Goa",
    rating: 4.5,
    reviews: 325,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000",
    price: "₹4,299",
    originalPrice: "₹6,500",
    discount: "33% OFF",
    perks: ["Beach Access", "Free WiFi"],
    categoryLabel: "Beach Resort"
  },
  {
    id: 4,
    name: "Club Mahindra",
    location: "Munnar",
    rating: 4.6,
    reviews: 412,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1000",
    price: "₹7,899",
    originalPrice: "₹9,800",
    discount: "19% OFF",
    perks: ["All Meals", "Activities Included"],
    categoryLabel: "Hill Resort"
  }
];

export function HotelDeals() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold">Luxury Stays & Hotels</h2>
            <p className="text-gray-600 mt-2">
              Enjoy special rates at these handpicked premium properties
            </p>
          </motion.div>
          
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="hidden md:flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            View All Hotels <ArrowRight className="h-4 w-4 ml-1" />
          </motion.button>
        </div>

        {/* Hotel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotelDeals.map((hotel, index) => (
            <motion.div
              key={hotel.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              {/* Image Section */}
              <div className="relative">
                <div className="h-48 overflow-hidden">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>
                
                {/* Category Label */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                  {hotel.categoryLabel}
                </div>
                
                {/* Discount Label */}
                <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                  <Percent className="h-3 w-3" />
                  <span>{hotel.discount}</span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-4">
                {/* Hotel Name and Rating */}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{hotel.name}</h3>
                  <div className="flex items-center gap-1 bg-green-100 px-2 py-0.5 rounded">
                    <span className="font-medium text-green-800">{hotel.rating}</span>
                    <Star className="h-3 w-3 fill-current text-yellow-500" />
                  </div>
                </div>
                
                {/* Location */}
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{hotel.location}</span>
                </div>
                
                {/* Perks */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {hotel.perks.map((perk) => (
                    <div key={perk} className="flex items-center text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                      <Tag className="h-3 w-3 mr-1" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
                
                {/* Reviews */}
                <div className="flex items-center text-xs text-gray-500 mb-3">
                  <User className="h-3 w-3 mr-1" />
                  <span>{hotel.reviews} verified reviews</span>
                </div>
                
                {/* Price Section */}
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-gray-500">Price per night</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-bold text-blue-600">{hotel.price}</p>
                      <p className="text-sm text-gray-400 line-through">{hotel.originalPrice}</p>
                    </div>
                    <p className="text-xs text-green-600">Includes taxes & fees</p>
                  </div>
                  <button className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-700 transition-colors">
                    View Deal
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Mobile View All Button */}
        <div className="mt-8 text-center md:hidden">
          <button className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-6 py-2 rounded-full text-sm font-medium transition-colors inline-flex items-center">
            View All Hotels <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 bg-white p-6 rounded-xl shadow-md"
        >
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold">Why Book Hotels with Us?</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              {
                icon: "🛡️",
                title: "Best Price Guarantee",
                description: "Find a lower price? We'll match it!"
              },
              {
                icon: "🎁",
                title: "Exclusive Deals",
                description: "Special prices available only on our platform"
              },
              {
                icon: "💳",
                title: "Pay at Hotel",
                description: "Book now, pay when you stay"
              },
              {
                icon: "🏆",
                title: "Verified Reviews",
                description: "Real feedback from real guests"
              }
            ].map((badge, i) => (
              <div key={i} className="p-4">
                <div className="text-3xl mb-2">{badge.icon}</div>
                <h4 className="font-medium mb-1">{badge.title}</h4>
                <p className="text-sm text-gray-500">{badge.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
} 
import { ArrowRight, Star, MapPin, Tag, Percent, User } from "lucide-react";

const hotelDeals = [
  {
    id: 1,
    name: "The Oberoi",
    location: "New Delhi",
    rating: 4.9,
    reviews: 732,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000",
    price: "₹8,599",
    originalPrice: "₹12,000",
    discount: "28% OFF",
    perks: ["Free Breakfast", "Free Cancellation"],
    categoryLabel: "Luxury"
  },
  {
    id: 2,
    name: "Taj Lake Palace",
    location: "Udaipur",
    rating: 4.8,
    reviews: 546,
    image: "https://images.unsplash.com/photo-1583424396585-64d33eb03698?q=80&w=1000",
    price: "₹25,499",
    originalPrice: "₹32,000",
    discount: "20% OFF",
    perks: ["Free Breakfast", "Pool Access"],
    categoryLabel: "Heritage"
  },
  {
    id: 3,
    name: "Golden Tulip",
    location: "Goa",
    rating: 4.5,
    reviews: 325,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000",
    price: "₹4,299",
    originalPrice: "₹6,500",
    discount: "33% OFF",
    perks: ["Beach Access", "Free WiFi"],
    categoryLabel: "Beach Resort"
  },
  {
    id: 4,
    name: "Club Mahindra",
    location: "Munnar",
    rating: 4.6,
    reviews: 412,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1000",
    price: "₹7,899",
    originalPrice: "₹9,800",
    discount: "19% OFF",
    perks: ["All Meals", "Activities Included"],
    categoryLabel: "Hill Resort"
  }
];

export function HotelDeals() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold">Luxury Stays & Hotels</h2>
            <p className="text-gray-600 mt-2">
              Enjoy special rates at these handpicked premium properties
            </p>
          </motion.div>
          
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="hidden md:flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            View All Hotels <ArrowRight className="h-4 w-4 ml-1" />
          </motion.button>
        </div>

        {/* Hotel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotelDeals.map((hotel, index) => (
            <motion.div
              key={hotel.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              {/* Image Section */}
              <div className="relative">
                <div className="h-48 overflow-hidden">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>
                
                {/* Category Label */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                  {hotel.categoryLabel}
                </div>
                
                {/* Discount Label */}
                <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                  <Percent className="h-3 w-3" />
                  <span>{hotel.discount}</span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-4">
                {/* Hotel Name and Rating */}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{hotel.name}</h3>
                  <div className="flex items-center gap-1 bg-green-100 px-2 py-0.5 rounded">
                    <span className="font-medium text-green-800">{hotel.rating}</span>
                    <Star className="h-3 w-3 fill-current text-yellow-500" />
                  </div>
                </div>
                
                {/* Location */}
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{hotel.location}</span>
                </div>
                
                {/* Perks */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {hotel.perks.map((perk) => (
                    <div key={perk} className="flex items-center text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                      <Tag className="h-3 w-3 mr-1" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
                
                {/* Reviews */}
                <div className="flex items-center text-xs text-gray-500 mb-3">
                  <User className="h-3 w-3 mr-1" />
                  <span>{hotel.reviews} verified reviews</span>
                </div>
                
                {/* Price Section */}
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-gray-500">Price per night</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-bold text-blue-600">{hotel.price}</p>
                      <p className="text-sm text-gray-400 line-through">{hotel.originalPrice}</p>
                    </div>
                    <p className="text-xs text-green-600">Includes taxes & fees</p>
                  </div>
                  <button className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-700 transition-colors">
                    View Deal
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Mobile View All Button */}
        <div className="mt-8 text-center md:hidden">
          <button className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-6 py-2 rounded-full text-sm font-medium transition-colors inline-flex items-center">
            View All Hotels <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 bg-white p-6 rounded-xl shadow-md"
        >
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold">Why Book Hotels with Us?</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              {
                icon: "🛡️",
                title: "Best Price Guarantee",
                description: "Find a lower price? We'll match it!"
              },
              {
                icon: "🎁",
                title: "Exclusive Deals",
                description: "Special prices available only on our platform"
              },
              {
                icon: "💳",
                title: "Pay at Hotel",
                description: "Book now, pay when you stay"
              },
              {
                icon: "🏆",
                title: "Verified Reviews",
                description: "Real feedback from real guests"
              }
            ].map((badge, i) => (
              <div key={i} className="p-4">
                <div className="text-3xl mb-2">{badge.icon}</div>
                <h4 className="font-medium mb-1">{badge.title}</h4>
                <p className="text-sm text-gray-500">{badge.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
} 