'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'
import {
  LayoutDashboard, Building2, Users, MessageSquare, Bell, LogOut,
  Eye, EyeOff, Heart, Phone, Plus, Pencil, Trash2, Check, X, Loader2,
  Crown, TrendingUp, BarChart3, ArrowLeft, ChevronRight, MapPin, MessageCircle,
  UploadCloud, ImageIcon
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'

// Types
interface AdminProperty {
  id: string; name: string; propertyType: string; bhk: string | null; priceLabel: string;
  city: string; location: string; status: string; views: number; likes: number; inquiries: number;
  featured: boolean; [key: string]: unknown;
}

interface AdminLead {
  id: string; name: string; phone: string; email: string | null; leadType: string;
  status: string; message: string | null; source: string | null; propertyId: string | null;
  createdAt: string; property?: { name: string } | null;
}

interface AdminTestimonial {
  id: string; clientName: string; rating: number; testimonial: string;
  propertyPurchased: string | null; featured: boolean; approved: boolean; createdAt: string;
}

interface AdminNotification {
  id: string; type: string; title: string; message: string; phone: string | null; leadName: string | null; isRead: boolean; createdAt: string;
}

const SIDEBAR_ITEMS = [
  { key: 'admin' as const, label: 'Dashboard', icon: LayoutDashboard, shortLabel: 'Home' },
  { key: 'admin-projects' as const, label: 'Projects', icon: Building2, shortLabel: 'Projects' },
  { key: 'admin-leads' as const, label: 'Leads', icon: Users, shortLabel: 'Leads' },
  { key: 'admin-testimonials' as const, label: 'Testimonials', icon: MessageSquare, shortLabel: 'Reviews' },
  { key: 'admin-notifications' as const, label: 'Notifications', icon: Bell, shortLabel: 'Alerts' },
]

const CHART_COLORS = ['#C9A84C', '#B8941F', '#E8D48B', '#A8892E', '#D4AF37']

// Login Screen
function AdminLogin() {
  const { setAdminAuth } = useAppStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        setError('Invalid credentials')
        return
      }
      setAdminAuth(true)
      toast.success('Welcome back, Admin!')
    } catch {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a12] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#13131a] rounded-2xl p-6 sm:p-8 w-full max-w-md border border-[#C9A84C]/10"
      >
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#B8941F] flex items-center justify-center mx-auto mb-3">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold font-[var(--font-playfair)] gold-text">Admin Login</h1>
          <p className="text-sm text-muted-foreground mt-1">New Era Reality Dashboard</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input id="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@newerareality.in" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <div className="relative">
              <Input id="admin-password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-primary focus:outline-none" aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full btn-gold text-white font-semibold py-3">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
          <p className="text-xs text-center text-muted-foreground">Default: admin@newerareality.in / admin123</p>
        </form>
      </motion.div>
    </div>
  )
}

