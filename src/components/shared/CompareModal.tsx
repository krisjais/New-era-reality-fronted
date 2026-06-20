import { X, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PropertyData } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'

interface CompareModalProps {
  isOpen: boolean
  onClose: () => void
  properties: PropertyData[]
}

export default function CompareModal({ isOpen, onClose, properties }: CompareModalProps) {
  const { toggleCompare } = useAppStore()

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-[#13131a] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-white/10">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Compare Properties</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-x-auto overflow-y-auto p-4 sm:p-6">
            <div className="min-w-[600px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="p-4 w-1/4"></th>
                    {properties.map((p) => (
                      <th key={p.id} className="p-4 w-1/4 align-top">
                        <div className="relative rounded-xl overflow-hidden aspect-[4/3] mb-3">
                          <img src={p.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'} alt={p.name} className="w-full h-full object-cover" />
                          <button
                            onClick={() => {
                              toggleCompare(p.id)
                              if (properties.length <= 1) onClose()
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 rounded-full text-white transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">{p.name}</h3>
                        <p className="text-[#C9A84C] font-semibold">{p.priceLabel}</p>
                      </th>
                    ))}
                    {Array.from({ length: Math.max(0, 3 - properties.length) }).map((_, i) => (
                      <th key={`empty-${i}`} className="p-4 w-1/4 align-top">
                        <div className="rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 aspect-[4/3] flex flex-col items-center justify-center text-gray-400 dark:text-white/40">
                          <span className="text-sm">Add Property</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  <tr>
                    <td className="p-4 font-medium text-gray-500 dark:text-gray-400">Location</td>
                    {properties.map((p) => <td key={p.id} className="p-4 text-gray-900 dark:text-white">{p.location}, {p.city}</td>)}
                    {Array.from({ length: Math.max(0, 3 - properties.length) }).map((_, i) => <td key={`empty-loc-${i}`} className="p-4"></td>)}
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-gray-500 dark:text-gray-400">Property Type</td>
                    {properties.map((p) => <td key={p.id} className="p-4 text-gray-900 dark:text-white">{p.propertyType}</td>)}
                    {Array.from({ length: Math.max(0, 3 - properties.length) }).map((_, i) => <td key={`empty-type-${i}`} className="p-4"></td>)}
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-gray-500 dark:text-gray-400">Configuration</td>
                    {properties.map((p) => <td key={p.id} className="p-4 text-gray-900 dark:text-white">{p.bhk || 'N/A'}</td>)}
                    {Array.from({ length: Math.max(0, 3 - properties.length) }).map((_, i) => <td key={`empty-bhk-${i}`} className="p-4"></td>)}
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-gray-500 dark:text-gray-400">Area</td>
                    {properties.map((p) => <td key={p.id} className="p-4 text-gray-900 dark:text-white">{p.areaSqft ? `${p.areaSqft} sq.ft` : 'N/A'}</td>)}
                    {Array.from({ length: Math.max(0, 3 - properties.length) }).map((_, i) => <td key={`empty-area-${i}`} className="p-4"></td>)}
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-gray-500 dark:text-gray-400">Status</td>
                    {properties.map((p) => <td key={p.id} className="p-4 text-gray-900 dark:text-white">{p.possessionStatus || 'N/A'}</td>)}
                    {Array.from({ length: Math.max(0, 3 - properties.length) }).map((_, i) => <td key={`empty-status-${i}`} className="p-4"></td>)}
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-gray-500 dark:text-gray-400">Builder</td>
                    {properties.map((p) => <td key={p.id} className="p-4 text-gray-900 dark:text-white">{p.builder || 'N/A'}</td>)}
                    {Array.from({ length: Math.max(0, 3 - properties.length) }).map((_, i) => <td key={`empty-builder-${i}`} className="p-4"></td>)}
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-gray-500 dark:text-gray-400">RERA Registered</td>
                    {properties.map((p) => (
                      <td key={p.id} className="p-4">
                        {p.reraRegistered ? <Check className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-gray-300 dark:text-white/20" />}
                      </td>
                    ))}
                    {Array.from({ length: Math.max(0, 3 - properties.length) }).map((_, i) => <td key={`empty-rera-${i}`} className="p-4"></td>)}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
