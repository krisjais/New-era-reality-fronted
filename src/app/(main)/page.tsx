import type { Metadata } from 'next'
import HomePage from '@/components/sections/HomePage'
import { buildMetadata, buildOrganizationJsonLd, buildHomepageFaqJsonLd, SITE } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'New Era Reality | Premium Real Estate in Mumbai | Buy, Sell & Invest',
  description:
    'Discover premium apartments, villas, plots and commercial properties in Mumbai, Navi Mumbai and Thane with New Era Reality. Trusted property consultants with verified listings.',
  path: '/',
  keywords: [
    'Real Estate Mumbai',
    'Property in Mumbai',
    'Luxury Apartments',
    'Commercial Property',
    'Plots',
    'Flats for Sale',
    'New Era Reality',
  ],
})

const faqJsonLd = buildHomepageFaqJsonLd()
const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
  ],
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <HomePage />
    </>
  )
}
