'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { SITE_STATS } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, ChevronDown, Phone, MapPin, Home, IndianRupee } from 'lucide-react'

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 2000
    const increment = target / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])

  return (
    <span ref={ref} className="text-3xl sm:text-4xl font-bold gold-text font-[var(--font-playfair)]">
      {count}{suffix}
    </span>
  )
}

export default function HeroSection() {
  const { navigate } = useAppStore()
  const [filters, setFilters] = useState({ location: '', bhk: '', budget: '' })

  const handleSearch = () => {
    navigate('projects')
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop"
          alt="Luxury Home"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" />
            RERA Registered Consultant
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-[var(--font-playfair)] leading-tight"
          >
            Find Your{' '}
            <span className="gold-shimmer">Dream Home</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-300 max-w-xl mx-auto leading-relaxed"
          >
            Discover premium properties across Mumbai, Navi Mumbai & Thane with New Era Reality —
            your trusted partner in finding the perfect home.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 sm:mt-10 bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/15"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Select value={filters.location} onValueChange={(v) => setFilters({ ...filters, location: v })}>
                  <SelectTrigger className="bg-white/10 border-white/15 text-white placeholder:text-white/50 h-11">
                    <MapPin className="w-4 h-4 mr-2 text-[#C9A84C]" />
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                    <SelectItem value="Thane">Thane</SelectItem>
                    <SelectItem value="Navi Mumbai">Navi Mumbai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Select value={filters.bhk} onValueChange={(v) => setFilters({ ...filters, bhk: v })}>
                  <SelectTrigger className="bg-white/10 border-white/15 text-white placeholder:text-white/50 h-11">
                    <Home className="w-4 h-4 mr-2 text-[#C9A84C]" />
                    <SelectValue placeholder="BHK Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 BHK</SelectItem>
                    <SelectItem value="2">2 BHK</SelectItem>
                    <SelectItem value="3">3 BHK</SelectItem>
                    <SelectItem value="4">4 BHK</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Select value={filters.budget} onValueChange={(v) => setFilters({ ...filters, budget: v })}>
                  <SelectTrigger className="bg-white/10 border-white/15 text-white placeholder:text-white/50 h-11">
                    <IndianRupee className="w-4 h-4 mr-2 text-[#C9A84C]" />
                    <SelectValue placeholder="Budget Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-50L">Under ₹50 Lac</SelectItem>
                    <SelectItem value="50L-1Cr">₹50 Lac - ₹1 Cr</SelectItem>
                    <SelectItem value="1Cr-2Cr">₹1 Cr - ₹2 Cr</SelectItem>
                    <SelectItem value="2Cr+">Above ₹2 Cr</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleSearch}
                className="btn-gold h-11 px-6 font-semibold text-white"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button
              onClick={() => navigate('projects')}
              size="lg"
              className="btn-gold px-8 text-white font-semibold rounded-xl"
            >
              Explore Properties
            </Button>
            <a
              href="https://wa.me/917021731962"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="outline"
                className="btn-gold-outline px-8 font-semibold rounded-xl"
              >
                <Phone className="w-4 h-4 mr-2" />
                Schedule Consultation
              </Button>
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8"
          >
            {[
              { value: SITE_STATS.totalProperties, suffix: '+', label: 'Properties' },
              { value: SITE_STATS.happyClients, suffix: '+', label: 'Happy Clients' },
              { value: SITE_STATS.yearsExperience, suffix: '+', label: 'Years Experience' },
              { value: SITE_STATS.citiesCovered, suffix: '', label: 'Cities' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                <p className="text-xs sm:text-sm text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  )
}
