'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { ApiListingItem } from '@/components/marketplace/api-card'
import { ApiPlanItem } from '@/components/marketplace/plan-selector'

export interface ApiFilters {
  category?: string
  search?: string
  status?: string
}

export function useApis(filters?: ApiFilters) {
  return useQuery({
    queryKey: ['apis', filters],
    queryFn: async () => {
      const queryParams = new URLSearchParams()
      if (filters?.category && filters.category !== 'ALL') queryParams.set('category', filters.category)
      if (filters?.search) queryParams.set('q', filters.search)
      if (filters?.status) queryParams.set('status', filters.status)

      const qs = queryParams.toString()
      const path = qs ? `/apis?${qs}` : '/apis'
      return api.core.get<ApiListingItem[]>(path)
    },
  })
}

export function useApi(slug: string) {
  return useQuery({
    queryKey: ['api', slug],
    queryFn: async () => {
      return api.core.get<ApiListingItem>(`/apis/${slug}`)
    },
    enabled: Boolean(slug),
  })
}

export function useApiPlans(slug: string) {
  return useQuery({
    queryKey: ['api-plans', slug],
    queryFn: async () => {
      return api.core.get<ApiPlanItem[]>(`/apis/${slug}/plans`)
    },
    enabled: Boolean(slug),
  })
}
