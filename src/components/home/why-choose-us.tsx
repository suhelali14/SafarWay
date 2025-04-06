import { Shield, Clock, Award, Heart } from "lucide-react"

export function WhyChooseUs() {
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-emerald-500" />,
      title: "Safe & Reliable",
      description: "All our tours are thoroughly vetted for safety and quality, with trusted local partners and 24/7 support."
    },
    {
      icon: <Clock className="w-8 h-8 text-emerald-500" />,
      title: "Expertly Crafted",
      description: "Each itinerary is carefully designed to maximize your experience with perfect timing and pacing."
    },
    {
      icon: <Award className="w-8 h-8 text-emerald-500" />,
      title: "Best Value",
      description: "We offer competitive prices without compromising on the quality of experiences and accommodations."
    },
    {
      icon: <Heart className="w-8 h-8 text-emerald-500" />,
      title: "Personalized Care",
      description: "Our team provides personalized attention to ensure your journey matches your preferences and dreams."
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">Why Choose SafarWay</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're committed to making your Indian adventure extraordinary with our expertise and dedication
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-lg bg-gray-50 hover:bg-emerald-50 transition-colors group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4 group-hover:bg-emerald-200 transition-colors">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex flex-col items-center p-6 rounded-lg bg-emerald-50">
            <p className="text-lg font-medium text-emerald-800 mb-2">
              Ready to Start Your Journey?
            </p>
            <p className="text-emerald-600 mb-4">
              Let us help you plan your perfect Indian adventure
            </p>
            <button className="bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-600 transition-colors">
              Contact Us Now
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

