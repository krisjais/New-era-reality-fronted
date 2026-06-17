'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import type { PropertyData } from '@/lib/data'
import LeadForm from '@/components/shared/LeadForm'
import PropertyCard from '@/components/shared/PropertyCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  MapPin, Maximize, Building2, Clock, Phone, MessageCircle, Download,
  ChevronLeft, ChevronRight, Star, Shield, Layers, Home, IndianRupee,
  Calendar, User, CheckCircle2, ArrowLeft
} from 'lucide-react'

interface PropertyDetailPageProps {
  propertyId?: string;
}

export default function PropertyDetailPage({ propertyId }: PropertyDetailPageProps) {
  const { selectedPropertyId, addToRecentlyViewed, likedProperties, toggleLike, properties } = useAppStore()
  const router = useRouter()
  const [currentImage, setCurrentImage] = useState(0)
  const [showLeadForm, setShowLeadForm] = useState(false)

  const property = useMemo(() => {
    const idToUse = propertyId || selectedPropertyId
    return properties.find((p) => p.id === idToUse) || null
  }, [propertyId, selectedPropertyId, properties])

  // Track view
  useEffect(() => {
    if (property) {
      addToRecentlyViewed(property.id)
    }
  }, [property?.id])

  if (!property) {
    return (
      <main className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold ">Property Not Found</h2>
          <p className="text-muted-foreground mt-2">The property you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push('/projects')} className="btn-gold text-white mt-4">
            Browse Properties
          </Button>
        </div>
      </main>
    )
  }

  const isLiked = likedProperties.includes(property.id)
  const similarProperties = properties.filter(
    (p) => p.id !== property.id && (p.city === property.city || p.propertyType === property.propertyType)
  ).slice(0, 3)

  const AMENITY_ICONS: Record<string, string> = {
    'Swimming Pool': '🏊', 'Gymnasium': '🏋️', 'Children Play Area': '👶', 'Jogging Track': '🏃',
    'Club House': ' clubhouse', 'Power Backup': '⚡', '24/7 Security': '🔒', 'Intercom': '📞',
    'Landscaped Gardens': '🌿', 'Indoor Games': '🎯', 'Parking': '🅿️', 'Garden': '🌳',
    'CCTV Surveillance': '📹', 'Spa': '💆', 'Tennis Court': '🎾', 'EV Charging': '🔌',
  }

  return (
    <main className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Button variant="ghost" onClick={() => router.push('/projects')} className="mb-4 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </motion.div>

        {/* Image Gallery */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="relative h-64 sm:h-80 lg:h-[480px] rounded-2xl overflow-hidden">
            <img
              src={Array.isArray(property.images) && property.images.length > 0 ? property.images[currentImage] : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'}
              alt={property.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

            {/* Image Navigation */}
            {Array.isArray(property.images) && property.images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImage((p) => (p - 1 + property.images.length) % property.images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentImage((p) => (p + 1) % property.images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className="bg-gradient-to-r from-[#C9A84C] to-[#B8941F] text-white border-0 px-3 py-1 text-sm font-semibold">
                {property.priceLabel}
              </Badge>
              {property.premium && (
                <Badge className="bg-purple-600 text-white border-0">Premium</Badge>
              )}
            </div>

            {/* Like Button */}
            <button
              onClick={() => toggleLike(property.id)}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm cursor-pointer ${
                isLiked ? 'bg-red-500 text-white' : 'bg-black/40 text-white hover:bg-red-500/80'
              }`}
            >
              <Star className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
            {Array.isArray(property.images) && property.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImage(idx)}
                className={`w-20 h-14 sm:w-24 sm:h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  idx === currentImage ? 'border-[#C9A84C]' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold ">
                {property.name}
              </h1>
              {property.tagline && (
                <p className="text-[#C9A84C] font-medium mt-1 italic">&ldquo;{property.tagline}&rdquo;</p>
              )}
              <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-[#C9A84C]" />
                <span>{property.location}{property.city !== property.location ? `, ${property.city}` : ''}</span>
              </div>
              {property.builder && (
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>by {property.builder}</span>
                </div>
              )}
            </motion.div>

            {/* Key Details */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {[
                { icon: Home, label: 'BHK', value: property.bhk || 'N/A' },
                { icon: Maximize, label: 'Area', value: property.areaSqft ? `${property.areaSqft} sq ft` : 'N/A' },
                { icon: Layers, label: 'Floors', value: property.floorCount ? `${property.floorCount}` : 'N/A' },
                { icon: Clock, label: 'Possession', value: property.possessionStatus || 'N/A' },
              ].map((item) => (
                <div key={item.label} className="glass-card rounded-xl p-4 text-center border border-[#C9A84C]/10">
                  <item.icon className="w-5 h-5 text-[#C9A84C] mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="font-semibold text-sm mt-1">{item.value}</p>
                </div>
              ))}
            </motion.div>

            {/* Tabs */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Tabs defaultValue="description">
                <TabsList className="w-full justify-start bg-muted/50">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                  <TabsTrigger value="builder">Builder</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-4">
                  <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{property.description}</p>
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    {property.furnishing && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-[#C9A84C]" />
                        <span className="text-muted-foreground">Furnishing:</span>
                        <span>{property.furnishing}</span>
                      </div>
                    )}
                    {property.transactionType && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-[#C9A84C]" />
                        <span className="text-muted-foreground">Type:</span>
                        <span>{property.transactionType}</span>
                      </div>
                    )}
                    {property.carpetArea && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-[#C9A84C]" />
                        <span className="text-muted-foreground">Carpet:</span>
                        <span>{property.carpetArea} sq ft</span>
                      </div>
                    )}
                    {property.builtUpArea && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-[#C9A84C]" />
                        <span className="text-muted-foreground">Built-up:</span>
                        <span>{property.builtUpArea} sq ft</span>
                      </div>
                    )}
                    {property.pricePerSqft && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-[#C9A84C]" />
                        <span className="text-muted-foreground">Price/sqft:</span>
                        <span>₹{property.pricePerSqft.toLocaleString()}</span>
                      </div>
                    )}
                    {property.reraRegistered && property.reraId && (
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="w-4 h-4 text-[#C9A84C]" />
                        <span className="text-muted-foreground">RERA:</span>
                        <span>{property.reraId}</span>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="amenities" className="mt-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Array.isArray(property.amenities) && property.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
                        <CheckCircle2 className="w-4 h-4 text-[#C9A84C] shrink-0" />
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="location" className="mt-4">
                  <div className="space-y-3">
                    {property.address ? (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[#C9A84C] mt-0.5 shrink-0" />
                        <span className="text-sm">{property.address}</span>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[#C9A84C] mt-0.5 shrink-0" />
                        <span className="text-sm">{property.location}{property.city !== property.location ? `, ${property.city}` : ''}</span>
                      </div>
                    )}
                    <h4 className="font-semibold mt-4">Nearby Landmarks</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Array.isArray(property.nearbyLandmarks) && property.nearbyLandmarks.map((landmark) => (
                        <div key={landmark} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
                          {landmark}
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="builder" className="mt-4">
                  <div className="glass-card rounded-xl p-6 border border-[#C9A84C]/10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#B8941F] flex items-center justify-center text-white font-bold text-lg">
                        {property.builder?.charAt(0) || 'B'}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{property.builder || 'Unknown Builder'}</h4>
                        <p className="text-sm text-muted-foreground">Developer</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {property.builder} is a renowned name in the Indian real estate industry, known for delivering
                      quality projects with timely possession and world-class amenities. With a strong portfolio of
                      residential and commercial developments, they have earned the trust of thousands of homeowners.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Right - Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-6 border border-[#C9A84C]/10 sticky top-24"
            >
              <div className="mb-4">
                <span className="text-sm text-muted-foreground">Starting from</span>
                <p className="text-2xl sm:text-3xl font-bold gold-text ">
                  {property.priceLabel}
                </p>
                {property.pricePerSqft && (
                  <p className="text-sm text-muted-foreground mt-1">
                    ₹{property.pricePerSqft.toLocaleString()} / sq ft
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {property.bhk && <Badge variant="secondary">{property.bhk}</Badge>}
                <Badge variant="secondary">{property.propertyType}</Badge>
                {property.areaSqft && <Badge variant="secondary">{property.areaSqft} sq ft</Badge>}
                {property.reraRegistered && <Badge className="bg-emerald-600/20 text-emerald-500 border-emerald-600/30">RERA</Badge>}
              </div>

              <Separator className="mb-6" />

              <div className="space-y-3">
                <a href="https://wa.me/917021731962" target="_blank" rel="noopener noreferrer" className="block">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp Inquiry
                  </Button>
                </a>
                <a href="tel:+917021731962" className="block">
                  <Button variant="outline" className="w-full btn-gold-outline font-semibold">
                    <Phone className="w-4 h-4 mr-2" />
                    Request Callback
                  </Button>
                </a>
                <Button
                  variant="outline"
                  className="w-full font-semibold"
                  onClick={() => setShowLeadForm(!showLeadForm)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Site Visit
                </Button>
                {property.brochureUrl && (
                  <Button variant="outline" className="w-full font-semibold">
                    <Download className="w-4 h-4 mr-2" />
                    Download Brochure
                  </Button>
                )}
              </div>

              {/* Lead Form */}
              {showLeadForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 pt-6 border-t border-border"
                >
                  <h4 className="font-semibold mb-3">Schedule a Site Visit</h4>
                  <LeadForm propertyId={property.id} defaultLeadType="site_visit" source="property_page" compact />
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold mb-6">
              Similar <span className="gold-text">Properties</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}
