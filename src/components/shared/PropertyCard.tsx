'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import type { PropertyData } from '@/lib/data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Maximize, Heart, GitCompareArrows, Building2, Clock, ChevronLeft, ChevronRight } from 'lucide-react'

interface PropertyCardProps {
  property: PropertyData
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const { toggleLike, toggleCompare, likedProperties, compareList, addToRecentlyViewed } = useAppStore()
  const router = useRouter()
  const [currentImage, setCurrentImage] = useState(0)
  const isLiked = likedProperties.includes(property.id)
  const isComparing = compareList.includes(property.id)

  const handleClick = () => {
    addToRecentlyViewed(property.id)
    router.push(`/property/${property.id}`)
  }

  const images = Array.isArray(property.images) ? property.images : []
  
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (images.length > 0) {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (images.length > 0) {
      setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onClick={handleClick}
      className="group glass-card rounded-2xl overflow-hidden property-card-hover cursor-pointer"
    >
      {/* Image Section */}
      <div className="relative h-52 sm:h-56 overflow-hidden">
        <motion.img
          key={currentImage}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          src={images.length > 0 ? images[currentImage] : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'}
          alt={property.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Price Badge */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-gradient-to-r from-[#C9A84C] to-[#B8941F] text-white border-0 px-3 py-1 text-xs font-semibold shadow-lg">
            {property.priceLabel}
          </Badge>
        </div>

        {/* Premium / Featured Badge */}
        {property.premium && (
          <div className="absolute top-3 right-12">
            <Badge className="bg-purple-600 text-white border-0 text-xs">Premium</Badge>
          </div>
        )}

        {/* Possession Status */}
        {property.possessionStatus && (
          <div className="absolute bottom-3 left-3">
            <Badge
              variant="outline"
              className={`text-xs border-0 ${
                property.possessionStatus === 'Ready to Move'
                  ? 'bg-green-600/90 text-white'
                  : property.possessionStatus === 'Under Construction'
                  ? 'bg-amber-600/90 text-white'
                  : 'bg-blue-600/90 text-white'
              }`}
            >
              <Clock className="w-3 h-3 mr-1" />
              {property.possessionStatus}
            </Badge>
          </div>
        )}

        {/* Image Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            {/* Dots */}
            <div className="absolute bottom-3 right-3 flex gap-1">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    idx === currentImage ? 'bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              toggleLike(property.id)
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer ${
              isLiked ? 'bg-red-500 text-white' : 'bg-black/40 text-white hover:bg-red-500/80'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              toggleCompare(property.id)
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer ${
              isComparing ? 'bg-[#C9A84C] text-white' : 'bg-black/40 text-white hover:bg-[#C9A84C]/80'
            }`}
          >
            <GitCompareArrows className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5">
        {/* Name & Builder */}
        <h3 className="font-bold font-[var(--font-playfair)] text-lg text-foreground group-hover:text-[#C9A84C] transition-colors line-clamp-1">
          {property.name}
        </h3>
        {property.builder && (
          <p className="text-xs text-muted-foreground mt-0.5">by {property.builder}</p>
        )}

        {/* Location */}
        <div className="flex items-center gap-1.5 mt-2 text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
          <span className="text-sm truncate">{property.location}, {property.city}</span>
        </div>

        {/* Badges Row */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {property.bhk && (
            <Badge variant="secondary" className="text-xs">
              <Building2 className="w-3 h-3 mr-1" />
              {property.bhk}
            </Badge>
          )}
          <Badge variant="secondary" className="text-xs">
            {property.propertyType}
          </Badge>
          {property.areaSqft && (
            <Badge variant="secondary" className="text-xs">
              <Maximize className="w-3 h-3 mr-1" />
              {property.areaSqft} sq ft
            </Badge>
          )}
          {property.reraRegistered && (
            <Badge className="text-xs bg-emerald-600/20 text-emerald-500 border-emerald-600/30">
              RERA
            </Badge>
          )}
        </div>

        {/* Price per sqft */}
        {property.pricePerSqft && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <span className="text-xs text-muted-foreground">
              ₹{property.pricePerSqft.toLocaleString()} / sq ft
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
