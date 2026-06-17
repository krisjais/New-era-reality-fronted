'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Shield, Users, Target, Eye, Award, Building2, MapPin, Phone,
  CheckCircle2, Crown, TrendingUp, Heart, Compass, Lightbulb
} from 'lucide-react'

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-20 pb-16">
      {/* Hero */}
      <section className="relative py-16 sm:py-24 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-[#0a0a12] dark:via-[#151520] dark:to-[#0a0a12] overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C9A84C] rounded-full blur-[150px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge className="bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20 mb-4">
              <Shield className="w-3 h-3 mr-1" /> RERA Registered Consultant
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold ">
              About <span className="gold-text">New Era Reality</span>
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A trusted name in Mumbai&apos;s real estate landscape, we are committed to helping you find
              not just a property, but a place you can truly call home.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Story */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="py-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Our <span className="gold-text">Story</span>
              </h2>
              <div className="luxury-divider max-w-24 mb-6" />
              <p className="text-foreground/80 leading-relaxed mb-4">
                Established in 2023, New Era Reality was founded with a vision to transform the real estate
                consulting experience in Mumbai. Led by Rohit Kumar, a seasoned professional with deep
                expertise in the Mumbai property market, our team has quickly grown to become one of the
                most trusted names in the industry.
              </p>
              <p className="text-foreground/80 leading-relaxed mb-4">
                We understand that buying a home is one of the most significant decisions in a person&apos;s
                life. That&apos;s why we go beyond just showing properties — we provide comprehensive guidance,
                market insights, and personalized recommendations that empower our clients to make
                informed decisions with confidence.
              </p>
              <p className="text-foreground/80 leading-relaxed">
                From luxury apartments in Chembur to affordable villas in Thane, from investment plots in
                Atgaon to premium residences in Ghatkopar — our portfolio spans the entire spectrum of
                real estate offerings in the Mumbai Metropolitan Region.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[#C9A84C]/20 to-[#C9A84C]/5 border border-[#C9A84C]/20 flex items-center justify-center">
                <div className="text-center">
                  <Crown className="w-16 h-16 text-[#C9A84C] mx-auto mb-4" />
                  <p className="text-3xl font-bold gold-text">Since 2023</p>
                  <p className="text-muted-foreground mt-2">Building Trust, Delivering Dreams</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <Separator className="opacity-30" />

        {/* Mission & Vision */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="py-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="glass-card border-[#C9A84C]/10">
              <CardContent className="p-6 sm:p-8">
                <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center mb-4">
                  <Compass className="w-6 h-6 text-[#C9A84C]" />
                </div>
                <h3 className="text-xl font-bold mb-3">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To simplify the home-buying journey by providing expert guidance, transparent processes,
                  and personalized property solutions. We are dedicated to helping every client find their
                  perfect home while ensuring the highest standards of professionalism and integrity.
                </p>
              </CardContent>
            </Card>
            <Card className="glass-card border-[#C9A84C]/10">
              <CardContent className="p-6 sm:p-8">
                <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center mb-4">
                  <Lightbulb className="w-6 h-6 text-[#C9A84C]" />
                </div>
                <h3 className="text-xl font-bold mb-3">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To become the most trusted and preferred real estate consultancy in the Mumbai Metropolitan
                  Region, known for our unwavering commitment to client satisfaction, market expertise, and
                  ethical business practices that set new benchmarks in the industry.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        <Separator className="opacity-30" />

        {/* Founder */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="py-16"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Meet Our <span className="gold-text">Founder</span>
            </h2>
            <div className="luxury-divider max-w-24 mx-auto mb-8" />
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#B8941F] flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-white ">RK</span>
            </div>
            <h3 className="text-xl font-bold ">Rohit Kumar</h3>
            <p className="text-[#C9A84C] font-medium mb-4">Founder & Lead Consultant</p>
            <p className="text-muted-foreground leading-relaxed">
              With extensive experience in Mumbai&apos;s real estate market, Rohit Kumar founded New Era Reality
              with a simple yet powerful belief: every family deserves a home that matches their aspirations.
              His deep understanding of market trends, property valuations, and the unique needs of different
              buyer segments has helped hundreds of families find their dream homes. Under his leadership,
              New Era Reality has grown into a trusted name known for its client-first approach and
              unwavering commitment to transparency.
            </p>
          </div>
        </motion.section>

        <Separator className="opacity-30" />

        {/* Achievements */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="py-16"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            Our <span className="gold-text">Achievements</span>
          </h2>
          <div className="luxury-divider max-w-24 mx-auto mb-8" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { icon: Building2, value: '150+', label: 'Properties Listed' },
              { icon: Users, value: '500+', label: 'Happy Clients' },
              { icon: TrendingUp, value: '98%', label: 'Client Satisfaction' },
              { icon: Award, value: '10+', label: 'Years Experience' },
            ].map((stat) => (
              <div key={stat.label} className="text-center glass-card rounded-xl p-5 border border-[#C9A84C]/10">
                <stat.icon className="w-7 h-7 text-[#C9A84C] mx-auto mb-3" />
                <p className="text-2xl font-bold gold-text ">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <Separator className="opacity-30" />

        {/* RERA & Services */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="py-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* RERA */}
            <Card className="glass-card border-[#C9A84C]/10">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-8 h-8 text-[#C9A84C]" />
                  <div>
                    <h3 className="text-xl font-bold ">RERA Registration</h3>
                    <p className="text-[#C9A84C] font-medium text-sm">Fully Compliant</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  New Era Reality is a RERA registered real estate consultant with registration number
                  A031182504637. This ensures that all our operations comply with the Real Estate
                  (Regulation and Development) Act, 2016, providing our clients with legal protection
                  and assurance of ethical practices.
                </p>
                <Badge className="bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20 text-sm px-3 py-1">
                  RERA No: A031182504637
                </Badge>
              </CardContent>
            </Card>

            {/* Services */}
            <Card className="glass-card border-[#C9A84C]/10">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-xl font-bold mb-4">Our Services</h3>
                <div className="space-y-3">
                  {[
                    'Real Estate Agent — Buying, selling & renting properties',
                    'Property Consultant — Expert investment guidance',
                    'Site Visit Arrangements — Hassle-free property tours',
                    'Documentation Support — End-to-end paperwork assistance',
                    'Home Loan Guidance — Connect with top banks & NBFCs',
                    'Post-Sale Support — Continued assistance after purchase',
                  ].map((service) => (
                    <div key={service} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#C9A84C] mt-0.5 shrink-0" />
                      <span className="text-sm text-muted-foreground">{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.section>
      </div>
    </main>
  )
}
