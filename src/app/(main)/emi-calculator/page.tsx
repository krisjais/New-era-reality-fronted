import type { Metadata } from 'next'
import EmiCalculatorPage from '@/components/sections/EmiCalculatorPage'
import { buildMetadata, SITE } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'EMI Calculator for Home Loans in India | New Era Reality',
  description:
    'Calculate your monthly EMI for home loans in Mumbai instantly. Enter loan amount, interest rate and tenure to plan your property purchase budget with our free EMI calculator.',
  path: '/emi-calculator',
  keywords: [
    'EMI calculator home loan',
    'home loan calculator India',
    'Mumbai property EMI',
    'mortgage calculator India',
    'real estate EMI calculator',
    'housing loan EMI',
  ],
})

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How is home loan EMI calculated?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Home loan EMI is calculated using the formula: EMI = [P × R × (1+R)^N] / [(1+R)^N - 1], where P is the principal loan amount, R is the monthly interest rate and N is the number of monthly instalments.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the current home loan interest rate in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Home loan interest rates in India typically range from 8.50% to 10.50% per annum depending on the bank and your credit score. Use our EMI calculator to estimate your monthly payments.',
      },
    },
  ],
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
      { '@type': 'ListItem', position: 2, name: 'EMI Calculator', item: `${SITE.url}/emi-calculator` },
    ],
  },
}

export default function EmiCalculator() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <EmiCalculatorPage />
    </>
  )
}
