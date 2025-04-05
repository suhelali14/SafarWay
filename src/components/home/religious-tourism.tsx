import { Building2, ArrowRight } from "lucide-react"

export function ReligiousTourism() {
  const categories = [
    {
      title: "Muslim Pilgrimage",
      description: "Embark on sacred journeys to holy sites across the Islamic world",
      icon: Building2,
      subcategories: [
        {
          name: "Sunni Pilgrimage",
          destinations: [
            { name: "Umrah", location: "Mecca, Saudi Arabia" },
            { name: "Hajj", location: "Mecca, Saudi Arabia" },
            { name: "Medina", location: "Saudi Arabia" },
            { name: "Jerusalem", location: "Palestine" }
          ]
        },
        {
          name: "Shia Pilgrimage",
          destinations: [
            { name: "Karbala", location: "Iraq" },
            { name: "Najaf", location: "Iraq" },
            { name: "Mashhad", location: "Iran" },
            { name: "Qom", location: "Iran" }
          ]
        }
      ]
    },
    {
      title: "Hindu Pilgrimage",
      description: "Discover spiritual enlightenment at sacred Hindu temples and sites",
      icon: Building2,
      subcategories: [
        {
          name: "Major Pilgrimage Sites",
          destinations: [
            { name: "Char Dham", location: "India" },
            { name: "Kashi Vishwanath", location: "Varanasi, India" },
            { name: "Tirupati Balaji", location: "Andhra Pradesh, India" },
            { name: "Vaishno Devi", location: "Jammu & Kashmir, India" }
          ]
        },
        {
          name: "International Sites",
          destinations: [
            { name: "Pashupatinath", location: "Nepal" },
            { name: "Bali Temples", location: "Indonesia" },
            { name: "Mauritius Temples", location: "Mauritius" },
            { name: "Trinidad Temples", location: "Trinidad & Tobago" }
          ]
        }
      ]
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Religious Tourism</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore sacred destinations and spiritual journeys across the globe. Our verified travel agencies specialize in religious tourism and pilgrimage packages.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                  <category.icon className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{category.title}</h3>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                {category.subcategories.map((subcategory, subIndex) => (
                  <div key={subIndex} className="bg-white rounded-lg p-4">
                    <h4 className="font-medium mb-2">{subcategory.name}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {subcategory.destinations.map((destination, destIndex) => (
                        <div key={destIndex} className="flex items-center text-sm text-gray-600">
                          <ArrowRight className="w-4 h-4 text-orange-500 mr-1" />
                          <span>{destination.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 