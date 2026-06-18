'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { APP_CONFIG } from '@/lib/config'

export default function AdminLoginPage() {
  const router = useRouter()
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
      const res = await fetch(`${APP_CONFIG.API_URL}/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      
      if (!res.ok) {
        setError('Invalid credentials')
        setLoading(false)
        return
      }

      const data = await res.json()
      
      if (data.token) {
        document.cookie = `admin_token=${data.token}; path=/; max-age=86400; SameSite=Strict`
        toast.success('Welcome back, Admin!')
        router.push('/admin/dashboard')
      } else {
        setError('Invalid server response')
        setLoading(false)
      }
    } catch {
      setError('Login failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a12] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#13131a] shadow-sm dark:shadow-none rounded-2xl p-6 sm:p-8 w-full max-w-md border border-[#C9A84C]/10"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-xl overflow-hidden mx-auto mb-3 shadow-lg border border-[#C9A84C]/20">
            <img src="/logo.jpg" alt="New Era Reality Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-[#C9A84C] dark:text-[#E8D48B]">Admin Login</h1>
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
          <Button type="submit" disabled={loading} className="w-full bg-[#C9A84C] hover:bg-[#B8941F] text-white shadow-md shadow-[#C9A84C]/20 transition-all text-gray-900 dark:text-white font-semibold py-3">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </motion.div>
    </div>
  )
}
