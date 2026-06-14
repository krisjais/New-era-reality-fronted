'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu, Sun, Moon, Phone, X, Crown } from 'lucide-react'
import type { Page } from '@/lib/store'

const NAV_LINKS: { label: string; page: Page }[] = [
  { label: 'Home', page: 'home' },
  { label: 'Projects', page: 'projects' },
  { label: 'About', page: 'about' },
  { label: 'Testimonials', page: 'testimonials' },
  { label: 'Contact', page: 'contact' },
]

export default function Header() {
  const { currentPage, navigate, theme, toggleTheme } = useAppStore()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNav = (page: Page) => {
    navigate(page)
    setMobileOpen(false)
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass shadow-lg shadow-black/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <motion.button
            onClick={() => handleNav('home')}
            className="flex items-center gap-2 group cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <img 
              src="/logo.jpg" 
              alt="New Era Reality Logo" 
              className="h-10 sm:h-12 w-auto object-contain rounded-lg shadow-md shadow-[#C9A84C]/10" 
            />
          </motion.button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <motion.button
                key={link.page}
                onClick={() => handleNav(link.page)}
                className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-lg cursor-pointer ${
                  currentPage === link.page
                    ? 'text-[#C9A84C]'
                    : 'text-foreground/70 hover:text-foreground'
                }`}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                {link.label}
                {currentPage === link.page && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#C9A84C] rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all cursor-pointer"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode="wait">
                {theme === 'dark' ? (
                  <motion.div key="sun" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Sun className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Moon className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* WhatsApp - Desktop */}
            <a
              href="https://wa.me/917021731962"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">WhatsApp</span>
            </a>

            {/* Admin Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNav('admin')}
              className="hidden lg:flex text-xs text-muted-foreground hover:text-[#C9A84C]"
            >
              Admin
            </Button>

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-background border-l border-[#C9A84C]/20">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col gap-1 mt-8">
                  <div className="flex items-center gap-2 mb-6 px-2">
                    <img 
                      src="/logo.jpg" 
                      alt="New Era Reality Logo" 
                      className="h-10 w-auto object-contain rounded-lg shadow-sm shadow-[#C9A84C]/10" 
                    />
                  </div>
                  <div className="luxury-divider mb-4" />
                  {NAV_LINKS.map((link, index) => (
                    <motion.button
                      key={link.page}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleNav(link.page)}
                      className={`flex items-center px-4 py-3 rounded-lg text-left font-medium transition-all cursor-pointer ${
                        currentPage === link.page
                          ? 'bg-[#C9A84C]/10 text-[#C9A84C] border-l-2 border-[#C9A84C]'
                          : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      {link.label}
                    </motion.button>
                  ))}
                  <div className="luxury-divider my-4" />
                  <button
                    onClick={() => handleNav('admin')}
                    className="flex items-center px-4 py-3 rounded-lg text-left font-medium text-foreground/70 hover:bg-muted hover:text-foreground transition-all cursor-pointer"
                  >
                    Admin Dashboard
                  </button>
                  <div className="mt-4 px-4">
                    <a
                      href="https://wa.me/917021731962"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      WhatsApp Us
                    </a>
                  </div>
                  <div className="mt-3 px-4">
                    <a
                      href="tel:+917021731962"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-lg btn-gold-outline font-medium"
                    >
                      <Phone className="w-4 h-4" />
                      Call +91-70217 31962
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
