import { TestimonialCard } from "../../components/ui/testimonial-card"
import type { Testimonial } from "../../types"

export function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Priya Sharma",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&fit=crop",
      rating: 5,
      text: "Our trip to Rajasthan was perfectly organized. The guides were knowledgeable and accommodations were excellent. Will definitely book with SafarWay again!",
    },
    {
      id: 2,
      name: "Rahul Mehta",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&h=100&fit=crop",
      rating: 5,
      text: "The Kerala backwaters tour exceeded our expectations. Every detail was taken care of, and we could just relax and enjoy. Highly recommended!",
    },
    {
      id: 3,
      name: "Ananya Patel",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&fit=crop",
      rating: 4,
      text: "Great experience with the Himalayan trek package. The team was professional and supportive throughout our adventure. Beautiful memories created!",
    },
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Travelers Say</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}

