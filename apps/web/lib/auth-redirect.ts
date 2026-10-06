import type { User } from '@/lib/auth'

export function homeForRole(role?: User['role'] | null): string {
  switch (role) {
    case 'consumer':
      return '/dashboard'
    case 'provider':
    case 'admin':
      return '/publisher/dashboard'
    default:
      return '/home'
  }
}
