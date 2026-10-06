import { MetadataRoute } from 'next'
import { env } from '@/lib/env'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = env.APP_URL || 'https://ephemeral.network'
  const currentDate = new Date().toISOString()

  const staticRoutes = [
    '',
    '/home',
    '/pricing',
    '/docs',
    '/apis',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: route === '' || route === '/home' ? 1.0 : 0.8,
  }))

  const seedApiSlugs = [
    'neural-embeddings',
    'ledger-consensus',
    'geo-geofencing',
    'biometric-verify',
    'weather-radar',
    'synthetic-ocr',
  ]

  const dynamicApiRoutes = seedApiSlugs.map((slug) => ({
    url: `${baseUrl}/apis/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...dynamicApiRoutes]
}
