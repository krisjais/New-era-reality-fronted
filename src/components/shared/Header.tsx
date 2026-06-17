'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu, Sun, Moon, Phone, X, Crown } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Projects', path: '/projects' },
  { label: 'About', path: '/about' },
  { label: 'Testimonials', path: '/testimonials' },
  { label: 'EMI Calculator', path: '/emi-calculator' },
  { label: 'Contact', path: '/contact' },
]

export default function Header() {
  const { theme, toggleTheme } = useAppStore()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isHeroTransparent = pathname === '/' && !scrolled

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
          <Link href="/" onClick={() => setMobileOpen(false)}>
            <motion.div
              className="flex items-center gap-2 group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <img 
                src="/logo.jpg" 
                alt="New Era Reality Logo" 
                className="h-10 sm:h-12 w-auto object-contain rounded-lg shadow-md shadow-[#C9A84C]/10" 
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.path
              return (
                <Link key={link.path} href={link.path}>
                  <motion.div
                    className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-lg cursor-pointer ${
                      isActive
                        ? 'text-[#C9A84C]'
                        : isHeroTransparent
                          ? 'text-white/80 hover:text-white'
                          : 'text-foreground/70 hover:text-foreground'
                    }`}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#C9A84C] rounded-full"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              )
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isHeroTransparent 
                  ? 'text-white/80 hover:text-white hover:bg-white/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
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
            <Link href="/admin">
              <Button
                variant="ghost"
                size="sm"
                className={`hidden lg:flex text-xs ${
                  isHeroTransparent
                    ? 'text-white/80 hover:text-white hover:bg-white/10'
                    : 'text-muted-foreground hover:text-[#C9A84C]'
                }`}
              >
                Admin
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={`lg:hidden ${isHeroTransparent ? 'text-white hover:bg-white/10' : ''}`}>
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
                  {NAV_LINKS.map((link, index) => {
                    const isActive = pathname === link.path
                    return (
                      <Link key={link.path} href={link.path} onClick={() => setMobileOpen(false)}>
                        <motion.div
                          initial={{ x: 50, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex items-center px-4 py-3 rounded-lg text-left font-medium transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#C9A84C]/10 text-[#C9A84C] border-l-2 border-[#C9A84C]'
                              : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                          }`}
                        >
                          {link.label}
                        </motion.div>
                      </Link>
                    )
                  })}
                  <div className="luxury-divider my-4" />
                  <Link href="/admin" onClick={() => setMobileOpen(false)}>
                    <div
                      className="flex items-center px-4 py-3 rounded-lg text-left font-medium text-foreground/70 hover:bg-muted hover:text-foreground transition-all cursor-pointer"
                    >
                      Admin Dashboard
                    </div>
                  </Link>
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
