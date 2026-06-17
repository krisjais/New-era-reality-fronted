'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Send, Loader2 } from 'lucide-react'

interface LeadFormProps {
  propertyId?: string | null
  defaultLeadType?: string
  source?: string
  onSuccess?: () => void
  compact?: boolean
}

export default function LeadForm({ propertyId, defaultLeadType, source = 'homepage', onSuccess, compact }: LeadFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    leadType: defaultLeadType || 'inquiry',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error('Please fill in name and phone number')
      return
    }
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      toast.error('Please enter a valid 10-digit phone number')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('https://new-era-reality-backend.onrender.com/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          propertyId: propertyId || null,
          source,
        }),
      })
      if (!res.ok) throw new Error('Failed to submit')
      toast.success('Thank you! We will get back to you shortly.')
      setFormData({ name: '', phone: '', email: '', leadType: defaultLeadType || 'inquiry', message: '' })
      onSuccess?.()
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${compact ? 'space-y-3' : ''}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lead-name" className="text-sm">Full Name *</Label>
          <Input
            id="lead-name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-background/50"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lead-phone" className="text-sm">Phone Number *</Label>
          <Input
            id="lead-phone"
            placeholder="Enter 10-digit number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="bg-background/50"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="lead-email" className="text-sm">Email</Label>
        <Input
          id="lead-email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="bg-background/50"
        />
      </div>

      {!defaultLeadType && (
        <div className="space-y-2">
          <Label className="text-sm">Inquiry Type</Label>
          <Select
            value={formData.leadType}
            onValueChange={(value) => setFormData({ ...formData, leadType: value })}
          >
            <SelectTrigger className="bg-background/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="callback">Request Callback</SelectItem>
              <SelectItem value="site_visit">Schedule Site Visit</SelectItem>
              <SelectItem value="inquiry">General Inquiry</SelectItem>
              <SelectItem value="brochure_download">Download Brochure</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="lead-message" className="text-sm">Message</Label>
        <Textarea
          id="lead-message"
          placeholder="Tell us about your requirements..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="bg-background/50 min-h-[80px]"
          rows={3}
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full btn-gold text-white font-semibold py-3 rounded-lg shadow-lg"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : (
          <Send className="w-4 h-4 mr-2" />
        )}
        {loading ? 'Submitting...' : 'Submit Inquiry'}
      </Button>
    </form>
  )
}
