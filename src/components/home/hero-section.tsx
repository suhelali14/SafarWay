"use client"
import { SearchBar } from "./search-bar"
import { motion } from "framer-motion"
import { ArrowRight, ChevronDown, Plane, Building, Map, Car, Shield } from "lucide-react"

export function HeroSection() {
  return (
    <div className="relative min-h-[85vh] overflow-hidden">
      {/* Full-width Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070"
          alt="Travel background"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-900/80 via-sky-900/60 to-black/60" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 pt-16 md:pt-24">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-4"
          >
            Explore the Beauty of <span className="text-yellow-400">India</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-white/90 max-w-2xl mx-auto"
          >
            Discover incredible destinations, luxurious stays and unforgettable experiences
          </motion.p>
        </div>

        {/* Search Box */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-5xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden"
        >
          {/* Tabs */}
          <div className="flex flex-wrap">
            <button className="flex items-center gap-2 py-4 px-6 bg-gradient-to-r from-sky-600 to-sky-500 text-white font-medium">
              <Plane className="w-5 h-5" />
              <span>Flights</span>
            </button>
            <button className="flex items-center gap-2 py-4 px-6 text-gray-600 hover:bg-gray-100 font-medium transition-colors">
              <Building className="w-5 h-5" /> 
              <span>Hotels</span>
            </button>
            <button className="flex items-center gap-2 py-4 px-6 text-gray-600 hover:bg-gray-100 font-medium transition-colors">
              <Map className="w-5 h-5" />
              <span>Tour Packages</span>
            </button>
            <button className="flex items-center gap-2 py-4 px-6 text-gray-600 hover:bg-gray-100 font-medium transition-colors">
              <Car className="w-5 h-5" />
              <span>Cabs</span>
            </button>
          </div>

          {/* Search Content */}
          <div className="p-6 md:p-8">
            <div className="mb-4 flex text-sm flex-wrap gap-3">
              <div className="flex items-center gap-1 font-medium text-sky-800">
                <button className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  <span>Domestic</span>
                </button>
                <button className="inline-flex items-center gap-1 hover:bg-blue-100 text-gray-600 hover:text-blue-700 px-3 py-1 rounded-full transition-colors">
                  <span>International</span>
                </button>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Travel Safe Program</span>
              </div>
            </div>
            
            <SearchBar />
            
            <div className="mt-6 text-gray-500 text-sm flex flex-wrap gap-4">
              <div className="flex items-center gap-1">
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">NEW</span>
                <span>Zero Cancellation Fee</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">OFFER</span>
                <span>Use WELCOMESFR for 15% OFF</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Popular Destinations Quick Links */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-12 mb-6 text-center"
        >
          <p className="text-white mb-4 font-medium">Popular Destinations</p>
          <div className="flex overflow-x-auto gap-4 pb-4 justify-center flex-wrap">
            {[
              {name: "Goa", img: "https://images.unsplash.com/photo-1587922546307-776227941871?w=500&q=80"},
              {name: "Kerala", img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=500&q=80"},
              {name: "Rajasthan", img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500&q=80"},
              {name: "Himalayas", img: "https://images.unsplash.com/photo-1593936878475-f15bd3094cb8?w=500&q=80"},
              {name: "Delhi", img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=500&q=80"}
            ].map((destination) => (
              <div key={destination.name} className="group min-w-36 cursor-pointer">
                <div className="w-36 h-24 rounded-lg overflow-hidden mb-2">
                  <img 
                    src={destination.img} 
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <span className="text-white text-sm font-medium">{destination.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}


                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <span className="text-white text-sm font-medium">{destination.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
