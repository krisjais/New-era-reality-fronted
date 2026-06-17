'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { SITE_STATS } from '@/lib/data'
import { Building2, Users, Clock, MapPin } from 'lucide-react'

const STATS = [
  { icon: Building2, value: SITE_STATS.totalProperties, suffix: '+', label: 'Properties Listed' },
  { icon: Users, value: SITE_STATS.happyClients, suffix: '+', label: 'Happy Clients' },
  { icon: Clock, value: SITE_STATS.yearsExperience, suffix: '+', label: 'Years Experience' },
  { icon: MapPin, value: SITE_STATS.citiesCovered, suffix: '', label: 'Cities Covered' },
]

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let current = 0
    const step = target / 60
    const timer = setInterval(() => {
      current += step
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, 25)
    return () => clearInterval(timer)
  }, [inView, target])

  return <span ref={ref}>{count}{suffix}</span>
}

export default function StatsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-16 sm:py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a12] via-[#151520] to-[#0a0a12]" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#C9A84C] rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#C9A84C] rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-8"
        >
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="w-14 h-14 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-7 h-7 text-[#C9A84C]" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold gold-text ">
                <Counter target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
