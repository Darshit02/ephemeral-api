import { MetadataRoute } from 'next'
import { env } from '@/lib/env'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.APP_URL || 'https://ephemeral.network'

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/home', '/pricing', '/docs', '/apis', '/apis/*'],
        disallow: [
          '/dashboard',
          '/dashboard/*',
          '/subscriptions',
          '/subscriptions/*',
          '/api-keys',
          '/api-keys/*',
          '/usage',
          '/usage/*',
          '/settings',
          '/publisher',
          '/publisher/*',
          '/login',
          '/register',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
