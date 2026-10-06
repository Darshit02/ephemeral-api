'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { DailyUsagePoint } from '@/components/consumer/usage-chart'

export interface UsageQueryParams {
  from?: string
  to?: string
  interval?: string
}

export function useUsage(params?: UsageQueryParams) {
  return useQuery({
    queryKey: ['usage', params],
    queryFn: async () => {
      const q = new URLSearchParams()
      if (params?.from) q.set('from', params.from)
      if (params?.to) q.set('to', params.to)
      if (params?.interval) q.set('interval', params.interval)
      const qs = q.toString()
      return api.core.get<DailyUsagePoint[]>(qs ? `/usage?${qs}` : '/usage')
    },
  })
}

export function useSubscriptionUsage(id: string, params?: UsageQueryParams) {
  return useQuery({
    queryKey: ['subscription-usage', id, params],
    queryFn: async () => {
      const q = new URLSearchParams()
      if (params?.from) q.set('from', params.from)
      if (params?.to) q.set('to', params.to)
      if (params?.interval) q.set('interval', params.interval)
      const qs = q.toString()
      return api.core.get<DailyUsagePoint[]>(
        qs ? `/subscriptions/${id}/usage?${qs}` : `/subscriptions/${id}/usage`
      )
    },
    enabled: Boolean(id),
  })
}
