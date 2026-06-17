'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calculator, ArrowRight, Building2, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function EmiCalculatorPage() {
  const { properties } = useAppStore()
  const hotProperties = properties.filter(p => p.featured || p.premium).slice(0, 6)

  const [principal, setPrincipal] = useState('')
  const [rate, setRate] = useState('')
  const [years, setYears] = useState('')
  const [emi, setEmi] = useState<number | null>(null)
  const [totalPayment, setTotalPayment] = useState<number | null>(null)
  const [totalInterest, setTotalInterest] = useState<number | null>(null)

  const calculateEmi = () => {
    const p = parseFloat(principal)
    const r = parseFloat(rate) / 12 / 100
    const n = parseFloat(years) * 12

    if (p > 0 && r > 0 && n > 0) {
      const emiValue = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      const totalAmt = emiValue * n
      const interestAmt = totalAmt - p

      setEmi(emiValue)
      setTotalPayment(totalAmt)
      setTotalInterest(interestAmt)
    } else {
      setEmi(null)
      setTotalPayment(null)
      setTotalInterest(null)
    }
  }

  const handleClear = () => {
    setPrincipal('')
    setRate('')
    setYears('')
    setEmi(null)
    setTotalPayment(null)
    setTotalInterest(null)
  }

  const formatCurrency = (value: number) => {
    return `₹ ${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <main className="min-h-screen pt-20 pb-16 bg-background">
      {/* Page Header */}
      <div className="bg-slate-50 dark:bg-[#0a0a12] border-b border-[#C9A84C]/20 py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#C9A84C]/10 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              EMI <span className="gold-text">Calculator</span>
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl text-sm sm:text-base">
              Plan your property purchase with ease. Calculate your Equated Monthly Installment (EMI) to understand your financial commitment before buying your dream home.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column: EMI Calculator Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl overflow-hidden border border-[#C9A84C]/20"
            >
              {/* Form Header */}
              <div className="bg-gradient-to-r from-[#C9A84C] to-[#B8941F] p-4 sm:p-5 flex items-center gap-3">
                <Calculator className="w-5 h-5 text-white" />
                <h2 className="text-xl font-bold text-white ">Calculate Your EMI</h2>
              </div>

              {/* Form Body */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <Label className="text-sm font-medium text-gray-300 sm:text-right pr-4">Loan Amount (Rs.)</Label>
                  <div className="sm:col-span-2">
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="e.g. 5000000"
                      value={principal}
                      onChange={(e) => setPrincipal(e.target.value.replace(/[^0-9.]/g, ''))}
                      className="bg-white/5 border-gray-700 text-white focus:border-[#C9A84C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <Label className="text-sm font-medium text-gray-300 sm:text-right pr-4">Interest Rate (%)</Label>
                  <div className="sm:col-span-2">
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="e.g. 8.5"
                      value={rate}
                      onChange={(e) => setRate(e.target.value.replace(/[^0-9.]/g, ''))}
                      className="bg-white/5 border-gray-700 text-white focus:border-[#C9A84C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <Label className="text-sm font-medium text-gray-300 sm:text-right pr-4">Loan Period (Yrs)</Label>
                  <div className="sm:col-span-2">
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="e.g. 20"
                      value={years}
                      onChange={(e) => setYears(e.target.value.replace(/[^0-9.]/g, ''))}
                      className="bg-white/5 border-gray-700 text-white focus:border-[#C9A84C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center pt-4 border-t border-gray-800">
                  <Label className="text-sm font-bold text-[#C9A84C] sm:text-right pr-4">Monthly EMI (Rs.)</Label>
                  <div className="sm:col-span-2">
                    <div className="bg-[#0a0a12] border border-[#C9A84C]/30 rounded-md p-3 text-white font-semibold text-lg flex items-center h-11">
                      {emi !== null ? formatCurrency(emi) : '-'}
                    </div>
                  </div>
                </div>

                {emi !== null && totalPayment !== null && totalInterest !== null && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    className="space-y-4 pt-4 border-t border-gray-800/50"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                      <Label className="text-sm font-medium text-gray-400 sm:text-right pr-4">Total Interest Paid</Label>
                      <div className="sm:col-span-2">
                        <div className="bg-white/5 border border-gray-800 rounded-md p-3 text-gray-300 font-medium flex items-center h-11">
                          {formatCurrency(totalInterest)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                      <Label className="text-sm font-medium text-gray-400 sm:text-right pr-4">Total Payment</Label>
                      <div className="sm:col-span-2">
                        <div className="bg-white/5 border border-gray-800 rounded-md p-3 text-gray-300 font-medium flex items-center h-11">
                          {formatCurrency(totalPayment)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-end pt-4">
                  <Button
                    onClick={handleClear}
                    variant="outline"
                    className="w-full sm:w-auto border-gray-700 text-gray-300 hover:text-white hover:bg-white/5"
                  >
                    Clear
                  </Button>
                  <Button
                    onClick={calculateEmi}
                    className="w-full sm:w-auto btn-gold text-white font-semibold"
                  >
                    Calculate EMI
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Hot Properties Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-2xl p-6 border border-[#C9A84C]/20"
            >
              <h3 className="text-xl font-bold text-[#C9A84C] mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#C9A84C] rounded-full inline-block" />
                Hot Properties
              </h3>

              <div className="space-y-4">
                {hotProperties.length > 0 ? (
                  hotProperties.map((property) => (
                    <Link href={`/property/${property.id}`} key={property.id} className="block group">
                      <div className="flex gap-4 items-center pb-4 border-b border-gray-800 last:border-0 last:pb-0">
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 relative">
                          <img
                            src={Array.isArray(property.images) && property.images.length > 0 ? property.images[0] : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200&h=200&fit=crop'}
                            alt={property.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-200 group-hover:text-[#C9A84C] transition-colors line-clamp-2">
                            {property.name}
                          </h4>
                          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                            <MapPin className="w-3 h-3 text-[#C9A84C]" />
                            <span className="truncate">{property.location}, {property.city}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-sm text-gray-500 text-center py-4">No properties found.</div>
                )}
              </div>

              <div className="mt-6">
                <Link href="/projects">
                  <Button variant="outline" className="w-full btn-gold-outline">
                    View All Properties
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
}
