'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import HomePage from '@/components/sections/HomePage'
import ProjectsPage from '@/components/sections/ProjectsPage'
import PropertyDetailPage from '@/components/sections/PropertyDetailPage'
import AboutPage from '@/components/sections/AboutPage'
import TestimonialsPage from '@/components/sections/TestimonialsPage'
import ContactPage from '@/components/sections/ContactPage'
import AdminDashboard from '@/components/admin/AdminDashboard'

export default function MainApp() {
  const { currentPage, propertiesLoaded, fetchProperties } = useAppStore()

  useEffect(() => {
    if (!propertiesLoaded) {
      fetchProperties()
    }
  }, [propertiesLoaded, fetchProperties])

  const isAdmin = currentPage === 'admin' || currentPage === 'admin-projects' ||
    currentPage === 'admin-leads' || currentPage === 'admin-testimonials' ||
    currentPage === 'admin-notifications' || currentPage === 'admin-login'

  if (isAdmin) {
    return <AdminDashboard />
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />
      case 'projects':
        return <ProjectsPage />
      case 'property':
        return <PropertyDetailPage />
      case 'about':
        return <AboutPage />
      case 'testimonials':
        return <TestimonialsPage />
      case 'contact':
        return <ContactPage />
      default:
        return <HomePage />
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <div className="flex-1">
        {renderPage()}
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
