'use client'

import { useState, useMemo, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import PropertyCard from '@/components/shared/PropertyCard'
import { PropertyCardSkeleton } from '@/components/shared/PropertyCardSkeleton'
import CompareModal from '@/components/shared/CompareModal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Grid3X3, List, SlidersHorizontal, X, MapPin, Home, Building2, Clock, GitCompareArrows } from 'lucide-react'
import type { PropertyData } from '@/lib/data'

const CITIES = ['All', 'Mumbai', 'Thane', 'Navi Mumbai']
const BHK_OPTIONS = ['All', '1', '2', '3', '4']
const PROPERTY_TYPES = ['All', 'Apartment', 'Villa', 'Plot']
const POSSESSION_OPTIONS = ['All', 'Ready to Move', 'Under Construction']

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-20 pb-16 text-center">Loading properties...</div>}>
      <ProjectsPageContent />
    </Suspense>
  )
}

function ProjectsPageContent() {
  const { compareList, clearCompare, navigate, properties } = useAppStore()
  const searchParams = useSearchParams()
  const [showCompare, setShowCompare] = useState(false)
  const [city, setCity] = useState(searchParams.get('city') || 'All')
  const [bhk, setBhk] = useState(searchParams.get('bhk') || 'All')
  const [propertyType, setPropertyType] = useState('All')
  const [possession, setPossession] = useState('All')
  const [priceRange, setPriceRange] = useState(() => {
    const budget = searchParams.get('budget')
    if (budget === '90L-1Cr') return [9000000, 10000000]
    if (budget === '1Cr-2Cr') return [10000000, 20000000]
    if (budget === '2Cr+') return [20000000, 50000000]
    return [9000000, 50000000]
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)
  const perPage = 9

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (city !== 'All' && p.city !== city) return false
      if (bhk !== 'All' && p.bhkNumber !== parseInt(bhk)) return false
      if (propertyType !== 'All' && p.propertyType !== propertyType) return false
      if (possession !== 'All' && p.possessionStatus !== possession) return false
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false
      return true
    })
  }, [city, bhk, propertyType, possession, priceRange, properties])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice(0, page * perPage)

  const formatPrice = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(0)} Cr`
    if (val >= 100000) return `₹${(val / 100000).toFixed(0)} L`
    return `₹${val.toLocaleString()}`
  }

  const compareProperties = compareList.map((id) => properties.find((p) => p.id === id)).filter(Boolean) as PropertyData[]

  return (
    <main className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold ">
            Our <span className="gold-text">Projects</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Browse {filtered.length} premium properties across Mumbai, Navi Mumbai & Thane
          </p>
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-4 sm:p-5 border border-[#C9A84C]/10 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#C9A84C]" />
              <span className="font-semibold text-sm">Filters</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCity('All'); setBhk('All'); setPropertyType('All'); setPossession('All')
                  setPriceRange([9000000, 50000000])
                }}
                className="text-xs text-muted-foreground"
              >
                Clear All
              </Button>
              <div className="hidden sm:flex border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 cursor-pointer ${viewMode === 'grid' ? 'bg-[#C9A84C]/10 text-[#C9A84C]' : 'text-muted-foreground'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 cursor-pointer ${viewMode === 'list' ? 'bg-[#C9A84C]/10 text-[#C9A84C]' : 'text-muted-foreground'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="h-10 text-sm">
                <MapPin className="w-3.5 h-3.5 mr-1.5 text-[#C9A84C]" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CITIES.map((c) => <SelectItem key={c} value={c}>{c === 'All' ? 'All Cities' : c}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={bhk} onValueChange={setBhk}>
              <SelectTrigger className="h-10 text-sm">
                <Home className="w-3.5 h-3.5 mr-1.5 text-[#C9A84C]" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BHK_OPTIONS.map((b) => <SelectItem key={b} value={b}>{b === 'All' ? 'All BHK' : `${b} BHK`}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger className="h-10 text-sm">
                <Building2 className="w-3.5 h-3.5 mr-1.5 text-[#C9A84C]" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROPERTY_TYPES.map((t) => <SelectItem key={t} value={t}>{t === 'All' ? 'All Types' : t}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={possession} onValueChange={setPossession}>
              <SelectTrigger className="h-10 text-sm">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-[#C9A84C]" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {POSSESSION_OPTIONS.map((p) => <SelectItem key={p} value={p}>{p === 'All' ? 'Any Status' : p}</SelectItem>)}
              </SelectContent>
            </Select>

            <div className="col-span-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Budget Range</span>
                <span>{formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}</span>
              </div>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                min={9000000}
                max={50000000}
                step={500000}
                className="w-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No properties match your filters.</p>
            <Button variant="outline" onClick={() => { setCity('All'); setBhk('All'); setPropertyType('All'); setPossession('All'); setPriceRange([9000000, 50000000]) }} className="mt-4 btn-gold-outline">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-4'}>
            {paginated.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More */}
        {page * perPage < filtered.length && (
          <div className="text-center mt-8">
            <Button onClick={() => setPage((p) => p + 1)} variant="outline" className="btn-gold-outline px-8">
              Load More Properties
            </Button>
          </div>
        )}
      </div>

      {/* Compare Bar */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-[#C9A84C]/20 shadow-2xl"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <GitCompareArrows className="w-5 h-5 text-[#C9A84C]" />
                  <span className="text-sm font-medium">Compare ({compareList.length}/3)</span>
                  <div className="flex gap-2">
                    {compareProperties.map((p) => (
                      <Badge key={p.id} variant="secondary" className="text-xs">
                        {p.name}
                        <button onClick={() => useAppStore.getState().toggleCompare(p.id)} className="ml-1 cursor-pointer">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={clearCompare} className="text-xs text-muted-foreground">
                    Clear
                  </Button>
                  <Button size="sm" className="btn-gold text-white text-xs" disabled={compareList.length < 2} onClick={() => setShowCompare(true)}>
                    Compare Now
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compare Modal */}
      <CompareModal 
        isOpen={showCompare} 
        onClose={() => setShowCompare(false)} 
        properties={compareProperties} 
      />
    </main>
  )
}
