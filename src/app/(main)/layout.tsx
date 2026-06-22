'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/store'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import CompareModal from '@/components/shared/CompareModal'
import { motion, AnimatePresence } from 'framer-motion'
import { GitCompareArrows } from 'lucide-react'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { propertiesLoaded, fetchProperties, compareList, properties } = useAppStore()
  const [showCompare, setShowCompare] = useState(false)

  useEffect(() => {
    if (!propertiesLoaded) {
      fetchProperties()
    }
  }, [propertiesLoaded, fetchProperties])

  // Get full property objects for comparison
  const compareProperties = properties.filter((p) => compareList.includes(p.id))

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative">
      <Header />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
      <WhatsAppButton />

      {/* Floating Compare Button */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 right-6 z-40"
          >
            <button
              onClick={() => setShowCompare(true)}
              className="bg-[#C9A84C] text-white px-4 py-3 rounded-full shadow-lg shadow-[#C9A84C]/20 flex items-center gap-2 hover:bg-[#B8941F] transition-colors"
            >
              <GitCompareArrows className="w-5 h-5" />
              <span className="font-semibold">Compare ({compareList.length})</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <CompareModal
        isOpen={showCompare}
        onClose={() => setShowCompare(false)}
        properties={compareProperties}
      />
    </div>
  )
}
