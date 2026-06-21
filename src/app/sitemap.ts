import type { MetadataRoute } from 'next'

const SITE_URL = 'https://newerareality.com'

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://new-era-reality-backend.onrender.com/api'

interface Property {
  id: string
  slug?: string
  updatedAt?: string
}

async function getAllProperties(): Promise<Property[]> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000) // 5 second timeout
    const res = await fetch(`${API_BASE}/properties`, {
      signal: controller.signal,
      cache: 'no-store',
    })
    clearTimeout(timeout)
    if (!res.ok) return []
    return res.json()
  } catch {
    return [] // Always return static pages even if backend is down
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await getAllProperties()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/emi-calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/testimonials`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ]

  // Dynamic property pages
  const propertyPages: MetadataRoute.Sitemap = properties.map((p) => ({
    url: `${SITE_URL}/property/${p.slug || p.id}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...propertyPages]
}
