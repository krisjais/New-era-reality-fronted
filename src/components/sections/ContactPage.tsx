'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import LeadForm from '@/components/shared/LeadForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, Building2 } from 'lucide-react'
import { useAppStore } from '@/lib/store'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const { properties } = useAppStore()
  const [form, setForm] = useState({
    name: '', email: '', phone: '', message: '', propertyInterest: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('Please fill in name and phone number')
      return
    }
    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) {
      toast.error('Please enter a valid 10-digit phone number')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://new-era-reality-backend.onrender.com/api'}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email || null,
          phone: form.phone,
          message: form.message || null,
          leadType: 'inquiry',
          source: 'contact_form',
          propertyId: form.propertyInterest && form.propertyInterest !== 'none' ? form.propertyInterest : null,
        }),
      })
      if (!res.ok) throw new Error('Failed')

      toast.success('Your inquiry has been saved. Redirecting to WhatsApp...')

      const targetPropertyId = form.propertyInterest && form.propertyInterest !== 'none' ? form.propertyInterest : null
      const property = targetPropertyId ? properties.find((p) => p.id === targetPropertyId) : null

      const propertyName = property?.name || 'N/A'
      const budget = property?.priceLabel || 'N/A'

      const waMessage = `Hello New Era Reality,

I would like to inquire about this property.

Property Name:
${propertyName}

Customer Name:
${form.name}

Phone Number:
${form.phone}

Email:
${form.email || 'N/A'}

Budget:
${budget}

Message:
${form.message || 'N/A'}

Please contact me regarding this property.

Thank you.`

      const waUrl = `https://wa.me/919076259009?text=${encodeURIComponent(waMessage)}`

      setForm({ name: '', email: '', phone: '', message: '', propertyInterest: '' })

      window.location.href = waUrl
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold ">
            Contact <span className="gold-text">Us</span>
          </h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Get in touch with our expert team. We&apos;re here to help you find your perfect property.
          </p>
          <div className="luxury-divider max-w-48 mx-auto mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <Card className="glass-card border-[#C9A84C]/10">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Our Office</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#C9A84C] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Address</p>
                      <p className="text-sm text-muted-foreground">Nehru Nagar, Kurla East, Mumbai, Maharashtra - 400070</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#C9A84C] shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Phone</p>
                      <a href="tel:+917021731962" className="text-sm text-muted-foreground hover:text-[#C9A84C] transition-colors block">
                        +91-70217 31962
                      </a>
                      <a href="tel:+919076259009" className="text-sm text-muted-foreground hover:text-[#C9A84C] transition-colors block">
                        +91-90762 59009
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#C9A84C] shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Email</p>
                      <a href="mailto:jaiswarshivlal0@gmail.com" className="text-sm text-muted-foreground hover:text-[#C9A84C] transition-colors">
                        jaiswarshivlal0@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#C9A84C] shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Business Hours</p>
                      <p className="text-sm text-muted-foreground">Mon-Sat: 9:00 AM - 7:00 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              <a href="https://wa.me/917021731962" target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat on WhatsApp
                </Button>
              </a>
              <a href="tel:+917021731962" className="block">
                <Button variant="outline" className="w-full btn-gold-outline font-semibold">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Us Now
                </Button>
              </a>
            </div>

            {/* Map Placeholder */}
            <Card className="glass-card border-[#C9A84C]/10 overflow-hidden">
              <div className="h-48 bg-muted/50 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-[#C9A84C] mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Nehru Nagar, Kurla East</p>
                  <p className="text-xs text-muted-foreground">Mumbai - 400070</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="glass-card border-[#C9A84C]/10">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-xl font-bold mb-1">Send Us a Message</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Fill out the form below and our team will get back to you within 24 hours.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-name">Full Name *</Label>
                      <Input
                        id="contact-name"
                        placeholder="Enter your name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-phone">Phone Number *</Label>
                      <Input
                        id="contact-phone"
                        placeholder="Enter 10-digit number"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Property Interest</Label>
                    <Select
                      value={form.propertyInterest}
                      onValueChange={(v) => setForm({ ...form, propertyInterest: v })}
                    >
                      <SelectTrigger>
                        <Building2 className="w-4 h-4 mr-2 text-[#C9A84C]" />
                        <SelectValue placeholder="Select a property (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No specific property</SelectItem>
                        <SelectItem value="1">Arihant Sky, Chembur</SelectItem>
                        <SelectItem value="2">Hubtown Rising City, Ghatkopar</SelectItem>
                        <SelectItem value="3">Sky Heights, Kurla</SelectItem>
                        <SelectItem value="7">Chembur Luxury Towers</SelectItem>
                        <SelectItem value="10">Matunga Heritage Towers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-message">Message</Label>
                    <Textarea
                      id="contact-message"
                      placeholder="Tell us about your requirements..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={4}
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full btn-gold text-white font-semibold py-3">
                    {loading ? 'Sending...' : <><Send className="w-4 h-4 mr-2" />Send Message</>}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
