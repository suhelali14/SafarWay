import { DestinationCard } from "../../components/ui/destination-card"
import type { Destination } from "../../types"

export function TopDestinations() {
  const destinations: Destination[] = [
    {
      id: 1,
      name: "Taj Mahal, Agra",
      price: "₹12,500",
      image: "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=600&h=400&fit=crop",
      badge: "Most Loved",
    },
    { 
      id: 2, 
      name: "Varanasi", 
      price: "₹15,999", 
      image: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?q=80&w=600&h=400&fit=crop" 
    },
    { 
      id: 3, 
      name: "Darjeeling", 
      price: "₹18,500", 
      image: "https://images.unsplash.com/photo-1544634076-a90160ddf44c?q=80&w=600&h=400&fit=crop", 
      badge: "Trending" 
    },
    { 
      id: 4, 
      name: "Andaman Islands", 
      price: "₹32,000", 
      image: "https://images.unsplash.com/photo-1589479397623-d18e5f4051fd?q=80&w=600&h=400&fit=crop" 
    },
    { 
      id: 5, 
      name: "Ladakh", 
      price: "₹24,999", 
      image: "https://images.unsplash.com/photo-1590391304431-f8c0a8f8e4bb?q=80&w=600&h=400&fit=crop", 
      badge: "Trending" 
    },
    { 
      id: 6, 
      name: "Udaipur", 
      price: "₹16,500", 
      image: "https://images.unsplash.com/photo-1595658658481-d53d3f999875?q=80&w=600&h=400&fit=crop" 
    },
    { 
      id: 7, 
      name: "Rishikesh", 
      price: "₹14,999", 
      image: "https://images.unsplash.com/photo-1592477480562-3e2faca3c091?q=80&w=600&h=400&fit=crop" 
    },
    { 
      id: 8, 
      name: "Munnar", 
      price: "₹17,500", 
      image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=600&h=400&fit=crop" 
    },
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Top Destinations</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {destinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      </div>
    </section>
  )
}

