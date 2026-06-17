'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import LeadForm from '@/components/shared/LeadForm'
import { Button } from '@/components/ui/button'
import { Phone, MessageCircle } from 'lucide-react'

export default function CTASection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-16 sm:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a12] via-[#151520] to-[#0a0a12]" />
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C9A84C] rounded-full blur-[200px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left - CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
              Ready to Find Your{' '}
              <span className="gold-text">Dream Home?</span>
            </h2>
            <p className="mt-4 text-gray-400 text-base sm:text-lg leading-relaxed max-w-lg">
              Get in touch with our expert team today. We&apos;ll help you navigate the Mumbai real estate
              market and find the perfect property that matches your needs and budget.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <a href="tel:+917021731962" className="w-full sm:w-auto">
                <Button size="lg" className="btn-gold text-white font-semibold rounded-xl w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  Call +91-70217 31962
                </Button>
              </a>
              <a href="https://wa.me/917021731962" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp Chat
                </Button>
              </a>
            </div>

            <div className="flex items-center gap-2 mt-6 text-sm text-gray-500">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Available Mon-Sat, 9 AM - 7 PM
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-[#C9A84C]/10">
              <h3 className="text-xl font-bold text-foreground mb-1">
                Request a Callback
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Fill in your details and our team will call you within 30 minutes.
              </p>
              <LeadForm defaultLeadType="callback" source="cta_section" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
