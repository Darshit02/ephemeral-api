'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuth, User } from '@/lib/auth'

export function useMe() {
  const { token, isAuthenticated } = useAuth()

  return useQuery({
    queryKey: ['me', token],
    queryFn: async () => {
      if (!token) return null
      return api.core.get<User>('/auth/me')
    },
    enabled: isAuthenticated && Boolean(token),
  })
}
