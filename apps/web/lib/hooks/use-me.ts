'use client'

import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api, ApiError } from '@/lib/api'
import { useAuth, User } from '@/lib/auth'

export function useMe() {
  const { token, isAuthenticated, logout } = useAuth()

  const query = useQuery({
    queryKey: ['me', token],
    queryFn: async () => {
      if (!token) return null
      return api.core.get<User>('/auth/me')
    },
    enabled: isAuthenticated && Boolean(token),
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 401) {
        return false
      }
      return failureCount < 2
    },
  })

  useEffect(() => {
    if (query.error instanceof ApiError && query.error.status === 401) {
      logout()
    }
  }, [query.error, logout])

  return query
}
