import { motion } from "framer-motion"
import { ChevronRight, Heart, Map, Calendar, Users, TrendingUp } from "lucide-react"

const destinations = [
  {
    name: "Goa",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1000",
    rating: 4.8,
    price: "₹12,999",
    duration: "4 Nights / 5 Days",
    category: "Beach",
    trending: true
  },
  {
    name: "Rajasthan",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1000",
    rating: 4.7,
    price: "₹15,499",
    duration: "6 Nights / 7 Days",
    category: "Heritage",
    trending: true
  },
  {
    name: "Kerala",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1000",
    rating: 4.9,
    price: "₹16,999",
    duration: "5 Nights / 6 Days",
    category: "Nature",
    trending: false
  },
  {
    name: "Andaman",
    image: "https://images.unsplash.com/photo-1586991359825-4382efa3d532?q=80&w=1000",
    rating: 4.9,
    price: "₹22,999",
    duration: "6 Nights / 7 Days",
    category: "Island",
    trending: true
  }
]

const categories = [
  { name: "All", icon: "🌟", active: true },
  { name: "Beach", icon: "🏖️", active: false },
  { name: "Mountain", icon: "⛰️", active: false },
  { name: "Heritage", icon: "🏰", active: false },
  { name: "Wildlife", icon: "🐯", active: false },
  { name: "Pilgrimage", icon: "🕍", active: false },
  { name: "Hill Station", icon: "🌄", active: false }
]

export function PopularDestinations() {
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
            <h2 className="text-2xl md:text-3xl font-bold">Trending Tour Packages</h2>
            <p className="text-gray-600 mt-2">
              Discover handpicked popular packages that travelers love
            </p>
          </motion.div>
          
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="hidden md:flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            View All Packages <ChevronRight className="h-4 w-4 ml-1" />
          </motion.button>
        </div>

        {/* Category Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 overflow-x-auto pb-2"
        >
          <div className="flex gap-3 min-w-max">
            {categories.map((category) => (
              <button
                key={category.name}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  category.active
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="relative">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                  />
                  {/* Price Tag */}
                  <div className="absolute bottom-3 left-3 bg-white px-3 py-1 rounded-lg shadow-md">
                    <p className="text-xs text-gray-500">Starting from</p>
                    <p className="font-bold text-blue-600">{destination.price}</p>
                  </div>
                  {/* Wishlist Button */}
                  <button className="absolute top-3 right-3 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors">
                    <Heart className="h-4 w-4 text-red-500" />
                  </button>
                  {/* Trending Badge */}
                  {destination.trending && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>TRENDING</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{destination.name}</h3>
                    <div className="flex items-center gap-1 bg-green-100 px-2 py-0.5 rounded text-sm">
                      <svg
                        className="w-4 h-4 text-yellow-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-medium text-green-800">{destination.rating}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500 gap-1">
                      <Map className="h-4 w-4 text-blue-500" />
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                        {destination.category}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 gap-1">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span>{destination.duration}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 gap-1">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span>Family friendly</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">EMI Available</p>
                      <p className="text-xs text-green-600 font-medium">No Cost EMI from ₹2,167/month</p>
                    </div>
                    <button className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1 rounded-full text-sm font-medium transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 text-center md:hidden">
          <button className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-6 py-2 rounded-full text-sm font-medium transition-colors inline-flex items-center">
            View All Packages <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </section>
  )
} 
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="relative">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                  />
                  {/* Price Tag */}
                  <div className="absolute bottom-3 left-3 bg-white px-3 py-1 rounded-lg shadow-md">
                    <p className="text-xs text-gray-500">Starting from</p>
                    <p className="font-bold text-blue-600">{destination.price}</p>
                  </div>
                  {/* Wishlist Button */}
                  <button className="absolute top-3 right-3 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors">
                    <Heart className="h-4 w-4 text-red-500" />
                  </button>
                  {/* Trending Badge */}
                  {destination.trending && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>TRENDING</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{destination.name}</h3>
                    <div className="flex items-center gap-1 bg-green-100 px-2 py-0.5 rounded text-sm">
                      <svg
                        className="w-4 h-4 text-yellow-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-medium text-green-800">{destination.rating}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500 gap-1">
                      <Map className="h-4 w-4 text-blue-500" />
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                        {destination.category}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 gap-1">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span>{destination.duration}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 gap-1">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span>Family friendly</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">EMI Available</p>
                      <p className="text-xs text-green-600 font-medium">No Cost EMI from ₹2,167/month</p>
                    </div>
                    <button className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1 rounded-full text-sm font-medium transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 text-center md:hidden">
          <button className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-6 py-2 rounded-full text-sm font-medium transition-colors inline-flex items-center">
            View All Packages <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </section>
  )