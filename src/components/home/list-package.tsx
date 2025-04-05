import { Building2, ArrowRight } from "lucide-react"

export function ListPackage() {
  return (
    <section className="py-16 bg-orange-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-8 h-8 text-orange-500" />
          </div>
          
          <h2 className="text-3xl font-bold mb-4">Are You a Travel Agency?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join SafarWay's growing network of verified travel agencies. List your packages, reach new customers, and grow your business with our user-friendly platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/agency/register"
              className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full transition-colors"
            >
              Register Your Agency
              <ArrowRight className="ml-2" size={20} />
            </a>
            <a
              href="/agency/learn-more"
              className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-orange-500 px-6 py-3 rounded-full transition-colors border border-orange-200"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  )
} 