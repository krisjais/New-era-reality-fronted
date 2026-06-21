import type { Metadata } from 'next'
import ProjectsPage from '@/components/sections/ProjectsPage'
import { buildMetadata, SITE } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'All Properties in Mumbai, Navi Mumbai & Thane',
  description:
    'Browse verified apartments, villas, plots and commercial properties for sale in Mumbai, Navi Mumbai and Thane. Filter by location, BHK, budget and possession status.',
  path: '/projects',
  keywords: [
    'properties in Mumbai',
    'flats for sale Navi Mumbai',
    'apartments Thane',
    'plots for sale Mumbai',
    'luxury villas Mumbai',
    'buy property Mumbai',
    'real estate listings Mumbai',
  ],
})

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
    { '@type': 'ListItem', position: 2, name: 'Projects', item: `${SITE.url}/projects` },
  ],
}

export default function Projects() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProjectsPage />
    </>
  )
}
