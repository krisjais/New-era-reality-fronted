import type { Metadata } from 'next'
import ContactPage from '@/components/sections/ContactPage'
import { buildMetadata, SITE } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Contact New Era Reality | Book Free Site Visit',
  description:
    'Contact New Era Reality for property inquiries, free site visits, and expert investment advice. Call us at +91-70217 31962 or send a message. We serve Mumbai, Navi Mumbai and Thane.',
  path: '/contact',
  keywords: [
    'contact New Era Reality',
    'real estate inquiry Mumbai',
    'book site visit Mumbai',
    'property consultant contact',
    'real estate office Mumbai',
  ],
})

const contactJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact New Era Reality',
  url: `${SITE.url}/contact`,
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
      { '@type': 'ListItem', position: 2, name: 'Contact', item: `${SITE.url}/contact` },
    ],
  },
}

export default function Contact() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <ContactPage />
    </>
  )
}
