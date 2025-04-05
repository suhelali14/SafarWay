import { ArrowRight } from "lucide-react"
import { useState } from "react"
import type { Destination } from "../../types"

interface DestinationCardProps {
  destination: Destination
}

export function DestinationCard({ destination }: DestinationCardProps) {
  const { name, price, image, badge } = destination
  const [isHovered, setIsHovered] = useState(false)

  return (
    <article 
      className="group relative rounded-xl overflow-hidden shadow-md h-64 transition-all duration-500 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-black/20 transition-opacity duration-500 group-hover:opacity-0" aria-hidden="true"></div>
      <img 
        src={image} 
        alt={name}
        className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`} 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" aria-hidden="true"></div>

      {badge && (
        <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-3 py-1.5 rounded-full font-medium tracking-wide shadow-lg transform -rotate-2 transition-transform duration-300 group-hover:rotate-0">
          {badge}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-all duration-500">
        <h3 className="text-xl font-bold mb-2 drop-shadow-lg group-hover:text-orange-400 transition-colors duration-300">{name}</h3>
        <div className="flex items-center justify-between">
          <p className="text-sm opacity-90 group-hover:opacity-100 transition-opacity">
            Starting from <span className="font-bold text-orange-400">{price}</span>
          </p>
          <button 
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-1.5 rounded-full transition-all duration-300 transform translate-x-0 group-hover:translate-x-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
            aria-label={`Explore ${name}`}
          >
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  )
}

