import type { Metadata } from 'next'
import AboutPage from '@/components/sections/AboutPage'
import { buildMetadata, SITE } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'About New Era Reality | Mumbai Real Estate Consultants',
  description:
    'Learn about New Era Reality — a RERA-registered real estate firm helping homebuyers and investors find premium properties in Mumbai, Navi Mumbai and Thane since inception.',
  path: '/about',
  keywords: [
    'about New Era Reality',
    'real estate consultants Mumbai',
    'RERA registered agent Mumbai',
    'property agents Navi Mumbai',
    'trusted real estate company Mumbai',
  ],
})

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
    { '@type': 'ListItem', position: 2, name: 'About', item: `${SITE.url}/about` },
  ],
}

export default function About() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <AboutPage />
    </>
  )
}
