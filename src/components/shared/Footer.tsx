'use client'

import { useAppStore } from '@/lib/store'
import { Separator } from '@/components/ui/separator'
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter, Linkedin, Crown, Shield } from 'lucide-react'
import type { Page } from '@/lib/store'

const QUICK_LINKS: { label: string; page: Page }[] = [
  { label: 'Home', page: 'home' },
  { label: 'Projects', page: 'projects' },
  { label: 'About Us', page: 'about' },
  { label: 'Testimonials', page: 'testimonials' },
  { label: 'Contact', page: 'contact' },
]

const LOCATIONS = ['Chembur', 'Kurla East', 'Ghatkopar', 'Matunga', 'Panvel', 'Atgaon']

export default function Footer() {
  const { navigate } = useAppStore()

  return (
    <footer className="bg-[#0a0a12] text-gray-300 border-t border-[#C9A84C]/20">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/logo.jpg" 
                alt="New Era Reality Logo" 
                className="h-10 w-auto object-contain rounded-lg shadow-sm shadow-[#C9A84C]/10" 
              />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Your trusted partner in finding the perfect home. We are a RERA registered real estate
              consultant offering premium property solutions across Mumbai, Navi Mumbai & Thane.
            </p>
            <div className="flex items-center gap-2 text-sm text-[#C9A84C]">
              <Shield className="w-4 h-4" />
              <span>RERA No: A031182504637</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#C9A84C] font-semibold font-[var(--font-playfair)] text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => navigate(link.page)}
                    className="text-sm text-gray-400 hover:text-[#C9A84C] transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="text-[#C9A84C] font-semibold font-[var(--font-playfair)] text-lg mb-4">Locations</h4>
            <ul className="space-y-2.5">
              {LOCATIONS.map((loc) => (
                <li key={loc}>
                  <button
                    onClick={() => navigate('projects')}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#C9A84C] transition-colors cursor-pointer"
                  >
                    <MapPin className="w-3 h-3" />
                    {loc}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[#C9A84C] font-semibold font-[var(--font-playfair)] text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                <span className="text-gray-400">Nehru Nagar, Kurla East, Mumbai, Maharashtra - 400070</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-[#C9A84C] shrink-0" />
                <a href="tel:+917021731962" className="text-gray-400 hover:text-[#C9A84C] transition-colors">
                  +91-70217 31962 | +91-90762 59009
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-[#C9A84C] shrink-0" />
                <a href="mailto:jaiswarshivlal0@gmail.com" className="text-gray-400 hover:text-[#C9A84C] transition-colors">
                  jaiswarshivlal0@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-[#C9A84C] shrink-0" />
                <span className="text-gray-400">Mon-Sat: 9:00 AM - 7:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Social + Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500 text-center sm:text-left">
              &copy; {new Date().getFullYear()} New Era Reality. All rights reserved. RERA Reg No: A031182504637
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Instagram, label: 'Instagram' },
                { icon: Facebook, label: 'Facebook' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Linkedin, label: 'LinkedIn' },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-gray-500 hover:text-[#C9A84C] hover:border-[#C9A84C]/40 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
