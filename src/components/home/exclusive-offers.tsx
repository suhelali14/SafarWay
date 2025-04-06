import { useState } from "react"
import { Mountain, Camera, Map, Building2, Briefcase, Car, Users, CreditCard } from "lucide-react"

export function ExclusiveOffers() {
  const [activeTab, setActiveTab] = useState("bestOffers")

  const tabs = [
    { id: "bestOffers", label: "Best Offers", icon: CreditCard },
    { id: "adventure", label: "Adventure", icon: Mountain },
    { id: "heritage", label: "Heritage", icon: Building2 },
    { id: "photography", label: "Photography", icon: Camera },
    { id: "wildlife", label: "Wildlife", icon: Map },
    { id: "pilgrimage", label: "Pilgrimage", icon: Briefcase },
    { id: "roadtrips", label: "Road Trips", icon: Car },
    { id: "group", label: "Group Tours", icon: Users },
  ]

  const offers = [
    {
      id: 1,
      title: "Ladakh Adventure Package",
      code: "FIRSTADV",
      image: "https://images.unsplash.com/photo-1506038634487-60a69ae4b7b1?q=80&w=600&h=400&fit=crop",
      validTill: "30th Apr, 2025",
      description: "7 Days of thrilling adventure in the Himalayas with camping and trekking"
    },
    {
      id: 2,
      title: "Kerala Backwaters Tour",
      code: "KERALA25",
      image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=600&h=400&fit=crop",
      validTill: "15th May, 2025",
      description: "5 Days exploring the serene backwaters and lush landscapes of God's own country"
    },
    {
      id: 3,
      title: "Royal Rajasthan Journey",
      code: "ROYAL20",
      image: "https://images.unsplash.com/photo-1595658658481-d53d3f999875?q=80&w=600&h=400&fit=crop",
      validTill: "15th Apr, 2025",
      description: "6 Days discovering the majestic palaces and rich culture of Rajasthan"
    }
  ]

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">Exclusive Tour Packages</h2>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-emerald-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {offer.id === 1 && (
                  <span className="absolute top-4 right-4 bg-emerald-500 text-white px-2 py-1 text-xs font-medium rounded">
                    FEATURED
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{offer.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{offer.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Use Code:</span>
                    <span className="bg-emerald-100 text-emerald-600 px-2 py-1 rounded text-sm font-medium">
                      {offer.code}
                    </span>
                  </div>
                  <button className="text-emerald-500 hover:text-emerald-600 text-sm font-medium">
                    View Details
                  </button>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  Valid till: {offer.validTill}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 