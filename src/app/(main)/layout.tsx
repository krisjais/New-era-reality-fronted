'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import WhatsAppButton from '@/components/shared/WhatsAppButton'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { propertiesLoaded, fetchProperties } = useAppStore()

  useEffect(() => {
    if (!propertiesLoaded) {
      fetchProperties()
    }
  }, [propertiesLoaded, fetchProperties])

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
