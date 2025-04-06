import { Star, Quote } from "lucide-react"

export function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      location: "Mumbai",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&h=120&fit=crop",
      rating: 5,
      text: "The Ladakh adventure tour was beyond my expectations! The team took care of everything, from accommodation to local experiences. A perfect blend of adventure and comfort.",
      tourName: "Mystical Ladakh Adventure"
    },
    {
      id: 2,
      name: "Rahul Verma",
      location: "Bangalore",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&h=120&fit=crop",
      rating: 5,
      text: "Kerala backwaters tour was a serene experience. The houseboat stay and local cuisine were highlights. Perfectly organized and great attention to detail.",
      tourName: "Kerala Backwater Bliss"
    },
    {
      id: 3,
      name: "Anjali Patel",
      location: "Delhi",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=120&h=120&fit=crop",
      rating: 5,
      text: "The Rajasthan heritage tour was magical! From palace stays to desert camping, every moment was special. The guides were knowledgeable and friendly.",
      tourName: "Royal Rajasthan Heritage"
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">What Our Travelers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real experiences shared by our valued travelers who explored India with us
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6 relative">
              <Quote className="absolute top-6 right-6 text-emerald-100" size={40} />
              
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-emerald-500 text-emerald-500" />
                ))}
              </div>

              <p className="text-gray-600 mb-4 relative z-10">
                "{testimonial.text}"
              </p>

              <div className="text-sm text-emerald-600 font-medium">
                {testimonial.tourName}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-medium border-2 border-emerald-500 hover:bg-emerald-50 transition-colors">
            View All Reviews
          </button>
        </div>
      </div>
    </section>
  )
}

