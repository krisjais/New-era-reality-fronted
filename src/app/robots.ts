import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/api/', '/_next/', '/private/', '/login/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin', '/api/', '/_next/'],
      },
    ],
    sitemap: 'https://newerareality.com/sitemap.xml',
    host: 'https://newerareality.com',
  }
}
