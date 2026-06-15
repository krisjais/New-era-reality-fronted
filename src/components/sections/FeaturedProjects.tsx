'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import PropertyCard from '@/components/shared/PropertyCard'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function FeaturedProjects() {
  const { properties } = useAppStore()
  const router = useRouter()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const featuredProperties = properties.filter((p) => p.featured)

  return (
    <section ref={ref} className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Handpicked for You
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-[var(--font-playfair)]">
            Featured <span className="gold-text">Projects</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Explore our curated selection of premium properties that offer the perfect blend of luxury, comfort, and investment potential.
          </p>
          <div className="luxury-divider max-w-48 mx-auto mt-6" />
        </motion.div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.15, duration: 0.5 }}
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </div>

        {/* View All */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-10"
        >
          <Button
            onClick={() => router.push('/projects')}
            size="lg"
            className="btn-gold text-white font-semibold rounded-xl px-8"
          >
            View All Properties
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
