"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { PackageCard } from "../../components/ui/package-card"

const packages = [
  {
    id: "1",
    title: "Magical Rajasthan",
    location: "Jaipur, India",
    price: 24999,
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=600&h=400&fit=crop",
    duration: "7 Days",
    rating: 4.8,
    category: "leisure"
  },
  {
    id: "2",
    title: "Kerala Backwaters",
    location: "Alleppey, India",
    price: 18500,
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=600&h=400&fit=crop",
    duration: "5 Days",
    rating: 4.9,
    category: "leisure"
  },
  {
    id: "3",
    title: "Himalayan Adventure",
    location: "Manali, India",
    price: 32000,
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=600&h=400&fit=crop",
    duration: "8 Days",
    rating: 4.7,
    category: "adventure"
  },
  {
    id: "4",
    title: "Umrah Spiritual Journey",
    location: "Mecca, Saudi Arabia",
    price: 999,
    image: "https://images.unsplash.com/photo-1519748174344-16e5d53bda7a?q=80&w=800&h=600&fit=crop",
    duration: "10 days",
    rating: 4.9,
    category: "religious"
  },
  {
    id: "5",
    title: "Char Dham Yatra",
    location: "Uttarakhand, India",
    price: 899,
    image: "https://images.unsplash.com/photo-1621996659490-3275b4d0d951?q=80&w=800&h=600&fit=crop",
    duration: "8 days",
    rating: 4.9,
    category: "religious"
  },
  {
    id: "6",
    title: "Maldives Honeymoon",
    location: "Maldives",
    price: 2499,
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=800&h=600&fit=crop",
    duration: "6 days",
    rating: 4.8,
    category: "honeymoon"
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
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Travel Packages</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our handpicked selection of premium travel packages from verified agencies across India.
            Each package is carefully curated to ensure the best travel experience.
          </p>
        </div>

        <div className="relative group">
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto pb-8 space-x-6 scroll-smooth relative"
            style={{ scrollbarGutter: "stable" }}
          >
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} {...pkg} />
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50 disabled:opacity-0 z-10"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50 disabled:opacity-0 z-10"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  )
}

