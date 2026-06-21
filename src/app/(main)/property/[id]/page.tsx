import type { Metadata } from 'next'
import PropertyDetailPage from '@/components/sections/PropertyDetailPage'
import { SITE, buildPropertyJsonLd } from '@/lib/seo'
import type { PropertyData } from '@/lib/data'

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://new-era-reality-backend.onrender.com/api'
    : 'http://localhost:5001/api')

async function fetchProperty(id: string): Promise<PropertyData | null> {
  try {
    const res = await fetch(`${API_BASE}/properties/${id}`, {
      next: { revalidate: 3600 }, // Re-fetch at most once per hour
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Dynamic Open Graph metadata per property
// ---------------------------------------------------------------------------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const property = await fetchProperty(id)

  if (!property) {
    return {
      title: 'Property Not Found',
      description: 'This property listing is no longer available.',
      robots: { index: false, follow: false },
    }
  }

  const slug = property.slug || id
  const url = `${SITE.url}/property/${slug}`

  const title = property.bhk
    ? `${property.bhk} ${property.propertyType} in ${property.location} | New Era Reality`
    : `${property.name} | New Era Reality`

  const description =
    property.description?.slice(0, 160) ||
    `Explore this premium ${property.bhk || ''} ${property.propertyType} in ${property.location}, ${property.city}. Price: ${property.priceLabel}. Schedule a site visit today.`

  const ogImage = property.images?.[0] || `${SITE.url}/logo.jpg`

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      type: 'website',
      locale: 'en_IN',
      images: [{ url: ogImage, width: 1200, height: 630, alt: property.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default async function Property({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const property = await fetchProperty(id)

  const jsonLd = property ? buildPropertyJsonLd(property) : null

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <PropertyDetailPage propertyId={id} />
    </>
  )
}
