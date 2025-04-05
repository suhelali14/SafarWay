import { Star, Quote } from "lucide-react"
import { useState } from "react"
import type { Testimonial } from "../../types"

interface TestimonialCardProps {
  testimonial: Testimonial
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const { name, photo, rating, text } = testimonial
  const [isHovered, setIsHovered] = useState(false)

  return (
    <article 
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative quote icon */}
      <div className="absolute top-0 right-0 text-orange-100 opacity-50 transform translate-x-8 -translate-y-8 transition-all duration-500 group-hover:translate-x-6 group-hover:-translate-y-6" aria-hidden="true">
        <Quote size={80} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center mb-4">
          <div className="relative">
            <img 
              src={photo || "/placeholder.svg"} 
              alt={`${name}'s profile picture`}
              className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-orange-100 transition-all duration-300 group-hover:border-orange-300" 
            />
            <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
              {rating}
            </div>
          </div>
          <div>
            <h3 className="font-bold group-hover:text-orange-500 transition-colors duration-300">{name}</h3>
            <div className="flex" aria-label={`${rating} out of 5 stars`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  className={`${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} transition-all duration-300 ${isHovered && i < rating ? 'scale-110' : ''}`} 
                  size={16}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        </div>
        
        <blockquote className="text-gray-600 italic relative">
          <span className="absolute -left-2 -top-2 text-orange-200 text-2xl" aria-hidden="true">"</span>
          {text}
          <span className="absolute -right-2 -bottom-2 text-orange-200 text-2xl" aria-hidden="true">"</span>
        </blockquote>
      </div>
    </article>
  )
}