// Dashboard Overview
function DashboardOverview() {
  const [stats, setStats] = useState({ properties: 0, leads: 0, views: 0, likes: 0 })
  const [leadsByType, setLeadsByType] = useState<{ name: string; value: number }[]>([])
  const [leadsOverTime, setLeadsOverTime] = useState<{ name: string; count: number }[]>([])
  const [recentLeads, setRecentLeads] = useState<AdminLead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propRes, leadRes] = await Promise.all([fetch('/api/properties'), fetch('/api/leads')])
        const properties: AdminProperty[] = await propRes.json()
        const leads: AdminLead[] = await leadRes.json()

        const totalViews = properties.reduce((acc, p) => acc + (p.views || 0), 0)
        const totalLikes = properties.reduce((acc, p) => acc + (p.likes || 0), 0)

        setStats({ properties: properties.length, leads: leads.length, views: totalViews, likes: totalLikes })
        setRecentLeads(leads.slice(0, 5))

        // Leads by type for pie chart
        const typeMap: Record<string, number> = {}
        leads.forEach((l) => { typeMap[l.leadType] = (typeMap[l.leadType] || 0) + 1 })
        setLeadsByType(Object.entries(typeMap).map(([name, value]) => ({ name, value })))

        // Leads over time (by date) for bar chart
        const dateMap: Record<string, number> = {}
        leads.forEach((l) => {
          const date = new Date(l.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
          dateMap[date] = (dateMap[date] || 0) + 1
        })
        setLeadsOverTime(Object.entries(dateMap).map(([name, count]) => ({ name, count })).slice(-7))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#C9A84C]" /></div>
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold font-[var(--font-playfair)]">Dashboard Overview</h2>
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Stat Cards */}
      <motion.div 
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
        initial="hidden" animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
      >
        {[
          { label: 'Total Projects', value: stats.properties, icon: Building2 },
          { label: 'Total Leads', value: stats.leads, icon: Users },
          { label: 'Property Views', value: stats.views, icon: Eye },
          { label: 'Property Likes', value: stats.likes, icon: Heart },
        ].map((stat) => (
          <motion.div key={stat.label} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
            <Card className="bg-[#13131a] border-transparent hover:border-[#C9A84C]/20 transition-all cursor-pointer group hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(201,168,76,0.1)]">
              <CardContent className="p-4 sm:p-5">
                <div className="flex justify-between items-start mb-2 sm:mb-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-400">{stat.label}</p>
                  <div className="w-8 h-8 rounded-full bg-[#1a1a24] flex items-center justify-center group-hover:bg-[#C9A84C]/10 transition-colors">
                    <stat.icon className="w-4 h-4 text-gray-500 group-hover:text-[#C9A84C] transition-colors" />
                  </div>
                </div>
                <p className="text-2xl sm:text-4xl font-bold tracking-tight text-white group-hover:text-[#C9A84C] transition-colors">
                  {stat.value.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6"
      >
        {/* Pie Chart - Takes 1 column */}
        <Card className="bg-[#13131a] border-transparent lg:col-span-1">
          <CardHeader className="pb-2 p-4 sm:p-5 border-b border-white/5">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#C9A84C]" /> Leads by Type
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 flex flex-col items-center justify-center min-h-[250px]">
            {leadsByType.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={leadsByType} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" stroke="none" paddingAngle={5}>
                    {leadsByType.map((_, index) => (
                      <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#13131a', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground">No lead data yet</p>
            )}
            {leadsByType.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                {leadsByType.map((l, i) => (
                  <div key={l.name} className="flex items-center gap-1.5 text-xs text-gray-400">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                    {l.name}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bar Chart - Takes 2 columns */}
        <Card className="bg-[#13131a] border-transparent lg:col-span-2">
          <CardHeader className="pb-2 p-4 sm:p-5 border-b border-white/5">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#C9A84C]" /> Leads Over Time
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-5">
            {leadsOverTime.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={leadsOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ backgroundColor: '#13131a', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '8px' }} />
                  <Bar dataKey="count" fill="url(#goldGradient)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <defs>
                    <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C9A84C" />
                      <stop offset="100%" stopColor="#8A7331" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center">
                <p className="text-sm text-muted-foreground">No lead data yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Leads - List Style */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-[#13131a] border-transparent">
          <CardHeader className="pb-2 p-4 sm:p-5 border-b border-white/5 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold">Recent Inquiries</CardTitle>
            <Button variant="ghost" size="sm" className="h-8 text-xs text-[#C9A84C] hover:text-white hover:bg-[#C9A84C]/20">View All</Button>
          </CardHeader>
          <CardContent className="p-0">
            {recentLeads.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No inquiries yet</p>
            ) : (
              <div className="divide-y divide-white/5">
                {recentLeads.map((lead, i) => (
                  <motion.div 
                    key={lead.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.05 }}
                    className="flex items-center justify-between p-4 sm:px-5 hover:bg-white/[0.02] transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#1a1a24] border border-white/10 flex items-center justify-center shrink-0">
                        <span className="text-[#C9A84C] font-semibold text-sm">{lead.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-white group-hover:text-[#C9A84C] transition-colors">{lead.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-500">{lead.phone}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-700" />
                          <span className="text-xs text-gray-500">{new Date(lead.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="hidden sm:flex flex-col items-end mr-4">
                        <span className="text-xs text-gray-400">Type</span>
                        <span className="text-sm font-medium text-gray-200">{lead.leadType}</span>
                      </div>
                      <Badge className={`px-2 py-0.5 rounded-full text-[10px] font-medium border-0 ${
                        lead.status === 'new' ? 'bg-blue-500/10 text-blue-400' : 
                        lead.status === 'contacted' ? 'bg-amber-500/10 text-amber-400' : 
                        lead.status === 'converted' ? 'bg-[#C9A84C]/20 text-[#C9A84C] shadow-[0_0_10px_rgba(201,168,76,0.2)]' : 
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </Badge>
                      <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-white/10 hover:text-white text-gray-400">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

// Projects Management
function ProjectsManagement() {
  const [properties, setProperties] = useState<AdminProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [editProp, setEditProp] = useState<AdminProperty | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isNew, setIsNew] = useState(false)

  const fetchProperties = useCallback(async () => {
    try {
      const res = await fetch('/api/properties')
      const data = await res.json()
      setProperties(data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchProperties() }, [fetchProperties])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return
    try {
      await fetch(`/api/properties/${id}`, { method: 'DELETE' })
      toast.success('Property deleted')
      fetchProperties()
    } catch { toast.error('Failed to delete') }
  }

  const handleSave = async (data: Record<string, unknown>) => {
    try {
      if (isNew) {
        await fetch('/api/properties', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        toast.success('Property created')
      } else if (editProp) {
        await fetch(`/api/properties/${editProp.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        toast.success('Property updated')
      }
      setIsOpen(false)
      setEditProp(null)
      fetchProperties()
    } catch { toast.error('Failed to save') }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#C9A84C]" /></div>

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg sm:text-2xl font-bold font-[var(--font-playfair)]">Projects</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gold text-white text-xs sm:text-sm" onClick={() => { setIsNew(true); setEditProp({ id: '', name: '', propertyType: 'Apartment', bhk: '', priceLabel: '', city: 'Mumbai', location: '', status: 'active', views: 0, likes: 0, inquiries: 0, featured: false }) }}>
              <Plus className="w-4 h-4 mr-1" /> <span className="hidden sm:inline">Add Property</span><span className="sm:hidden">Add</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto mx-4 sm:mx-auto w-[calc(100%-2rem)] sm:w-full">
            <DialogHeader>
              <DialogTitle>{isNew ? 'Add New Property' : 'Edit Property'}</DialogTitle>
            </DialogHeader>
            <PropertyForm property={editProp} onSave={handleSave} onCancel={() => { setIsOpen(false); setEditProp(null) }} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Mobile: Card layout */}
      <div className="sm:hidden space-y-3">
        {properties.map((prop) => (
          <div key={prop.id} className="bg-[#13131a] rounded-xl p-4 border border-transparent hover:border-[#C9A84C]/20 transition-all hover:-translate-y-0.5">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm truncate">{prop.name}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
                  <span className="text-xs text-muted-foreground truncate">{prop.city} &bull; {prop.location}</span>
                </div>
              </div>
              <Badge className={`text-[10px] shrink-0 ${prop.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {prop.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px]">{prop.propertyType}</Badge>
                <span className="text-sm font-semibold text-[#C9A84C]">{prop.priceLabel}</span>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => { setIsNew(false); setEditProp(prop); setIsOpen(true) }}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-400" onClick={() => handleDelete(prop.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {properties.length === 0 && (
          <Card className="bg-[#13131a] border-transparent">
            <CardContent className="py-8 text-center text-muted-foreground text-sm">No properties found</CardContent>
          </Card>
        )}
      </div>

      {/* Desktop: Table layout */}
      <Card className="hidden sm:block bg-[#13131a] border-transparent">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((prop) => (
                  <TableRow key={prop.id}>
                    <TableCell className="font-medium">{prop.name}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-xs">{prop.propertyType}</Badge></TableCell>
                    <TableCell className="text-sm">{prop.city}</TableCell>
                    <TableCell className="text-sm">{prop.priceLabel}</TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${prop.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {prop.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => { setIsNew(false); setEditProp(prop); setIsOpen(true) }}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(prop.id)} className="text-red-500 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {properties.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No properties found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PropertyForm({ property, onSave, onCancel }: { property: AdminProperty | null; onSave: (data: Record<string, unknown>) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Record<string, string>>({
    name: property?.name || '',
    propertyType: property?.propertyType || 'Apartment',
    bhk: property?.bhk || '',
    priceLabel: property?.priceLabel || '',
    city: property?.city || 'Mumbai',
    location: property?.location || '',
    status: property?.status || 'active',
    description: (property?.description as string) || '',
    price: String(property?.price || '0'),
    featured: property?.featured ? 'true' : 'false',
    premium: property?.premium ? 'true' : 'false',
    possessionStatus: property?.possessionStatus || 'Ready to Move',
    reraRegistered: property?.reraRegistered ? 'true' : 'false',
    areaSqft: String(property?.areaSqft || ''),
    pricePerSqft: String(property?.pricePerSqft || ''),
  });

  const getArray = (val: unknown): string[] => {
    if (!val) return [];
    if (typeof val === 'string') {
      try { const arr = JSON.parse(val); return Array.isArray(arr) ? arr : [val]; } catch { return [val]; }
    }
    return Array.isArray(val) ? val.map(String) : [String(val)];
  };

  const [images, setImages] = useState<string[]>(getArray(property?.images));
  const [amenities, setAmenities] = useState<string[]>(getArray(property?.amenities));
  const [newAmenity, setNewAmenity] = useState('');
  const [uploading, setUploading] = useState(false);

  const PRESET_AMENITIES = ["Swimming Pool", "Gymnasium", "Clubhouse", "24/7 Security", "Power Backup", "Parking", "Kids Play Area", "Jogging Track"];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const formData = new FormData();
    Array.from(e.target.files).forEach(file => formData.append('files', file));
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        setImages([...images, ...data.urls]);
      } else {
        toast.error('Upload failed');
      }
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const toggleAmenity = (amenity: string) => {
    if (amenities.includes(amenity)) setAmenities(amenities.filter(a => a !== amenity));
    else setAmenities([...amenities, amenity]);
  };

  const handleAddCustomAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()]);
    }
    setNewAmenity('');
  };

  const handleFormSave = () => {
    const payload: Record<string, unknown> = { ...form };
    payload.featured = form.featured === 'true';
    payload.premium = form.premium === 'true';
    payload.reraRegistered = form.reraRegistered === 'true';
    payload.price = parseFloat(form.price) || 0;
    payload.areaSqft = form.areaSqft ? parseFloat(form.areaSqft) : null;
    payload.pricePerSqft = form.pricePerSqft ? parseFloat(form.pricePerSqft) : null;
    payload.images = JSON.stringify(images);
    payload.amenities = JSON.stringify(amenities);
    if (!property?.slug) payload.slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    onSave(payload);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2"><Label className="text-xs sm:text-sm">Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div className="space-y-2"><Label className="text-xs sm:text-sm">Type</Label>
          <Select value={form.propertyType} onValueChange={(v) => setForm({ ...form, propertyType: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Apartment">Apartment</SelectItem>
              <SelectItem value="Villa">Villa</SelectItem>
              <SelectItem value="Plot">Plot</SelectItem>
              <SelectItem value="Penthouse">Penthouse</SelectItem>
              <SelectItem value="Commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2"><Label className="text-xs sm:text-sm">Price Label</Label><Input value={form.priceLabel} onChange={(e) => setForm({ ...form, priceLabel: e.target.value })} placeholder="₹1.5 Cr" /></div>
        <div className="space-y-2"><Label className="text-xs sm:text-sm">BHK</Label><Input value={form.bhk} onChange={(e) => setForm({ ...form, bhk: e.target.value })} placeholder="2 BHK" /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2"><Label className="text-xs sm:text-sm">Area (Sq.Ft)</Label><Input type="number" value={form.areaSqft} onChange={(e) => setForm({ ...form, areaSqft: e.target.value })} placeholder="1200" /></div>
        <div className="space-y-2"><Label className="text-xs sm:text-sm">Price per Sq.Ft</Label><Input type="number" value={form.pricePerSqft} onChange={(e) => setForm({ ...form, pricePerSqft: e.target.value })} placeholder="15000" /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2"><Label className="text-xs sm:text-sm">City</Label>
          <Select value={form.city} onValueChange={(v) => setForm({ ...form, city: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Mumbai">Mumbai</SelectItem>
              <SelectItem value="Thane">Thane</SelectItem>
              <SelectItem value="Navi Mumbai">Navi Mumbai</SelectItem>
              <SelectItem value="Pune">Pune</SelectItem>
              <SelectItem value="Dubai">Dubai</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label className="text-xs sm:text-sm">Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2"><Label className="text-xs sm:text-sm">Status</Label>
          <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label className="text-xs sm:text-sm">Featured</Label>
          <Select value={form.featured} onValueChange={(v) => setForm({ ...form, featured: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="space-y-2"><Label className="text-xs sm:text-sm">Premium</Label>
          <Select value={form.premium} onValueChange={(v) => setForm({ ...form, premium: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label className="text-xs sm:text-sm">RERA Registered</Label>
          <Select value={form.reraRegistered} onValueChange={(v) => setForm({ ...form, reraRegistered: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label className="text-xs sm:text-sm">Possession Status</Label>
          <Select value={form.possessionStatus} onValueChange={(v) => setForm({ ...form, possessionStatus: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Ready to Move">Ready to Move</SelectItem>
              <SelectItem value="Under Construction">Under Construction</SelectItem>
              <SelectItem value="Nearing Possession">Nearing Possession</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs sm:text-sm">Photos</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {images.map((url, idx) => (
            <div key={idx} className="relative group rounded-md overflow-hidden bg-[#1a1a24] aspect-video border border-[#C9A84C]/20">
              <img src={url} alt={`Property ${idx}`} className="w-full h-full object-cover" />
              <button type="button" onClick={() => setImages(images.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-red-500/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
          <label className="relative flex flex-col items-center justify-center rounded-md border border-dashed border-[#C9A84C]/40 bg-[#1a1a24]/50 aspect-video hover:bg-[#1a1a24] transition-colors cursor-pointer">
            {uploading ? <Loader2 className="w-6 h-6 animate-spin text-[#C9A84C]" /> : <UploadCloud className="w-6 h-6 text-[#C9A84C]" />}
            <span className="text-xs text-muted-foreground mt-2">{uploading ? 'Uploading...' : 'Add Photo'}</span>
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs sm:text-sm">Amenities</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {PRESET_AMENITIES.map((amenity) => {
            const isSelected = amenities.includes(amenity);
            return (
              <Badge 
                key={amenity} 
                variant={isSelected ? "default" : "outline"} 
                className={`cursor-pointer ${isSelected ? 'bg-[#C9A84C] text-white hover:bg-[#B8941F]' : 'hover:border-[#C9A84C]'}`}
                onClick={() => toggleAmenity(amenity)}
              >
                {amenity}
              </Badge>
            );
          })}
          {amenities.filter(a => !PRESET_AMENITIES.includes(a)).map(amenity => (
            <Badge key={amenity} className="cursor-pointer bg-[#C9A84C] text-white hover:bg-[#B8941F]" onClick={() => toggleAmenity(amenity)}>
              {amenity} <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input value={newAmenity} onChange={e => setNewAmenity(e.target.value)} placeholder="Add custom amenity..." className="max-w-xs" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddCustomAmenity())} />
          <Button type="button" variant="outline" onClick={handleAddCustomAmenity}>Add</Button>
        </div>
      </div>

      <div className="space-y-2"><Label className="text-xs sm:text-sm">Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
      <div className="flex gap-3 pt-2">
        <Button onClick={handleFormSave} className="btn-gold text-white">Save</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  )
}

// Leads Management
function LeadsManagement() {
  const [leads, setLeads] = useState<AdminLead[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch('/api/leads')
      const data = await res.json()
      setLeads(data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/leads/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
      toast.success('Lead status updated')
      fetchLeads()
    } catch { toast.error('Failed to update') }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#C9A84C]" /></div>

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-lg sm:text-2xl font-bold font-[var(--font-playfair)]">Leads Management</h2>

      {/* Mobile: Card layout */}
      <div className="sm:hidden space-y-3">
        {leads.map((lead) => (
          <div key={lead.id} className="bg-[#13131a] rounded-xl p-4 border border-transparent hover:border-[#C9A84C]/20 transition-all hover:-translate-y-0.5">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm">{lead.name}</h3>
                <a href={`tel:${lead.phone}`} className="text-xs text-[#C9A84C] hover:underline">{lead.phone}</a>
              </div>
              <Badge variant="secondary" className="text-[10px] shrink-0">{lead.leadType}</Badge>
            </div>
            {lead.property?.name && (
              <p className="text-xs text-muted-foreground mb-2 truncate">
                <Building2 className="w-3 h-3 inline mr-1" />{lead.property.name}
              </p>
            )}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <Select value={lead.status} onValueChange={(v) => updateStatus(lead.id, v)}>
                  <SelectTrigger className="h-7 w-[110px] text-[10px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">{new Date(lead.createdAt).toLocaleDateString()}</span>
                <a href={`https://wa.me/91${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-green-500 hover:text-green-400 hover:bg-green-500/10"><MessageCircle className="w-3.5 h-3.5" /></Button>
                </a>
                <a href={`tel:${lead.phone}`}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-[#C9A84C]"><Phone className="w-3.5 h-3.5" /></Button>
                </a>
              </div>
            </div>
          </div>
        ))}
        {leads.length === 0 && (
          <Card className="bg-[#13131a] border-transparent">
            <CardContent className="py-8 text-center text-muted-foreground text-sm">No leads yet</CardContent>
          </Card>
        )}
      </div>

      {/* Desktop: Table layout */}
      <Card className="hidden sm:block bg-[#13131a] border-transparent">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium text-sm">{lead.name}</TableCell>
                    <TableCell className="text-sm">{lead.phone}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-xs">{lead.leadType}</Badge></TableCell>
                    <TableCell className="text-sm">{lead.property?.name || '-'}</TableCell>
                    <TableCell>
                      <Select value={lead.status} onValueChange={(v) => updateStatus(lead.id, v)}>
                        <SelectTrigger className="h-7 w-28 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="qualified">Qualified</SelectItem>
                          <SelectItem value="converted">Converted</SelectItem>
                          <SelectItem value="lost">Lost</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <a href={`https://wa.me/91${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm" className="text-green-500 hover:text-green-400 hover:bg-green-500/10"><MessageCircle className="w-4 h-4" /></Button>
                        </a>
                        <a href={`tel:${lead.phone}`}>
                          <Button variant="ghost" size="sm"><Phone className="w-4 h-4" /></Button>
                        </a>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {leads.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No leads yet</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Testimonials Management
function TestimonialsManagement() {
  const [testimonials, setTestimonials] = useState<AdminTestimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [editTest, setEditTest] = useState<AdminTestimonial | null>(null)
  const [isNew, setIsNew] = useState(false)

  const fetchTestimonials = useCallback(async () => {
    try {
      const res = await fetch('/api/testimonials')
      const data = await res.json()
      setTestimonials(data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchTestimonials() }, [fetchTestimonials])

  const handleSave = async (data: Record<string, unknown>) => {
    try {
      if (isNew) {
        await fetch('/api/testimonials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, approved: true }) })
        toast.success('Testimonial created')
      } else if (editTest) {
        await fetch('/api/testimonials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, id: editTest.id, approved: true }) })
        toast.success('Testimonial updated')
      }
      setIsOpen(false)
      setEditTest(null)
      fetchTestimonials()
    } catch { toast.error('Failed to save') }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return
    try {
      toast.info('Delete not available via API - use database directly')
    } catch { toast.error('Failed') }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#C9A84C]" /></div>

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg sm:text-2xl font-bold font-[var(--font-playfair)]">Testimonials</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gold text-white text-xs sm:text-sm" onClick={() => { setIsNew(true); setEditTest(null) }}>
              <Plus className="w-4 h-4 mr-1" /> <span className="hidden sm:inline">Add Testimonial</span><span className="sm:hidden">Add</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="mx-4 sm:mx-auto w-[calc(100%-2rem)] sm:w-full">
            <DialogHeader>
              <DialogTitle>{isNew ? 'Add Testimonial' : 'Edit Testimonial'}</DialogTitle>
            </DialogHeader>
            <TestimonialForm testimonial={editTest} onSave={handleSave} onCancel={() => { setIsOpen(false); setEditTest(null) }} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Mobile: Card layout */}
      <div className="sm:hidden space-y-3">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-[#13131a] rounded-xl p-4 border border-transparent hover:border-[#C9A84C]/20 transition-all hover:-translate-y-0.5">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm">{t.clientName}</h3>
                <div className="flex gap-0.5 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`text-xs ${i < t.rating ? 'text-[#C9A84C]' : 'text-gray-600'}`}>&#9733;</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {t.featured ? <Badge className="text-[10px] bg-[#C9A84C]/20 text-[#C9A84C]">Featured</Badge> : null}
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => { setIsNew(false); setEditTest(t); setIsOpen(true) }}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">{t.testimonial}</p>
          </div>
        ))}
        {testimonials.length === 0 && (
          <Card className="bg-[#13131a] border-transparent">
            <CardContent className="py-8 text-center text-muted-foreground text-sm">No testimonials yet</CardContent>
          </Card>
        )}
      </div>

      {/* Desktop: Table layout */}
      <Card className="hidden sm:block bg-[#13131a] border-transparent">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Testimonial</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium text-sm">{t.clientName}</TableCell>
                    <TableCell>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={`text-xs ${i < t.rating ? 'text-[#C9A84C]' : 'text-gray-600'}`}>&#9733;</span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs max-w-xs truncate">{t.testimonial}</TableCell>
                    <TableCell>{t.featured ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-gray-500" />}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => { setIsNew(false); setEditTest(t); setIsOpen(true) }}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {testimonials.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No testimonials yet</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function TestimonialForm({ testimonial, onSave, onCancel }: { testimonial: AdminTestimonial | null; onSave: (data: Record<string, unknown>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    clientName: testimonial?.clientName || '',
    clientLocation: '',
    propertyPurchased: testimonial?.propertyPurchased || '',
    rating: testimonial?.rating?.toString() || '5',
    testimonial: testimonial?.testimonial || '',
    investmentStory: '',
    featured: testimonial?.featured ? 'true' : 'false',
  })

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2"><Label className="text-xs sm:text-sm">Client Name</Label><Input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} /></div>
        <div className="space-y-2"><Label className="text-xs sm:text-sm">Rating</Label>
          <Select value={form.rating} onValueChange={(v) => setForm({ ...form, rating: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {[5, 4, 3, 2, 1].map((r) => <SelectItem key={r} value={r.toString()}>{r} Stars</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2"><Label className="text-xs sm:text-sm">Testimonial</Label><Textarea value={form.testimonial} onChange={(e) => setForm({ ...form, testimonial: e.target.value })} rows={4} /></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2"><Label className="text-xs sm:text-sm">Property Purchased</Label><Input value={form.propertyPurchased} onChange={(e) => setForm({ ...form, propertyPurchased: e.target.value })} /></div>
        <div className="space-y-2"><Label className="text-xs sm:text-sm">Location</Label><Input value={form.clientLocation} onChange={(e) => setForm({ ...form, clientLocation: e.target.value })} /></div>
      </div>
      <div className="space-y-2"><Label className="text-xs sm:text-sm">Investment Story</Label><Textarea value={form.investmentStory} onChange={(e) => setForm({ ...form, investmentStory: e.target.value })} rows={2} /></div>
      <div className="space-y-2"><Label className="text-xs sm:text-sm">Featured</Label>
        <Select value={form.featured} onValueChange={(v) => setForm({ ...form, featured: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Yes</SelectItem>
            <SelectItem value="false">No</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-3 pt-2">
        <Button onClick={() => onSave(form)} className="btn-gold text-white">Save</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  )
}

// Notifications
function NotificationsPage() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications')
      const data = await res.json()
      setNotifications(data.notifications || [])
      setUnreadCount(data.unreadCount || 0)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchNotifications() }, [fetchNotifications])

  const markRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'PUT' })
      fetchNotifications()
    } catch { toast.error('Failed to update') }
  }

  const markAllRead = async () => {
    for (const n of notifications.filter((n) => !n.isRead)) {
      await fetch(`/api/notifications/${n.id}`, { method: 'PUT' })
    }
    fetchNotifications()
    toast.success('All marked as read')
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#C9A84C]" /></div>

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-2xl font-bold font-[var(--font-playfair)]">Notifications</h2>
          {unreadCount > 0 && <Badge className="bg-[#C9A84C] text-white text-[10px]">{unreadCount}</Badge>}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead} className="text-[10px] sm:text-xs h-7">
            <Check className="w-3 h-3 mr-1" /> Mark all read
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <Card className="bg-[#13131a] border-transparent">
            <CardContent className="py-8 text-center text-muted-foreground text-sm">No notifications yet</CardContent>
          </Card>
        ) : (
          notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`bg-[#13131a] rounded-xl p-3 sm:p-4 border transition-all ${
                n.isRead ? 'border-border/50 opacity-60' : 'border-[#C9A84C]/20'
              }`}
              onClick={() => !n.isRead && markRead(n.id)}
            >
              <div className="flex items-start justify-between gap-2 sm:gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {!n.isRead && <span className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse shrink-0" />}
                    <h4 className="font-semibold text-xs sm:text-sm truncate">{n.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-[10px] text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</p>
                    {n.phone && (
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={`https://wa.me/91${n.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center h-7 w-7 rounded-md bg-green-600/20 text-green-500 hover:bg-green-600/30 transition-colors"
                          title="WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`tel:+91${n.phone.replace(/\D/g, '')}`}
                          className="inline-flex items-center justify-center h-7 w-7 rounded-md bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                          title="Call"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                <Badge variant="secondary" className="text-[10px] shrink-0">{n.type}</Badge>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

// Main Admin Dashboard
export default function AdminDashboard() {
  const { currentPage, isAdminAuthenticated, setAdminAuth, navigate } = useAppStore()

  if (!isAdminAuthenticated) {
    return <AdminLogin />
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'admin': return <DashboardOverview />
      case 'admin-projects': return <ProjectsManagement />
      case 'admin-leads': return <LeadsManagement />
      case 'admin-testimonials': return <TestimonialsManagement />
      case 'admin-notifications': return <NotificationsPage />
      default: return <DashboardOverview />
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a12] pt-14 sm:pt-16 overflow-x-hidden">
      <div className="flex">
        {/* Sidebar - Desktop only */}
        <aside className="hidden lg:flex w-64 min-h-[calc(100vh-4rem)] border-r border-[#C9A84C]/10 bg-[#0f0f18] flex-col shrink-0">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C9A84C] to-[#B8941F] flex items-center justify-center">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold gold-text">Admin Panel</p>
                <p className="text-[10px] text-muted-foreground">New Era Reality</p>
              </div>
            </div>
            <Separator className="opacity-30" />
          </div>
          <nav className="flex-1 px-3 space-y-1">
            {SIDEBAR_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => navigate(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  currentPage === item.key
                    ? 'bg-[#C9A84C] text-[#0a0a12] shadow-[0_0_15px_rgba(201,168,76,0.4)]'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className={`w-4 h-4 ${currentPage === item.key ? 'text-[#0a0a12]' : ''}`} />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="p-3 mt-auto border-t border-[#C9A84C]/10">
            <button
              onClick={() => { setAdminAuth(false); navigate('home') }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </aside>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0f0f18]/95 backdrop-blur-md border-t border-[#C9A84C]/10 safe-area-pb">
          <div className="flex items-center justify-around px-1 py-1.5">
            {SIDEBAR_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => navigate(item.key)}
                className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-lg min-w-[52px] transition-all cursor-pointer ${
                  currentPage === item.key
                    ? 'text-[#C9A84C] bg-[#C9A84C]/10'
                    : 'text-gray-500 active:text-gray-300'
                }`}
              >
                <item.icon className="w-[18px] h-[18px]" />
                <span className="text-[9px] font-medium leading-tight">{item.shortLabel}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0 w-full p-3 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <Button variant="ghost" onClick={() => navigate('home')} className="text-muted-foreground text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3">
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> Back to Site
            </Button>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('admin-notifications')}
                className="relative text-muted-foreground h-8 w-8 sm:h-9 sm:w-9 p-0"
              >
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { setAdminAuth(false); navigate('home') }} className="text-red-400 h-8 w-8 sm:h-9 sm:w-9 p-0">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
