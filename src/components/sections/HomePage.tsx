'use client'

import HeroSection from './HeroSection'
import FeaturedProjects from './FeaturedProjects'
import WhyChooseUs from './WhyChooseUs'
import FeaturedLocations from './FeaturedLocations'
import StatsSection from './StatsSection'
import TestimonialsSection from './TestimonialsSection'
import CTASection from './CTASection'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturedProjects />
      <WhyChooseUs />
      <FeaturedLocations />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  )
}
