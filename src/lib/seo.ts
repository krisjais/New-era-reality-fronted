import type { Metadata } from 'next'
import type { PropertyData } from './data'

export const SITE = {
  name: 'New Era Reality',
  url: 'https://newerareality.com',
  logo: 'https://newerareality.com/logo.jpg',
  phone: ['+91-70217 31962', '+91-90762 59009'],
  email: 'jaiswarshivlal0@gmail.com',
  address: 'Mumbai, Maharashtra, India',
  areasServed: ['Mumbai', 'Navi Mumbai', 'Thane', 'Kurla', 'Chembur', 'Panvel', 'Matunga', 'Ghatkopar', 'Atgaon'],
  social: {
    whatsapp: 'https://wa.me/917021731962',
  },
}

// ---------------------------------------------------------------------------
// Canonical helper
// ---------------------------------------------------------------------------
export function canonical(path: string): string {
  return `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`
}

// ---------------------------------------------------------------------------
// Build page-level Metadata
// ---------------------------------------------------------------------------
export function buildMetadata({
  title,
  description,
  path = '/',
  ogImage = `${SITE.url}/og-default.jpg`,
  noIndex = false,
  keywords = [],
}: {
  title: string
  description: string
  path?: string
  ogImage?: string
  noIndex?: boolean
  keywords?: string[]
}): Metadata {
  const url = canonical(path)
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      type: 'website',
      locale: 'en_IN',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
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
// Organization JSON-LD (used globally in root layout)
// ---------------------------------------------------------------------------
export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'RealEstateAgent',
        '@id': `${SITE.url}/#organization`,
        name: SITE.name,
        url: SITE.url,
        logo: {
          '@type': 'ImageObject',
          url: SITE.logo,
          width: 200,
          height: 200,
        },
        image: SITE.logo,
        description:
          'New Era Reality is a RERA-registered real estate consultant specialising in premium apartments, villas, plots and commercial properties across Mumbai, Navi Mumbai and Thane.',
        telephone: SITE.phone,
        email: SITE.email,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Mumbai',
          addressRegion: 'Maharashtra',
          addressCountry: 'IN',
        },
        areaServed: SITE.areasServed.map((area) => ({
          '@type': 'City',
          name: area,
        })),
        sameAs: [SITE.social.whatsapp],
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '09:00',
          closes: '19:00',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
        publisher: { '@id': `${SITE.url}/#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${SITE.url}/projects?q={search_term_string}` },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  }
}

// ---------------------------------------------------------------------------
// Property page JSON-LD
// ---------------------------------------------------------------------------
export function buildPropertyJsonLd(property: PropertyData) {
  const url = canonical(`/property/${property.slug || property.id}`)
  const image = property.images?.[0] || SITE.logo

  return {
    '@context': 'https://schema.org',
    '@type': 'Residence',
    '@id': `${url}#property`,
    name: property.name,
    description: property.description || `${property.bhk || ''} ${property.propertyType} in ${property.location}, ${property.city}`.trim(),
    url,
    image,
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.address || property.location,
      addressLocality: property.city,
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      name: `${property.location}, ${property.city}`,
    },
    numberOfRooms: property.bhkNumber ?? undefined,
    floorSize: property.areaSqft
      ? { '@type': 'QuantitativeValue', value: property.areaSqft, unitCode: 'FTK' }
      : undefined,
    offers: {
      '@type': 'Offer',
      name: property.priceLabel,
      priceCurrency: 'INR',
      price: property.price || undefined,
      seller: { '@id': `${SITE.url}/#organization` },
      availability: property.status === 'active'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/SoldOut',
    },
    amenityFeature: (property.amenities || []).map((a) => ({
      '@type': 'LocationFeatureSpecification',
      name: a,
      value: true,
    })),
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
        { '@type': 'ListItem', position: 2, name: 'Projects', item: `${SITE.url}/projects` },
        { '@type': 'ListItem', position: 3, name: property.name, item: url },
      ],
    },
  }
}

// ---------------------------------------------------------------------------
// Homepage FAQ JSON-LD
// ---------------------------------------------------------------------------
export function buildHomepageFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What areas does New Era Reality cover?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'New Era Reality provides property consultancy services across Mumbai, Navi Mumbai, Thane, Kurla, Chembur, Panvel, Matunga, Ghatkopar, and Atgaon.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is New Era Reality RERA registered?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, New Era Reality is a RERA registered consultant. All listed properties with RERA IDs are verified and compliant with Maharashtra Real Estate Regulatory Authority guidelines.',
        },
      },
      {
        '@type': 'Question',
        name: 'What types of properties can I find on New Era Reality?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'New Era Reality lists apartments, villas, plots, penthouses, and commercial properties ranging from affordable to ultra-luxury across Mumbai, Navi Mumbai and Thane.',
        },
      },
      {
        '@type': 'Question',
        name: 'How can I contact New Era Reality?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can reach us at +91-70217 31962 or +91-90762 59009, or chat with our AI assistant on the website.',
        },
      },
    ],
  }
}
