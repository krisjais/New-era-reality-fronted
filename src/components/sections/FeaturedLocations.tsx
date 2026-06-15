'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { FEATURED_LOCATIONS } from '@/lib/data'
import { MapPin, Building2 } from 'lucide-react'

export default function FeaturedLocations() {
  const router = useRouter()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const handleLocationClick = (locationName: string) => {
    router.push('/projects')
  }

  return (
    <section ref={ref} className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold font-[var(--font-playfair)]">
            Premium <span className="gold-text">Locations</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Explore properties in Mumbai&apos;s most sought-after neighborhoods and emerging investment hotspots.
          </p>
          <div className="luxury-divider max-w-48 mx-auto mt-6" />
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_LOCATIONS.map((location, index) => (
            <motion.div
              key={location.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() => handleLocationClick(location.name)}
              className="relative h-56 sm:h-64 rounded-2xl overflow-hidden cursor-pointer group"
            >
              <img
                src={location.image}
                alt={location.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-[#C9A84C]" />
                  <h3 className="text-lg font-bold text-white font-[var(--font-playfair)]">{location.name}</h3>
                </div>
                <p className="text-sm text-gray-300">{location.city}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <Building2 className="w-3.5 h-3.5 text-[#C9A84C]" />
                  <span className="text-sm text-[#C9A84C] font-medium">{location.count}+ Properties</span>
                </div>
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-[#C9A84C]/0 group-hover:bg-[#C9A84C]/10 transition-colors duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
