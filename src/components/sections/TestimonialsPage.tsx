'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { TESTIMONIALS } from '@/lib/data'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Star, TrendingUp, Quote } from 'lucide-react'

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

export default function TestimonialsPage() {
  const [ratingFilter, setRatingFilter] = useState('all')

  const filtered = useMemo(() => {
    if (ratingFilter === 'all') return TESTIMONIALS
    return TESTIMONIALS.filter((t) => t.rating === parseInt(ratingFilter))
  }, [ratingFilter])

  const avgRating = (TESTIMONIALS.reduce((acc, t) => acc + t.rating, 0) / TESTIMONIALS.length).toFixed(1)
  const fiveStars = TESTIMONIALS.filter((t) => t.rating === 5).length
  const fourStars = TESTIMONIALS.filter((t) => t.rating === 4).length

  return (
    <main className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold font-[var(--font-playfair)]">
            Client <span className="gold-text">Testimonials</span>
          </h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Real stories from real clients who found their dream homes with New Era Reality.
          </p>
          <div className="luxury-divider max-w-48 mx-auto mt-6" />
        </motion.div>

        {/* Overall Rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 sm:p-8 border border-[#C9A84C]/10 mb-8 max-w-xl mx-auto text-center"
        >
          <div className="text-5xl font-bold gold-text font-[var(--font-playfair)]">{avgRating}</div>
          <div className="flex justify-center mt-2">
            <StarRating rating={Math.round(parseFloat(avgRating))} />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Based on {TESTIMONIALS.length} reviews
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <span className="text-xs text-muted-foreground">{fiveStars} five-star</span>
            <span className="text-xs text-muted-foreground">{fourStars} four-star</span>
          </div>
        </motion.div>

        {/* Filter */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-muted-foreground">{filtered.length} testimonials</p>
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-40 h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-2xl p-6 border border-[#C9A84C]/10"
            >
              <Quote className="w-8 h-8 text-[#C9A84C]/20 mb-3" />

              <p className="text-foreground/80 leading-relaxed text-sm sm:text-base">
                &ldquo;{testimonial.testimonial}&rdquo;
              </p>

              {testimonial.investmentStory && (
                <div className="bg-[#C9A84C]/5 rounded-xl p-4 mt-4 border border-[#C9A84C]/10">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-[#C9A84C]" />
                    <span className="text-sm font-semibold text-[#C9A84C]">Investment Success Story</span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{testimonial.investmentStory}</p>
                </div>
              )}

              <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#B8941F] flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.clientName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.clientName}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.clientLocation}</p>
                  </div>
                </div>
                <StarRating rating={testimonial.rating} />
              </div>

              {testimonial.propertyPurchased && (
                <p className="text-xs text-[#C9A84C] mt-3">
                  Property: {testimonial.propertyPurchased}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}
