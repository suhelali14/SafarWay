"use client"
import { SearchBar } from "./search-bar"
import { Globe, Shield, Users, Building2, ArrowDown } from "lucide-react"
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
    <section
      className="relative h-[90vh] min-h-[600px] bg-cover bg-center bg-fixed"
      style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1920&h=1080&fit=crop')",
        backgroundPosition: "center 30%"
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      
      {/* Animated decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 border-2 border-white/20 rounded-full animate-pulse-slow" />
        <div className="absolute bottom-40 right-10 w-32 h-32 border-2 border-white/20 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 right-1/4 w-16 h-16 border-2 border-white/20 rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }} />
        
        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-orange-400 rounded-full opacity-70 animate-float" />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-sky-400 rounded-full opacity-70 animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-5 h-5 bg-yellow-400 rounded-full opacity-70 animate-float" style={{ animationDelay: '2.5s' }} />
      </div>
      
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
        <div className="mb-6 animate-fade-in">
          <span className="inline-block px-4 py-1.5 bg-orange-500 text-white text-sm font-medium rounded-full tracking-wide shadow-lg transform hover:scale-105 transition-transform duration-300">
            Global Travel Package Marketplace
          </span>
        </div>
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in leading-tight">
          Discover Your Next <span className="text-orange-400 relative group">
            Adventure
            <span className="absolute bottom-0 left-0 w-full h-1 bg-orange-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-10 max-w-3xl animate-fade-in-delay text-gray-100">
          Welcome to SafarWay — your all-in-one travel booking platform connecting travelers with verified travel agencies worldwide.
        </p>

        <div className="w-full max-w-4xl animate-slide-up">
          <SearchBar />
        </div>
        
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm text-gray-200">
          <div className="flex items-center justify-center group animate-fade-in-delay">
            <Globe className="mr-2 text-orange-400 group-hover:text-orange-300 transition-colors duration-300" size={18} />
            <span className="group-hover:text-white transition-colors duration-300">Global Destinations</span>
          </div>
          <div className="flex items-center justify-center group animate-fade-in-delay" style={{ animationDelay: '0.4s' }}>
            <Building2 className="mr-2 text-orange-400 group-hover:text-orange-300 transition-colors duration-300" size={18} />
            <span className="group-hover:text-white transition-colors duration-300">Verified Agencies</span>
          </div>
          <div className="flex items-center justify-center group animate-fade-in-delay" style={{ animationDelay: '0.6s' }}>
            <Shield className="mr-2 text-orange-400 group-hover:text-orange-300 transition-colors duration-300" size={18} />
            <span className="group-hover:text-white transition-colors duration-300">No Hidden Charges</span>
          </div>
          <div className="flex items-center justify-center group animate-fade-in-delay" style={{ animationDelay: '0.8s' }}>
            <Users className="mr-2 text-orange-400 group-hover:text-orange-300 transition-colors duration-300" size={18} />
            <span className="group-hover:text-white transition-colors duration-300">Expert Guidance</span>
          </div>
        </div>
        
        {/* Scroll down indicator */}
        <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex flex-col items-center">
            <span className="text-sm mb-2">Scroll to explore</span>
            <ArrowDown className="animate-bounce-slow text-orange-400" size={24} />
          </div>
        </div>
      </div>
    </section>
  )
}

