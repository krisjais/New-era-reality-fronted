'use client'

import { useAppStore } from '@/lib/store'
import PropertyCard from '@/components/shared/PropertyCard'
import { motion } from 'framer-motion'
import { Building2 } from 'lucide-react'

export default function ProjectsPage() {
  const { properties } = useAppStore()

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] text-sm font-medium mb-4">
            <Building2 className="w-4 h-4" />
            Our Portfolio
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-serif mb-4">
            All <span className="gold-text">Properties</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse through our complete collection of premium real estate options perfectly suited for every lifestyle and budget.
          </p>
          <div className="luxury-divider max-w-48 mx-auto mt-6" />
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </div>

        {properties.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            No properties found at the moment.
          </div>
        )}

      </div>
    </div>
  )
}
