export const env = {
  CORE_API_URL: process.env.NEXT_PUBLIC_CORE_API || 'http://localhost:8081',
  ADMIN_API_URL: process.env.NEXT_PUBLIC_ADMIN_API || 'http://localhost:8082',
  GATEWAY_URL: process.env.NEXT_PUBLIC_GATEWAY || 'http://localhost:8080',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const

export function validateEnv(): { valid: boolean; missing: string[] } {
  const missing: string[] = []

  if (process.env.NODE_ENV === 'production') {
    if (!process.env.NEXT_PUBLIC_CORE_API) missing.push('NEXT_PUBLIC_CORE_API')
    if (!process.env.NEXT_PUBLIC_ADMIN_API) missing.push('NEXT_PUBLIC_ADMIN_API')
    if (!process.env.NEXT_PUBLIC_GATEWAY) missing.push('NEXT_PUBLIC_GATEWAY')
  }

  return {
    valid: missing.length === 0,
    missing,
  }
}
