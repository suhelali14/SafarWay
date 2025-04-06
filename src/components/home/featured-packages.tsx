"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight, Mountain, Users, Calendar, MapPin } from "lucide-react"
import { PackageCard } from "../../components/ui/package-card"

const packages = [
  {
    id: 1,
    title: "Mystical Ladakh Adventure",
    location: "Leh-Ladakh",
    image: "https://images.unsplash.com/photo-1589793907316-f94025b46850?q=80&w=600&h=400&fit=crop",
    duration: "7 Days",
    groupSize: "4-12 People",
    price: "₹49,999",
    description: "Experience the breathtaking landscapes of Ladakh with camping under stars and thrilling mountain adventures."
  },
  {
    id: 2,
    title: "Kerala Backwater Bliss",
    location: "Kerala",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=600&h=400&fit=crop",
    duration: "5 Days",
    groupSize: "2-8 People",
    price: "₹32,999",
    description: "Cruise through serene backwaters, explore spice plantations, and experience traditional Ayurveda."
  },
  {
    id: 3,
    title: "Royal Rajasthan Heritage",
    location: "Rajasthan",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=600&h=400&fit=crop",
    duration: "6 Days",
    groupSize: "2-10 People",
    price: "₹39,999",
    description: "Discover the grandeur of royal palaces, ancient forts, and vibrant culture of Rajasthan."
  },
  {
    id: 4,
    title: "Himalayan Photography Tour",
    location: "Himachal Pradesh",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=600&h=400&fit=crop",
    duration: "8 Days",
    groupSize: "4-8 People",
    price: "₹45,999",
    description: "Capture the stunning landscapes and cultural heritage of the Himalayas with expert photography guidance."
  }
]

export function FeaturedPackages() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const scrollAmount = container.clientWidth * 0.8
      const newScrollPosition = direction === "left" 
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount
      
      container.scrollTo({
        left: newScrollPosition,
        behavior: "smooth"
      })
    }
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">Featured Tour Packages</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of immersive experiences across India's most breathtaking destinations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center gap-1 text-sm mb-1">
                    <MapPin size={14} />
                    <span>{pkg.location}</span>
                  </div>
                  <div className="text-xl font-semibold">{pkg.price}</div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{pkg.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pkg.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{pkg.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>{pkg.groupSize}</span>
                  </div>
                </div>
                <button className="w-full bg-emerald-500 text-white py-2 rounded font-medium hover:bg-emerald-600 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 bg-white text-emerald-600 px-6 py-3 rounded-lg font-medium border-2 border-emerald-500 hover:bg-emerald-50 transition-colors">
            <Mountain size={20} />
            View All Packages
          </button>
        </div>
      </div>
    </section>
  )
}

