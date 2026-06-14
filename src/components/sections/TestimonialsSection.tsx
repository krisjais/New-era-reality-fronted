'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { TESTIMONIALS } from '@/lib/data'
import { Badge } from '@/components/ui/badge'
import { Star, ChevronLeft, ChevronRight, Quote, TrendingUp } from 'lucide-react'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-[#C9A84C] fill-[#C9A84C]' : 'text-gray-600'}`}
        />
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [current, setCurrent] = useState(0)
  const featured = TESTIMONIALS.filter((t) => t.featured)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % featured.length)
  }, [featured.length])

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + featured.length) % featured.length)
  }, [featured.length])

  useEffect(() => {
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next])

  if (featured.length === 0) return null

  const testimonial = featured[current]

  return (
    <section ref={ref} className="py-16 sm:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold font-[var(--font-playfair)]">
            What Our <span className="gold-text">Clients Say</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Hear from our satisfied clients who found their dream homes with New Era Reality.
          </p>
          <div className="luxury-divider max-w-48 mx-auto mt-6" />
        </motion.div>

        {/* Carousel */}
        <div className="max-w-3xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="glass-card rounded-2xl p-6 sm:p-8 border border-[#C9A84C]/10"
            >
              <Quote className="w-10 h-10 text-[#C9A84C]/20 mb-4" />
              <p className="text-foreground leading-relaxed text-sm sm:text-base mb-6">
                &ldquo;{testimonial.testimonial}&rdquo;
              </p>

              {testimonial.investmentStory && (
                <div className="bg-[#C9A84C]/5 rounded-xl p-4 mb-6 border border-[#C9A84C]/10">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-[#C9A84C]" />
                    <span className="text-sm font-semibold text-[#C9A84C]">Investment Success</span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{testimonial.investmentStory}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#B8941F] flex items-center justify-center text-white font-bold text-sm">
                      {testimonial.clientName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.clientName}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.clientLocation}</p>
                    </div>
                  </div>
                  {testimonial.propertyPurchased && (
                    <p className="text-xs text-[#C9A84C] mt-2 ml-13">
                      Purchased: {testimonial.propertyPurchased}
                    </p>
                  )}
                </div>
                <StarRating rating={testimonial.rating} />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {featured.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                    idx === current ? 'bg-[#C9A84C] w-6' : 'bg-[#C9A84C]/30'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
