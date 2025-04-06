import { HeroSection } from "../components/home/hero-section"
import { ExclusiveOffers } from "../components/home/exclusive-offers"
import { FeaturedPackages } from "../components/home/featured-packages"
import { TopDestinations } from "../components/home/top-destinations"
import { WhyChooseUs } from "../components/home/why-choose-us"
import { Testimonials } from "../components/home/testimonials"

export default function HomePage() {
  return (
    <div className="min-h-screen font-sans">
      <main>
        <HeroSection />
        <ExclusiveOffers />
        <FeaturedPackages />
        <TopDestinations />
        <WhyChooseUs />
        <Testimonials />
      </main>
    </div>
  )
}

