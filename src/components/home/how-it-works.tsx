import { Search, Scale, CreditCard } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Browse Packages",
      description: "Explore curated travel packages from verified agencies across India. Filter by destination, budget, or duration."
    },
    {
      icon: Scale,
      title: "Compare Options",
      description: "Compare different packages side by side. Check inclusions, exclusions, and read reviews from past travelers."
    },
    {
      icon: CreditCard,
      title: "Book & Enjoy",
      description: "Book your chosen package with secure payment options and get ready for an unforgettable journey."
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How SafarWay Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Planning your perfect trip is now easier than ever. Follow these simple steps to book your dream vacation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <step.icon className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 