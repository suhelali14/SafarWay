import { MapPin, Calendar, Users } from "lucide-react"

export function TopDestinations() {
  const destinations = [
    {
      id: 1,
      name: "Ladakh",
      image: "https://images.unsplash.com/photo-1589793907316-f94025b46850?q=80&w=800&h=600&fit=crop",
      location: "Jammu & Kashmir",
      tourCount: "12 Tours",
      startingPrice: "₹29,999",
      bestTime: "Jun - Sep",
      description: "Experience the majestic Himalayas, ancient monasteries, and stunning high-altitude lakes."
    },
    {
      id: 2,
      name: "Kerala",
      image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=800&h=600&fit=crop",
      location: "South India",
      tourCount: "15 Tours",
      startingPrice: "₹24,999",
      bestTime: "Oct - Mar",
      description: "Explore serene backwaters, lush tea plantations, and pristine beaches in God's own country."
    },
    {
      id: 3,
      name: "Rajasthan",
      image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=800&h=600&fit=crop",
      location: "North India",
      tourCount: "18 Tours",
      startingPrice: "₹27,999",
      bestTime: "Oct - Mar",
      description: "Discover royal palaces, mighty fortresses, and the colors of the Thar Desert."
    },
    {
      id: 4,
      name: "Himachal Pradesh",
      image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=800&h=600&fit=crop",
      location: "North India",
      tourCount: "14 Tours",
      startingPrice: "₹22,999",
      bestTime: "Mar - Jun",
      description: "Adventure through snow-capped peaks, verdant valleys, and charming hill stations."
    },
    {
      id: 5,
      name: "Goa",
      image: "https://images.unsplash.com/photo-1587922546307-776227941871?q=80&w=800&h=600&fit=crop",
      location: "West India",
      tourCount: "10 Tours",
      startingPrice: "₹19,999",
      bestTime: "Nov - Feb",
      description: "Relax on pristine beaches, explore Portuguese heritage, and enjoy vibrant nightlife."
    },
    {
      id: 6,
      name: "Andaman Islands",
      image: "https://images.unsplash.com/photo-1589479397623-c64401a5f72f?q=80&w=800&h=600&fit=crop",
      location: "Bay of Bengal",
      tourCount: "8 Tours",
      startingPrice: "₹34,999",
      bestTime: "Oct - May",
      description: "Discover crystal-clear waters, coral reefs, and pristine beaches in this tropical paradise."
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">Top Travel Destinations</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore India's most captivating destinations, each offering unique experiences and unforgettable memories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <div
              key={destination.id}
              className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold mb-1">{destination.name}</h3>
                  <div className="flex items-center gap-1 text-sm">
                    <MapPin size={14} />
                    <span>{destination.location}</span>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {destination.tourCount}
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-600 text-sm mb-4">{destination.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{destination.bestTime}</span>
                    </div>
                    <div className="text-emerald-600 font-medium">
                      From {destination.startingPrice}
                    </div>
                  </div>
                </div>
                <button className="w-full bg-white text-emerald-600 py-2 rounded font-medium border-2 border-emerald-500 hover:bg-emerald-50 transition-colors">
                  Explore Tours
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-600 transition-colors">
            View All Destinations
          </button>
        </div>
      </div>
    </section>
  )
}

