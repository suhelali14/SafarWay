import { HeroSection } from "../components/home/hero-section"
import { FeaturedPackages } from "../components/home/featured-packages"
import { TopDestinations } from "../components/home/top-destinations"
import { WhyChooseUs } from "../components/home/why-choose-us"
import { Testimonials } from "../components/home/testimonials"
import { HowItWorks } from "../components/home/how-it-works"

export default function HomePage() {
  return (
    <div className="min-h-screen font-sans">
      <main>
        <HeroSection />
        <FeaturedPackages />
        <TopDestinations />
        <WhyChooseUs />
        <Testimonials />
        <HowItWorks />
      </main>
    </div>
  )
}

