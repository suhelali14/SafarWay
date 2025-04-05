import { FeatureCard } from "../../components/ui/feature-card"
import { Shield, CreditCard, MessageSquare, PhoneCall } from "lucide-react"
import type { Feature } from "../../types"

export function WhyChooseUs() {
  const features: Feature[] = [
    {
      id: 1,
      title: "Verified Tour Providers",
      description: "We carefully vet all tour operators to ensure quality and reliability.",
      icon: <Shield className="text-sky-600" size={32} />,
    },
    {
      id: 2,
      title: "Flexible Payment Options",
      description: "Choose from multiple payment methods with secure transactions.",
      icon: <CreditCard className="text-sky-600" size={32} />,
    },
    {
      id: 3,
      title: "Real Customer Reviews",
      description: "Authentic feedback from travelers to help you make informed decisions.",
      icon: <MessageSquare className="text-sky-600" size={32} />,
    },
    {
      id: 4,
      title: "24x7 Support",
      description: "Our team is always available to assist you before, during, and after your trip.",
      icon: <PhoneCall className="text-sky-600" size={32} />,
    },
  ]

  return (
    <section className="py-16 bg-sky-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose SafarWay</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  )
}

