import { Shield, IndianRupee, Users, MapPin, Star, Clock } from "lucide-react"

export function WhySafarWay() {
  const benefits = [
    {
      icon: Shield,
      title: "Verified Vendors",
      description: "All travel agencies are thoroughly verified to ensure safe and reliable experiences."
    },
    {
      icon: IndianRupee,
      title: "No Hidden Charges",
      description: "Transparent pricing with no surprise fees or additional costs."
    },
    {
      icon: Users,
      title: "Local Expertise",
      description: "Connect with experienced local guides and travel experts."
    },
    {
      icon: MapPin,
      title: "Curated Destinations",
      description: "Carefully selected destinations and experiences across India."
    },
    {
      icon: Star,
      title: "Best Price Guarantee",
      description: "Competitive prices and exclusive deals from top travel agencies."
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer support for all your travel needs."
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose SafarWay</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're committed to making your travel planning experience seamless and enjoyable.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <benefit.icon className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 