import { create } from 'zustand'
import type { PropertyData } from '@/lib/data'

export type Page = 'home' | 'projects' | 'property' | 'about' | 'testimonials' | 'contact' | 'admin' | 'admin-projects' | 'admin-leads' | 'admin-testimonials' | 'admin-notifications' | 'admin-login'

interface AppState {
  currentPage: Page
  selectedPropertyId: string | null
  isAdminAuthenticated: boolean
  theme: 'light' | 'dark'
  recentlyViewed: string[]
  likedProperties: string[]
  compareList: string[]
  properties: PropertyData[]
  propertiesLoaded: boolean
  navigate: (page: Page, propertyId?: string | null) => void
  setAdminAuth: (auth: boolean) => void
  toggleTheme: () => void
  addToRecentlyViewed: (id: string) => void
  toggleLike: (id: string) => void
  toggleCompare: (id: string) => void
  clearCompare: () => void
  fetchProperties: () => Promise<void>
}

export const useAppStore = create<AppState>((set) => ({
  currentPage: 'home',
  selectedPropertyId: null,
  isAdminAuthenticated: false,
  theme: 'dark',
  recentlyViewed: [],
  likedProperties: [],
  compareList: [],
  properties: [],
  propertiesLoaded: false,
  navigate: (page, propertyId = null) => {
    set({ currentPage: page, selectedPropertyId: propertyId })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  },
  setAdminAuth: (auth) => set({ isAdminAuthenticated: auth }),
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light'
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', newTheme === 'dark')
    }
    return { theme: newTheme }
  }),
  addToRecentlyViewed: (id) => set((state) => ({
    recentlyViewed: [id, ...state.recentlyViewed.filter(r => r !== id)].slice(0, 10)
  })),
  toggleLike: (id) => set((state) => {
    const isLiked = state.likedProperties.includes(id)
    const action = isLiked ? 'unlike' : 'like'
    
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://new-era-reality-backend.onrender.com/api'}/properties/${id}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action })
    }).catch(err => console.error('Failed to update like:', err))

    const updatedProperties = state.properties.map(p => {
      if (p.id === id) {
        return { ...p, likes: Math.max(0, (p.likes || 0) + (action === 'like' ? 1 : -1)) }
      }
      return p
    })

    return {
      likedProperties: isLiked
        ? state.likedProperties.filter(p => p !== id)
        : [...state.likedProperties, id],
      properties: updatedProperties
    }
  }),
  toggleCompare: (id) => set((state) => ({
    compareList: state.compareList.includes(id)
      ? state.compareList.filter(p => p !== id)
      : state.compareList.length < 3 ? [...state.compareList, id] : state.compareList
  })),
  clearCompare: () => set({ compareList: [] }),
  fetchProperties: async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://new-era-reality-backend.onrender.com/api'}/properties`)
      if (res.ok) {
        const data = await res.json()
        set({ properties: data, propertiesLoaded: true })
      }
    } catch (err) {
      console.error('Failed to fetch properties:', err)
    }
  },
}))
