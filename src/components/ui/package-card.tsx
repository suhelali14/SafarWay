import { MapPin, Star, Clock, ArrowRight, Heart } from "lucide-react"
import { useState } from "react"

interface PackageCardProps {
  id: string
  title: string
  location: string
  price: number
  image: string
  duration: string
  rating: number
  category: string
}

export function PackageCard({
  title,
  location,
  price,
  image,
  duration,
  rating,
  category
}: PackageCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <article 
      className="min-w-[280px] md:min-w-[320px] bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0 hover:shadow-xl transition-all duration-500 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-48 overflow-hidden relative">
        <img
          src={image}
          alt={`${title} in ${location}`}
          className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true"></div>
        
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-800 flex items-center shadow-md">
          <Star className="text-yellow-400 mr-1" size={14} fill="currentColor" aria-hidden="true" />
          <span>{rating}</span>
        </div>
        
        <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-md">
          {category}
        </div>
        
        <button 
          className={`absolute top-3 right-12 p-1.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
            isLiked 
              ? 'bg-red-500 text-white' 
              : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white'
          }`}
          onClick={() => setIsLiked(!isLiked)}
          aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart size={16} fill={isLiked ? "currentColor" : "none"} aria-hidden="true" />
        </button>
      </div>
      
      <div className="p-5">
        <div className="flex items-center mb-2">
          <MapPin className="text-orange-500 mr-1" size={16} aria-hidden="true" />
          <span className="text-sm text-gray-600">{location}</span>
        </div>
        
        <h3 className="text-xl font-bold mb-2 group-hover:text-orange-500 transition-colors duration-300">{title}</h3>
        
        {duration && (
          <div className="flex items-center mb-3 text-sm text-gray-500">
            <Clock className="mr-1" size={14} aria-hidden="true" />
            <span>{duration}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-500">Starting from</span>
            <p className="text-lg font-bold text-sky-600">{formatPrice(price)}</p>
          </div>
          
          <button 
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 flex items-center group-hover:translate-x-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            aria-label={`Book ${title} package`}
          >
            Book Now
            <ArrowRight className="ml-1" size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  )
}

