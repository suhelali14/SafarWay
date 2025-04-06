"use client"
import { SearchBar } from "./search-bar"
import { Mountain, Camera, Map, Building2 } from "lucide-react"
import { useState, useEffect } from "react"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY
      setIsVisible(position < 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <section className="relative min-h-[600px] bg-gradient-to-r from-emerald-600 to-teal-500">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      
      <div className="relative container mx-auto px-4 pt-12 pb-16">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl text-white font-bold text-center mb-4">
            Discover Incredible India
          </h1>
          <p className="text-xl text-white/90 text-center mb-8 max-w-2xl mx-auto">
            Explore handcrafted tours and unique experiences across India
          </p>

          {/* Search Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <SearchBar />
          </div>

          {/* Tour Categories */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-white">
            {[
              { icon: <Mountain size={24} />, label: "Adventure Tours", count: "50+" },
              { icon: <Camera size={24} />, label: "Photography Tours", count: "30+" },
              { icon: <Map size={24} />, label: "Wildlife Safari", count: "25+" },
              { icon: <Building2 size={24} />, label: "Heritage Tours", count: "40+" },
            ].map((category) => (
              <div key={category.label} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-3 group-hover:bg-white/20 transition-colors">
                  {category.icon}
                </div>
                <h3 className="font-medium mb-1">{category.label}</h3>
                <p className="text-sm text-white/80">{category.count} Experiences</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

