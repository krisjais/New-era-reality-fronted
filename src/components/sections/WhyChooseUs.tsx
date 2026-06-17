'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Shield, Users, Lightbulb, Eye } from 'lucide-react'

const FEATURES = [
  {
    icon: Lightbulb,
    title: 'Market Expertise',
    description: 'Deep understanding of Mumbai\'s real estate market with insights that help you make informed decisions about property investments.',
  },
  {
    icon: Shield,
    title: 'RERA Registered',
    description: 'We are a RERA registered consultant (A031182504637), ensuring complete transparency and legal compliance in every transaction.',
  },
  {
    icon: Users,
    title: 'Personalized Service',
    description: 'Every client receives dedicated attention with customized property recommendations tailored to their unique requirements and budget.',
  },
  {
    icon: Eye,
    title: 'Transparent Process',
    description: 'No hidden charges, no misleading promises. We believe in complete transparency from property search to final handover.',
  },
]

export default function WhyChooseUs() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

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
          <h2 className="text-3xl sm:text-4xl font-bold ">
            Why Choose <span className="gold-text">New Era Reality</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            We bring a decade of expertise and unwavering commitment to help you find not just a house, but a home.
          </p>
          <div className="luxury-divider max-w-48 mx-auto mt-6" />
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="glass-card rounded-2xl p-6 text-center border border-[#C9A84C]/10 hover:border-[#C9A84C]/30 transition-all group"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#C9A84C]/20 to-[#C9A84C]/5 flex items-center justify-center mx-auto mb-4 group-hover:from-[#C9A84C]/30 group-hover:to-[#C9A84C]/10 transition-all">
                <feature.icon className="w-7 h-7 text-[#C9A84C]" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
