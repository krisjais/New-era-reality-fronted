'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { APP_CONFIG } from '@/lib/config'
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
  UploadCloud, ImageIcon, Sun, Moon, Menu
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'

// Types
interface AdminProperty {
  id: string; name: string; propertyType: string; bhk: string | null; priceLabel: string;
  city: string; location: string; status: string; views: number; likes: number; inquiries: number;
  featured: boolean; propertyId?: string; bedrooms?: number; bathrooms?: number; floorNumber?: string; [key: string]: unknown;
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

const CHART_COLORS = ['#C9A84C', '#2563eb', '#60a5fa', '#1d4ed8', '#C9A84C']

function getAuthToken() {
  if (typeof document === 'undefined') return '';
  return document.cookie.split('; ').find(row => row.startsWith('admin_token='))?.split('=')[1] || '';
}

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`
});

// Dashboard Overview
function DashboardOverview() {
  const { theme } = useAppStore()
  const [stats, setStats] = useState({ properties: 0, leads: 0, views: 0, likes: 0 })
  const [leadsByType, setLeadsByType] = useState<{ name: string; value: number }[]>([])
  const [leadsOverTime, setLeadsOverTime] = useState<{ name: string; count: number }[]>([])
  const [recentLeads, setRecentLeads] = useState<AdminLead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propRes, leadRes] = await Promise.all([fetch(`${APP_CONFIG.API_URL}/properties`, { headers: { 'Authorization': `Bearer ${getAuthToken()}` } }), fetch(`${APP_CONFIG.API_URL}/leads`, { headers: { 'Authorization': `Bearer ${getAuthToken()}` } })])
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
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">Analytics Overview,</h2>
          <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider font-medium">
            {new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit' })} - {new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { day: '2-digit' })} ({new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })})
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="outline" size="sm" className="bg-white dark:bg-[#13131a] border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path></svg>
            Sort By
          </Button>
          <Button variant="outline" size="sm" className="bg-white dark:bg-[#13131a] border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            Filter By
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <motion.div 
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
        initial="hidden" animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {[
          { label: 'Total Projects', value: stats.properties, icon: Building2 },
          { label: 'Total Leads', value: stats.leads, icon: Users },
          { label: 'Property Views', value: stats.views, icon: Eye },
          { label: 'Property Likes', value: stats.likes, icon: Heart },
        ].map((stat) => (
          <motion.div key={stat.label} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
            <Card className="bg-white dark:bg-[#13131a] shadow-sm dark:shadow-none border border-gray-100 dark:border-white/5 hover:border-[#C9A84C]/30 transition-all cursor-pointer group hover:-translate-y-1 hover:shadow-lg hover:shadow-[#C9A84C]/10 rounded-2xl overflow-hidden">
              <CardContent className="p-5 sm:p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-[#1a1a24] flex items-center justify-center group-hover:bg-[#C9A84C] transition-colors duration-300">
                    <stat.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3" /> +12%
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                <p className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
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
        <Card className="bg-white dark:bg-[#13131a] shadow-sm dark:shadow-none border-transparent lg:col-span-1">
          <CardHeader className="pb-2 p-4 sm:p-5 border-b border-gray-100 dark:border-white/5">
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
                      <Cell key={index} fill={['#C9A84C', '#E8D48B', '#D4AF37', '#B8941F', '#A8892E'][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#1a1a24' : '#fff', 
                      border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      color: theme === 'dark' ? '#fff' : '#111827'
                    }} 
                    itemStyle={{ color: theme === 'dark' ? '#fff' : '#111827' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground">No lead data yet</p>
            )}
            {leadsByType.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                {leadsByType.map((l, i) => (
                  <div key={l.name} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#C9A84C', '#E8D48B', '#D4AF37', '#B8941F', '#A8892E'][i % 5] }} />
                    {l.name}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bar Chart - Takes 2 columns */}
        <Card className="bg-white dark:bg-[#13131a] shadow-sm dark:shadow-none border-transparent lg:col-span-2">
          <CardHeader className="pb-2 p-4 sm:p-5 border-b border-gray-100 dark:border-white/5">
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
                  <Tooltip 
                    cursor={{ fill: 'rgba(201,168,76,0.05)' }} 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#1a1a24' : '#fff', 
                      border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      color: theme === 'dark' ? '#fff' : '#111827'
                    }}
                    itemStyle={{ color: theme === 'dark' ? '#fff' : '#111827' }}
                  />
                  <Bar dataKey="count" fill="url(#blueGradient)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <defs>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C9A84C" />
                      <stop offset="100%" stopColor="#E8D48B" />
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
        <Card className="bg-white dark:bg-[#13131a] shadow-sm dark:shadow-none border-transparent">
          <CardHeader className="pb-2 p-4 sm:p-5 border-b border-gray-100 dark:border-white/5 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold">Recent Inquiries</CardTitle>
            <Button variant="ghost" size="sm" className="h-8 text-xs text-[#C9A84C] hover:text-gray-900 dark:text-white hover:bg-[#C9A84C]/20">View All</Button>
          </CardHeader>
          <CardContent className="p-0">
            {recentLeads.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No inquiries yet</p>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-white/5">
                {recentLeads.map((lead, i) => (
                  <motion.div 
                    key={lead.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.05 }}
                    className="flex items-center justify-between p-4 sm:px-5 hover:bg-white/[0.02] transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#1a1a24] border border-gray-200 dark:border-white/10 flex items-center justify-center shrink-0">
                        <span className="text-[#C9A84C] font-semibold text-sm">{lead.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-900 dark:text-white group-hover:text-[#C9A84C] transition-colors">{lead.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-500">{lead.phone}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-700" />
                          <span className="text-xs text-gray-500">{new Date(lead.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="hidden sm:flex flex-col items-end mr-4">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Type</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{lead.leadType}</span>
                      </div>
                      <Badge className={`px-2 py-0.5 rounded-full text-[10px] font-medium border-0 ${
                        lead.status === 'new' ? 'bg-[#C9A84C]/10 text-[#E8D48B]' : 
                        lead.status === 'contacted' ? 'bg-amber-500/10 text-amber-400' : 
                        lead.status === 'converted' ? 'bg-[#C9A84C]/20 text-[#C9A84C] shadow-[0_0_10px_rgba(201,168,76,0.2)]' : 
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </Badge>
                      <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-white/10 hover:text-gray-900 dark:text-white text-gray-500 dark:text-gray-400">
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
      const res = await fetch(`${APP_CONFIG.API_URL}/properties`, { headers: { 'Authorization': `Bearer ${getAuthToken()}` } })
      const data = await res.json()
      setProperties(data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchProperties() }, [fetchProperties])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return
    setProperties(prev => prev.filter(p => p.id !== id))
    try {
      const res = await fetch(`${APP_CONFIG.API_URL}/properties/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${getAuthToken()}` } })
      if (!res.ok) throw new Error('Failed')
      toast.success('Property deleted')
    } catch { 
      toast.error('Failed to delete')
      fetchProperties()
    }
  }

  const handleSave = async (data: Record<string, unknown>) => {
    try {
      if (isNew) {
        const res = await fetch(`${APP_CONFIG.API_URL}/properties`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) })
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.error || errorData.message || 'Failed to create property')
        }
        toast.success('Property created')
      } else if (editProp) {
        const res = await fetch(`${APP_CONFIG.API_URL}/properties/${editProp.id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) })
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.error || errorData.message || 'Failed to update property')
        }
        toast.success('Property updated')
      }
      setIsOpen(false)
      setEditProp(null)
      fetchProperties()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save')
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#C9A84C]" /></div>

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">Projects</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#C9A84C] hover:bg-[#B8941F] text-white shadow-md shadow-[#C9A84C]/20 transition-all text-white text-xs sm:text-sm" onClick={() => { setIsNew(true); setEditProp({ id: '', name: '', propertyType: 'Apartment', bhk: '', priceLabel: '', city: 'Mumbai', location: '', status: 'active', views: 0, likes: 0, inquiries: 0, featured: false }) }}>
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
          <div key={prop.id} className="bg-white dark:bg-[#13131a] shadow-sm dark:shadow-none rounded-xl p-4 border border-transparent hover:border-[#C9A84C]/20 transition-all hover:-translate-y-0.5">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm truncate">{prop.name}</h3>
                  {prop.propertyId && (
                    <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 border-[#C9A84C]/50 text-[#C9A84C]">
                      {prop.propertyId}
                    </Badge>
                  )}
                </div>
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
          <Card className="bg-white dark:bg-[#13131a] shadow-sm dark:shadow-none border-transparent">
            <CardContent className="py-8 text-center text-muted-foreground text-sm">No properties found</CardContent>
          </Card>
        )}
      </div>

      {/* Desktop: Table layout */}
      <Card className="hidden sm:block bg-white dark:bg-[#13131a] shadow-sm dark:shadow-none border-transparent">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property ID</TableHead>
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
                    <TableCell className="text-xs text-muted-foreground">{prop.propertyId || '-'}</TableCell>
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
    propertyId: property?.propertyId || '',
    propertyType: property?.propertyType || 'Apartment',
    bhk: property?.bhk || '',
    bedrooms: String(property?.bedrooms || ''),
    bathrooms: String(property?.bathrooms || ''),
    floorNumber: String(property?.floorNumber || ''),
    priceLabel: property?.priceLabel || '',
    city: property?.city || 'Mumbai',
    location: property?.location || '',
    status: property?.status || 'active',
    description: (property?.description as string) || '',
    price: String(property?.price || '0'),
    featured: property?.featured ? 'true' : 'false',
    premium: property?.premium ? 'true' : 'false',
    possessionStatus: (property?.possessionStatus as string) || 'Ready to Move',
    reraRegistered: property?.reraRegistered ? 'true' : 'false',
    areaSqft: String(property?.areaSqft || ''),
    pricePerSqft: String(property?.pricePerSqft || ''),
    floorCount: String(property?.floorCount || ''),
    transactionType: (property?.transactionType as string) || 'Sale',
  });

  const getArray = (val: unknown): string[] => {
    if (!val) return [];
    if (typeof val === 'string') {
      try { const arr = JSON.parse(val); return Array.isArray(arr) ? arr : [val]; } catch { return [val]; }
    }
    return Array.isArray(val) ? val.map(String) : [String(val)];
  };

  const [images, setImages] = useState<string[]>(getArray(property?.images));
  const [floorPlans, setFloorPlans] = useState<string[]>(getArray(property?.floorPlans));
  const [brochures, setBrochures] = useState<string[]>(getArray(property?.brochures));
  const [thumbnailUrl, setThumbnailUrl] = useState((property as any)?.thumbnailUrl || '');
  
  const [amenities, setAmenities] = useState<string[]>(getArray(property?.amenities));
  const [newAmenity, setNewAmenity] = useState('');
  
  const [nearbyLandmarks, setNearbyLandmarks] = useState<string[]>(getArray(property?.nearbyLandmarks));
  const [newLandmark, setNewLandmark] = useState('');
  
  const [uploading, setUploading] = useState(false);
  const [uploadingFloorPlans, setUploadingFloorPlans] = useState(false);
  const [uploadingBrochures, setUploadingBrochures] = useState(false);

  const PRESET_AMENITIES = ["Swimming Pool", "Gymnasium", "Clubhouse", "24/7 Security", "Power Backup", "Parking", "Kids Play Area", "Jogging Track"];
  const PRESET_LANDMARKS = ["Hospital", "School", "Bank", "Railway Station", "ATM", "Bus Stop", "Airport", "Shopping Mall", "Metro Station"];

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>, 
    folder: string, 
    setUrls: React.Dispatch<React.SetStateAction<string[]>>, 
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setLoading(true);
    const formData = new FormData();
    Array.from(e.target.files).forEach(file => formData.append('files', file));
    formData.append('folder', folder);
    
    try {
      const res = await fetch(`${APP_CONFIG.API_URL}/upload`, { method: 'POST', headers: { 'Authorization': `Bearer ${getAuthToken()}` }, body: formData });
      if (res.ok) {
        const data = await res.json();
        setUrls(prev => [...prev, ...data.urls]);
      } else {
        const errorData = await res.json().catch(() => ({}));
        toast.error(errorData.error || errorData.message || 'Upload failed');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setLoading(false);
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

  const toggleLandmark = (landmark: string) => {
    if (nearbyLandmarks.includes(landmark)) setNearbyLandmarks(nearbyLandmarks.filter(l => l !== landmark));
    else setNearbyLandmarks([...nearbyLandmarks, landmark]);
  };

  const handleAddCustomLandmark = () => {
    if (newLandmark.trim() && !nearbyLandmarks.includes(newLandmark.trim())) {
      setNearbyLandmarks([...nearbyLandmarks, newLandmark.trim()]);
    }
    setNewLandmark('');
  };

  const handleFormSave = () => {
    const payload: Record<string, unknown> = { ...form };
    payload.featured = form.featured === 'true';
    payload.premium = form.premium === 'true';
    payload.reraRegistered = form.reraRegistered === 'true';
    
    let parsedPrice = 0;
    const numMatch = form.priceLabel.match(/[\d.]+/);
    if (numMatch) {
      const val = parseFloat(numMatch[0]);
      if (form.priceLabel.toLowerCase().includes('cr')) parsedPrice = val * 10000000;
      else if (form.priceLabel.toLowerCase().includes('l') || form.priceLabel.toLowerCase().includes('lac')) parsedPrice = val * 100000;
      else if (form.priceLabel.toLowerCase().includes('k')) parsedPrice = val * 1000;
      else parsedPrice = val;
    }
    payload.price = parsedPrice;
    
    payload.areaSqft = form.areaSqft ? parseFloat(form.areaSqft) : null;
    payload.pricePerSqft = form.pricePerSqft ? parseFloat(form.pricePerSqft) : null;
    payload.floorCount = form.floorCount ? parseInt(form.floorCount, 10) : null;
    payload.bedrooms = form.bedrooms ? parseInt(form.bedrooms, 10) : null;
    payload.bathrooms = form.bathrooms ? parseInt(form.bathrooms, 10) : null;
    payload.floorNumber = form.floorNumber || null;
    
    payload.images = images;
    payload.floorPlans = floorPlans;
    payload.brochures = brochures;
    payload.thumbnailUrl = thumbnailUrl || (images.length > 0 ? images[0] : '');
    payload.amenities = amenities;
    payload.nearbyLandmarks = nearbyLandmarks;
    
    if (!property?.slug) payload.slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    payload.transactionType = form.transactionType;
    onSave(payload);
  };

  const getPricePreview = (priceLabelStr: string) => {
    if (!priceLabelStr) return null;

    const parts = priceLabelStr.split(/[-–—]|to/i).map(p => p.trim()).filter(Boolean);
    if (parts.length === 0) return null;

    const parsedParts = parts.map(part => {
      const numMatch = part.match(/[\d.]+/);
      if (!numMatch) return null;
      const val = parseFloat(numMatch[0]);
      if (isNaN(val)) return null;

      const lowerPart = part.toLowerCase();
      const lowerFull = priceLabelStr.toLowerCase();
      
      let parsedPrice = val;
      let unit = '';
      
      if (lowerPart.includes('cr') || lowerPart.includes('crore')) {
        parsedPrice = val * 10000000;
        unit = 'Cr';
      } else if (lowerPart.includes('l') || lowerPart.includes('lac') || lowerPart.includes('lakh')) {
        parsedPrice = val * 100000;
        unit = 'L';
      } else if (lowerPart.includes('k')) {
        parsedPrice = val * 1000;
        unit = 'K';
      } else if (lowerFull.includes('cr') || lowerFull.includes('crore')) {
        parsedPrice = val * 10000000;
        unit = 'Cr';
      } else if (lowerFull.includes('l') || lowerFull.includes('lac') || lowerFull.includes('lakh')) {
        parsedPrice = val * 100000;
        unit = 'L';
      } else if (lowerFull.includes('k')) {
        parsedPrice = val * 1000;
        unit = 'K';
      }

      return { val, parsedPrice, unit };
    }).filter(Boolean) as { val: number; parsedPrice: number; unit: string }[];

    if (parsedParts.length === 0) return null;

    const formatWord = (price: number) => {
      if (price >= 10000000) {
        return `${(price / 10000000).toFixed(2).replace(/\.00$/, '')} Crore`;
      } else if (price >= 100000) {
        return `${(price / 100000).toFixed(2).replace(/\.00$/, '')} Lakh`;
      } else if (price >= 1000) {
        return `${(price / 1000).toFixed(2).replace(/\.00$/, '')} Thousand`;
      } else {
        return `${price} Rupees`;
      }
    };

    const formatNumber = (price: number) => {
      return price.toLocaleString('en-IN');
    };

    const hasAnyUnit = /cr|crore|l\b|lac|lakh|k\b/i.test(priceLabelStr);
    if (!hasAnyUnit) {
      const firstVal = parsedParts[0].val;
      if (firstVal < 1000) {
        return (
          <div className="text-xs text-amber-500 mt-1 space-y-1">
            <p className="font-semibold">Format hint:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>For {firstVal} Lakhs: type <code className="bg-amber-500/10 px-1 py-0.5 rounded font-mono text-[10px]">{firstVal} L</code> or <code className="bg-amber-500/10 px-1 py-0.5 rounded font-mono text-[10px]">{firstVal} Lakh</code></li>
              <li>For {firstVal} Crores: type <code className="bg-amber-500/10 px-1 py-0.5 rounded font-mono text-[10px]">{firstVal} Cr</code> or <code className="bg-amber-500/10 px-1 py-0.5 rounded font-mono text-[10px]">{firstVal} Crore</code></li>
            </ul>
          </div>
        );
      }
    }

    if (parsedParts.length === 1) {
      const { parsedPrice } = parsedParts[0];
      return (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5 bg-gray-50 dark:bg-[#1a1a24]/30 px-2 py-1 rounded border border-gray-100 dark:border-white/5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C9A84C]"></span>
          <span>Detected: <strong className="text-[#C9A84C] font-semibold">{formatWord(parsedPrice)}</strong> {parsedPrice >= 1000 ? `(₹${formatNumber(parsedPrice)})` : ''}</span>
        </div>
      );
    } else {
      const wordRange = parsedParts.map(p => formatWord(p.parsedPrice)).join(' - ');
      const numRange = parsedParts.map(p => `₹${formatNumber(p.parsedPrice)}`).join(' - ');
      return (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-start gap-1.5 bg-gray-50 dark:bg-[#1a1a24]/30 px-2 py-1 rounded border border-gray-100 dark:border-white/5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C9A84C] mt-1.5 shrink-0"></span>
          <div>
            <div>Detected Range: <strong className="text-[#C9A84C] font-semibold">{wordRange}</strong></div>
            <div className="text-[10px] text-muted-foreground">({numRange})</div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="space-y-2"><Label className="text-xs sm:text-sm">Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div className="space-y-2"><Label className="text-xs sm:text-sm">Property ID</Label><Input value={form.propertyId} onChange={(e) => setForm({ ...form, propertyId: e.target.value })} placeholder="e.g. PROP-001" /></div>
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
        <div className="space-y-2">
          <Label className="text-xs sm:text-sm">Price Label</Label>
          <Input value={form.priceLabel} onChange={(e) => setForm({ ...form, priceLabel: e.target.value })} placeholder="₹1.5 Cr" />
          {getPricePreview(form.priceLabel)}
        </div>
        <div className="space-y-2"><Label className="text-xs sm:text-sm">BHK</Label><Input value={form.bhk} onChange={(e) => setForm({ ...form, bhk: e.target.value })} placeholder="2 BHK" /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="space-y-2"><Label className="text-xs sm:text-sm">Area (Sq.Ft)</Label><Input type="number" value={form.areaSqft} onChange={(e) => setForm({ ...form, areaSqft: e.target.value })} placeholder="1200" /></div>
        <div className="space-y-2"><Label className="text-xs sm:text-sm">Price per Sq.Ft</Label><Input type="number" value={form.pricePerSqft} onChange={(e) => setForm({ ...form, pricePerSqft: e.target.value })} placeholder="15000" /></div>
        <div className="space-y-2"><Label className="text-xs sm:text-sm">Total Floors</Label><Input type="number" value={form.floorCount} onChange={(e) => setForm({ ...form, floorCount: e.target.value })} placeholder="20" /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="space-y-2"><Label className="text-xs sm:text-sm">Bedrooms</Label><Input type="number" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} placeholder="3" /></div>
        <div className="space-y-2"><Label className="text-xs sm:text-sm">Bathrooms</Label><Input type="number" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} placeholder="2" /></div>
        <div className="space-y-2"><Label className="text-xs sm:text-sm">Floor Number</Label><Input value={form.floorNumber} onChange={(e) => setForm({ ...form, floorNumber: e.target.value })} placeholder="e.g. Ground, 5th" /></div>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2"><Label className="text-xs sm:text-sm">Transaction Type</Label>
          <Select value={form.transactionType} onValueChange={(v) => setForm({ ...form, transactionType: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Sale">For Sale</SelectItem>
              <SelectItem value="Rent">For Rent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label className="text-xs sm:text-sm">Premium</Label>
          <Select value={form.premium} onValueChange={(v) => setForm({ ...form, premium: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
            <div key={idx} className="relative group rounded-md overflow-hidden bg-gray-100 dark:bg-[#1a1a24] aspect-video border border-[#C9A84C]/20">
              <img src={url} alt={`Property ${idx}`} className="w-full h-full object-cover" />
              <button type="button" onClick={() => setImages(images.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-red-500/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <X className="w-3 h-3 text-white" />
              </button>
              <button type="button" onClick={() => setThumbnailUrl(url)} className={`absolute bottom-1 left-1 px-2 py-0.5 rounded text-[10px] font-medium transition-opacity z-10 ${thumbnailUrl === url ? 'bg-[#C9A84C] text-gray-900 opacity-100' : 'bg-black/50 text-white opacity-0 group-hover:opacity-100'}`}>
                {thumbnailUrl === url ? 'Thumbnail' : 'Set Thumbnail'}
              </button>
            </div>
          ))}
          <label className="relative flex flex-col items-center justify-center rounded-md border border-dashed border-[#C9A84C]/40 bg-gray-100 dark:bg-[#1a1a24]/50 aspect-video hover:bg-gray-100 dark:bg-[#1a1a24] transition-colors cursor-pointer">
            {uploading ? <Loader2 className="w-6 h-6 animate-spin text-[#C9A84C]" /> : <UploadCloud className="w-6 h-6 text-[#C9A84C]" />}
            <span className="text-xs text-muted-foreground mt-2">{uploading ? 'Uploading...' : 'Add Photo'}</span>
            <input type="file" multiple accept="image/*" onChange={(e) => handleFileUpload(e, 'new-era-reality/properties', setImages, setUploading)} className="hidden" disabled={uploading} />
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs sm:text-sm">Floor Plans</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {floorPlans.map((url, idx) => (
            <div key={idx} className="relative group rounded-md overflow-hidden bg-gray-100 dark:bg-[#1a1a24] aspect-video border border-[#C9A84C]/20">
              <img src={url} alt={`Floor Plan ${idx}`} className="w-full h-full object-contain bg-white" />
              <button type="button" onClick={() => setFloorPlans(floorPlans.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-red-500/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
          <label className="relative flex flex-col items-center justify-center rounded-md border border-dashed border-[#C9A84C]/40 bg-gray-100 dark:bg-[#1a1a24]/50 aspect-video hover:bg-gray-100 dark:bg-[#1a1a24] transition-colors cursor-pointer">
            {uploadingFloorPlans ? <Loader2 className="w-6 h-6 animate-spin text-[#C9A84C]" /> : <UploadCloud className="w-6 h-6 text-[#C9A84C]" />}
            <span className="text-xs text-muted-foreground mt-2">{uploadingFloorPlans ? 'Uploading...' : 'Add Floor Plan'}</span>
            <input type="file" multiple accept="image/*" onChange={(e) => handleFileUpload(e, 'new-era-reality/floor-plans', setFloorPlans, setUploadingFloorPlans)} className="hidden" disabled={uploadingFloorPlans} />
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs sm:text-sm">Brochures (PDF or Image)</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {brochures.map((url, idx) => (
            <div key={idx} className="relative group rounded-md flex items-center justify-center bg-gray-100 dark:bg-[#1a1a24] aspect-video border border-[#C9A84C]/20 p-2">
              <span className="text-xs truncate break-all max-w-[80%] text-center text-[#C9A84C]">Brochure {idx + 1}</span>
              <button type="button" onClick={() => setBrochures(brochures.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-red-500/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
          <label className="relative flex flex-col items-center justify-center rounded-md border border-dashed border-[#C9A84C]/40 bg-gray-100 dark:bg-[#1a1a24]/50 aspect-video hover:bg-gray-100 dark:bg-[#1a1a24] transition-colors cursor-pointer">
            {uploadingBrochures ? <Loader2 className="w-6 h-6 animate-spin text-[#C9A84C]" /> : <UploadCloud className="w-6 h-6 text-[#C9A84C]" />}
            <span className="text-xs text-muted-foreground mt-2">{uploadingBrochures ? 'Uploading...' : 'Add Brochure'}</span>
            <input type="file" multiple accept="*/*" onChange={(e) => handleFileUpload(e, 'new-era-reality/brochures', setBrochures, setUploadingBrochures)} className="hidden" disabled={uploadingBrochures} />
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
                className={`cursor-pointer ${isSelected ? 'bg-[#C9A84C] text-gray-900 dark:text-white hover:bg-[#2563eb]' : 'hover:border-[#C9A84C]'}`}
                onClick={() => toggleAmenity(amenity)}
              >
                {amenity}
              </Badge>
            );
          })}
          {amenities.filter(a => !PRESET_AMENITIES.includes(a)).map(amenity => (
            <Badge key={amenity} className="cursor-pointer bg-[#C9A84C] text-gray-900 dark:text-white hover:bg-[#2563eb]" onClick={() => toggleAmenity(amenity)}>
              {amenity} <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input value={newAmenity} onChange={e => setNewAmenity(e.target.value)} placeholder="Add custom amenity..." className="max-w-xs" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddCustomAmenity())} />
          <Button type="button" variant="outline" onClick={handleAddCustomAmenity}>Add</Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs sm:text-sm">Nearby Landmarks</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {PRESET_LANDMARKS.map((landmark) => {
            const isSelected = nearbyLandmarks.includes(landmark);
            return (
              <Badge 
                key={landmark} 
                variant={isSelected ? "default" : "outline"} 
                className={`cursor-pointer ${isSelected ? 'bg-[#C9A84C] text-gray-900 dark:text-white hover:bg-[#2563eb]' : 'hover:border-[#C9A84C]'}`}
                onClick={() => toggleLandmark(landmark)}
              >
                {landmark}
              </Badge>
            );
          })}
          {nearbyLandmarks.filter(a => !PRESET_LANDMARKS.includes(a)).map(landmark => (
            <Badge key={landmark} className="cursor-pointer bg-[#C9A84C] text-gray-900 dark:text-white hover:bg-[#2563eb]" onClick={() => toggleLandmark(landmark)}>
              {landmark} <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input value={newLandmark} onChange={e => setNewLandmark(e.target.value)} placeholder="Add custom landmark..." className="max-w-xs" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddCustomLandmark())} />
          <Button type="button" variant="outline" onClick={handleAddCustomLandmark}>Add</Button>
        </div>
      </div>

      <div className="space-y-2"><Label className="text-xs sm:text-sm">Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
      <div className="flex gap-3 pt-2">
        <Button onClick={handleFormSave} className="bg-[#C9A84C] hover:bg-[#B8941F] text-white shadow-md shadow-[#C9A84C]/20 transition-all text-gray-900 dark:text-white">Save</Button>
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
      const res = await fetch(`${APP_CONFIG.API_URL}/leads`, { headers: { 'Authorization': `Bearer ${getAuthToken()}` } })
      const data = await res.json()
      setLeads(data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  const updateStatus = async (id: string, status: string) => {
    setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, status } : lead))
    try {
      const res = await fetch(`${APP_CONFIG.API_URL}/leads/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify({ status }) })
      if (!res.ok) throw new Error('Failed')
      toast.success('Lead status updated')
    } catch { 
      toast.error('Failed to update')
      fetchLeads()
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#C9A84C]" /></div>

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">Leads Management</h2>

      {/* Mobile: Card layout */}
      <div className="sm:hidden space-y-3">
        {leads.map((lead) => (
          <div key={lead.id} className="bg-white dark:bg-[#13131a] shadow-sm dark:shadow-none rounded-xl p-4 border border-transparent hover:border-[#C9A84C]/20 transition-all hover:-translate-y-0.5">
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
          <Card className="bg-white dark:bg-[#13131a] shadow-sm dark:shadow-none border-transparent">
            <CardContent className="py-8 text-center text-muted-foreground text-sm">No leads yet</CardContent>
          </Card>
        )}
      </div>

      {/* Desktop: Table layout */}
      <Card className="hidden sm:block bg-white dark:bg-[#13131a] shadow-sm dark:shadow-none border-transparent">
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
      const res = await fetch(`${APP_CONFIG.API_URL}/testimonials`, { headers: { 'Authorization': `Bearer ${getAuthToken()}` } })
      const data = await res.json()
      setTestimonials(data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchTestimonials() }, [fetchTestimonials])

  const handleSave = async (data: Record<string, unknown>) => {
    try {
      if (isNew) {
        await fetch(`${APP_CONFIG.API_URL}/testimonials`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ ...data, approved: true }) })
        toast.success('Testimonial created')
      } else if (editTest) {
        await fetch(`${APP_CONFIG.API_URL}/testimonials`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ ...data, id: editTest.id, approved: true }) })
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
        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">Testimonials</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#C9A84C] hover:bg-[#B8941F] text-white shadow-md shadow-[#C9A84C]/20 transition-all text-white text-xs sm:text-sm" onClick={() => { setIsNew(true); setEditTest(null) }}>
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
          <div key={t.id} className="bg-white dark:bg-[#13131a] shadow-sm dark:shadow-none rounded-xl p-4 border border-transparent hover:border-[#C9A84C]/20 transition-all hover:-translate-y-0.5">
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
          <Card className="bg-white dark:bg-[#13131a] shadow-sm dark:shadow-none border-transparent">
            <CardContent className="py-8 text-center text-muted-foreground text-sm">No testimonials yet</CardContent>
          </Card>
        )}
      </div>

      {/* Desktop: Table layout */}
      <Card className="hidden sm:block bg-white dark:bg-[#13131a] shadow-sm dark:shadow-none border-transparent">
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
        <Button onClick={() => onSave(form)} className="bg-[#C9A84C] hover:bg-[#B8941F] text-white shadow-md shadow-[#C9A84C]/20 transition-all text-gray-900 dark:text-white">Save</Button>
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
      const res = await fetch(`${APP_CONFIG.API_URL}/notifications`, { headers: { 'Authorization': `Bearer ${getAuthToken()}` } })
      const data = await res.json()
      setNotifications(data.notifications || [])
      setUnreadCount(data.unreadCount || 0)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchNotifications() }, [fetchNotifications])

  const markRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    setUnreadCount(prev => Math.max(0, prev - 1))
    try {
      const res = await fetch(`${APP_CONFIG.API_URL}/notifications/${id}`, { method: 'PUT', headers: { 'Authorization': `Bearer ${getAuthToken()}` } })
      if (!res.ok) throw new Error('Failed')
    } catch { 
      toast.error('Failed to update')
      fetchNotifications() 
    }
  }

  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    setUnreadCount(0)
    try {
      for (const n of notifications.filter((n) => !n.isRead)) {
        await fetch(`${APP_CONFIG.API_URL}/notifications/${n.id}`, { method: 'PUT', headers: { 'Authorization': `Bearer ${getAuthToken()}` } })
      }
      toast.success('All marked as read')
    } catch {
      toast.error('Failed to update some notifications')
      fetchNotifications()
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#C9A84C]" /></div>

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">Notifications</h2>
          {unreadCount > 0 && <Badge className="bg-[#C9A84C] text-gray-900 dark:text-white text-[10px]">{unreadCount}</Badge>}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead} className="text-[10px] sm:text-xs h-7">
            <Check className="w-3 h-3 mr-1" /> Mark all read
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <Card className="bg-white dark:bg-[#13131a] shadow-sm dark:shadow-none border-transparent">
            <CardContent className="py-8 text-center text-muted-foreground text-sm">No notifications yet</CardContent>
          </Card>
        ) : (
          notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`bg-white dark:bg-[#13131a] shadow-sm dark:shadow-none rounded-xl p-3 sm:p-4 border transition-all ${
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
                          className="inline-flex items-center justify-center h-7 w-7 rounded-md bg-[#C9A84C]/20 text-[#E8D48B] hover:bg-[#C9A84C]/30 transition-colors"
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
  const { currentPage, setAdminAuth, navigate, theme, toggleTheme } = useAppStore()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!currentPage.startsWith('admin')) {
      navigate('admin')
    }
  }, [currentPage, navigate])

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
    <div className="h-screen bg-gray-50 dark:bg-[#0a0a12] overflow-hidden">
      <div className="flex h-full">
        {/* Sidebar - Desktop only */}
        <aside className="hidden lg:flex w-64 h-full border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f0f18] flex-col shrink-0">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => router.push('/')}>
              <img src="/logo.jpg" alt="New Era Reality Logo" className="w-10 h-10 object-contain rounded-lg shadow-sm" />
              <div>
                <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Admin Panel</h1>
                <p className="text-[10px] text-gray-500">New Era Reality</p>
              </div>
            </div>
            
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-4 tracking-wider uppercase">Menu</p>
          </div>
          <nav className="flex-1 px-4 space-y-1.5">
            {SIDEBAR_ITEMS.map((item) => {
              const isActive = currentPage === item.key
              return (
                <button
                  key={item.key}
                  onClick={() => navigate(item.key)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#C9A84C] text-white shadow-md shadow-[#C9A84C]/20'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                  {item.label}
                </button>
              )
            })}
          </nav>
          <div className="p-3 mt-auto border-t border-[#C9A84C]/10">
            <button
              onClick={() => { document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'; window.location.href = '/' }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#0f0f18] border-r border-gray-200 dark:border-gray-800 flex flex-col shadow-xl"
              >
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setIsMobileMenuOpen(false); router.push('/'); }}>
                    <img src="/logo.jpg" alt="New Era Reality Logo" className="w-8 h-8 object-contain rounded-lg shadow-sm" />
                    <div>
                      <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">Admin</h1>
                      <p className="text-[9px] text-gray-500">New Era Reality</p>
                    </div>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
                  {SIDEBAR_ITEMS.map((item) => {
                    const isActive = currentPage === item.key
                    return (
                      <button
                        key={item.key}
                        onClick={() => { navigate(item.key); setIsMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-[#C9A84C] text-white shadow-md shadow-[#C9A84C]/20'
                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                        {item.label}
                      </button>
                    )
                  })}
                </nav>
                <div className="p-3 mt-auto border-t border-[#C9A84C]/10">
                  <button
                    onClick={() => { document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'; window.location.href = '/' }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 h-screen overflow-y-auto min-w-0 p-4 sm:p-6 lg:p-8 pb-8 bg-gray-50 dark:bg-[#0a0a12]">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
            {/* Mobile Header Elements */}
            <div className="flex lg:hidden items-center gap-3">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-md object-contain" />
            </div>



            <div className="flex items-center gap-3 sm:gap-4 ml-auto">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-white dark:bg-[#13131a] transition-all"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <button
                onClick={() => navigate('admin-notifications')}
                className="relative w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-white dark:bg-[#13131a] transition-all"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white dark:border-[#13131a]"></span>
              </button>
              
              <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-1"></div>

              {/* Profile */}
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="w-9 h-9 rounded-full bg-[#C9A84C] flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                  A
                </div>
                <div className="hidden sm:block text-sm">
                  <p className="font-semibold text-gray-900 dark:text-white group-hover:text-[#C9A84C] transition-colors">Admin Account</p>
                  <p className="text-xs text-gray-500">New Era Reality</p>
                </div>
              </div>
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
