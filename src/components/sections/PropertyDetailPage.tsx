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
  Calendar, User, CheckCircle2, ArrowLeft, Waves, Dumbbell, Baby, Footprints, Heart,
  Building, Zap, ShieldCheck, PhoneCall, TreePine, Gamepad2, Car, Cctv, 
  Flower2, Activity, ArrowUpDown, CloudRain, Wrench, Compass, BellRing, 
  Flame, Wifi, Hospital, GraduationCap, Landmark, Train, CreditCard, Bus, 
  Plane, ShoppingBag, Check, Trash2
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

  const getAmenityIcon = (amenity: string) => {
    const name = amenity.toLowerCase()
    const iconClass = "w-8 h-8 text-gray-500 dark:text-gray-400 mb-3 stroke-[1.5]"
    
    if (name.includes('earthquake')) return <Shield className={iconClass} />
    if (name.includes('fire')) return <Flame className={iconClass} />
    if (name.includes('waste')) return <Trash2 className={iconClass} />
    if (name.includes('bank') || name.includes('banquet')) return <Building className={iconClass} />
    if (name.includes('pool') || name.includes('water') || name.includes('effluent') || name.includes('sewage') || name.includes('rain')) return <Waves className={iconClass} />
    if (name.includes('gym')) return <Dumbbell className={iconClass} />
    if (name.includes('play') || name.includes('kid') || name.includes('child')) return <Baby className={iconClass} />
    if (name.includes('jog') || name.includes('track')) return <Footprints className={iconClass} />
    if (name.includes('club')) return <Building2 className={iconClass} />
    if (name.includes('power') || name.includes('backup') || name.includes('light') || name.includes('zap') || name.includes('ev')) return <Zap className={iconClass} />
    if (name.includes('security') || name.includes('guard') || name.includes('cctv') || name.includes('camera') || name.includes('alarm')) return <Cctv className={iconClass} />
    if (name.includes('intercom')) return <PhoneCall className={iconClass} />
    if (name.includes('garden') || name.includes('park') || name.includes('landscape')) return <TreePine className={iconClass} />
    if (name.includes('game') || name.includes('sport') || name.includes('court') || name.includes('tennis') || name.includes('basket')) return <Activity className={iconClass} />
    if (name.includes('parking') || name.includes('car')) return <Car className={iconClass} />
    if (name.includes('spa') || name.includes('massage') || name.includes('meditation')) return <Flower2 className={iconClass} />
    if (name.includes('lift') || name.includes('elevator')) return <ArrowUpDown className={iconClass} />
    if (name.includes('maintenance') || name.includes('repair')) return <Wrench className={iconClass} />
    if (name.includes('vastu')) return <Compass className={iconClass} />
    if (name.includes('gas')) return <Flame className={iconClass} />
    if (name.includes('wifi') || name.includes('internet')) return <Wifi className={iconClass} />
    if (name.includes('terrace')) return <Home className={iconClass} />
    if (name.includes('school')) return <GraduationCap className={iconClass} />
    return <CheckCircle2 className={iconClass} />
  }

  const getLandmarkIcon = (landmark: string) => {
    const name = landmark.toLowerCase()
    if (name.includes('hospital') || name.includes('clinic')) return <Hospital className="w-5 h-5 text-blue-400" />
    if (name.includes('school') || name.includes('college') || name.includes('education')) return <GraduationCap className="w-5 h-5 text-blue-400" />
    if (name.includes('bank') || name.includes('finance')) return <Landmark className="w-5 h-5 text-blue-400" />
    if (name.includes('railway') || name.includes('train')) return <Train className="w-5 h-5 text-blue-400" />
    if (name.includes('atm')) return <CreditCard className="w-5 h-5 text-blue-400" />
    if (name.includes('bus')) return <Bus className="w-5 h-5 text-blue-400" />
    if (name.includes('airport') || name.includes('plane')) return <Plane className="w-5 h-5 text-blue-400" />
    if (name.includes('mall') || name.includes('shop') || name.includes('market')) return <ShoppingBag className="w-5 h-5 text-blue-400" />
    if (name.includes('metro')) return <Train className="w-5 h-5 text-blue-400" />
    return <MapPin className="w-5 h-5 text-blue-400" />
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
          <div className="relative h-64 sm:h-80 lg:h-[480px] rounded-2xl overflow-hidden bg-black/10 dark:bg-black/40">
            {/* Blurred background image */}
            <div 
              className="absolute inset-0 bg-cover bg-center blur-2xl opacity-50 scale-110" 
              style={{ backgroundImage: `url(${Array.isArray(property.images) && property.images.length > 0 ? property.images[currentImage] : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'})` }}
            />
            
            <img
              src={Array.isArray(property.images) && property.images.length > 0 ? property.images[currentImage] : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'}
              alt={property.name}
              className="relative w-full h-full object-contain z-10 drop-shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 pointer-events-none" />

            {/* Image Navigation */}
            {Array.isArray(property.images) && property.images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImage((p) => (p - 1 + property.images.length) % property.images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors cursor-pointer z-20"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentImage((p) => (p + 1) % property.images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors cursor-pointer z-20"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2 flex-wrap max-w-[70%] z-20">
              <Badge className="bg-gradient-to-r from-[#C9A84C] to-[#B8941F] text-white border-0 px-3 py-1 text-sm font-semibold">
                {property.priceLabel}
              </Badge>
              {(property.transactionType === 'Sale' || !property.transactionType) && (
                <Badge className="bg-blue-600/90 text-white border-0 px-3 py-1 text-sm font-semibold shadow-lg">For Sale</Badge>
              )}
              {property.transactionType === 'Rent' && (
                <Badge className="bg-teal-600/90 text-white border-0 px-3 py-1 text-sm font-semibold shadow-lg">For Rent</Badge>
              )}
              {property.premium && (
                <Badge className="bg-purple-600 text-white border-0">Premium</Badge>
              )}
            </div>

            {/* Like Button */}
            <button
              onClick={() => toggleLike(property.id)}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm cursor-pointer z-20 ${
                isLiked ? 'bg-red-500 text-white' : 'bg-black/40 text-white hover:bg-red-500/80'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
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
                  <TabsTrigger value="landmarks">Land Marks</TabsTrigger>
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 border-l border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a24] rounded-xl overflow-hidden shadow-sm">
                    {Array.isArray(property.amenities) && property.amenities.map((amenity) => (
                      <div key={amenity} className="flex flex-col items-center justify-center p-6 border-r border-b border-gray-200 dark:border-white/10 text-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-default">
                        {getAmenityIcon(amenity)}
                        <span className="text-[13px] font-medium text-gray-600 dark:text-gray-300 leading-tight">{amenity}</span>
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
                  </div>
                </TabsContent>

                <TabsContent value="landmarks" className="mt-4">
                  <div className="bg-white dark:bg-[#1a1a24] rounded-xl p-6 sm:p-8 border border-gray-100 dark:border-white/5 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-white/10 pb-4 inline-block border-b-2 border-b-blue-400">Land Mark</h3>
                    {property.nearbyLandmarks && property.nearbyLandmarks.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                        {property.nearbyLandmarks.map((landmark) => (
                          <div key={landmark} className="flex items-center gap-3">
                            {getLandmarkIcon(landmark)}
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{landmark}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No landmarks specified.</p>
                    )}
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
