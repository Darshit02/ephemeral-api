'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { ConsumerSubscriptionItem } from '@/components/consumer/subscription-card'
import { toast } from '@/components/ui/toast'

export function useSubscriptions() {
  return useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      return api.core.get<ConsumerSubscriptionItem[]>('/subscriptions')
    },
  })
}

export function useSubscription(id: string) {
  return useQuery({
    queryKey: ['subscription', id],
    queryFn: async () => {
      return api.core.get<ConsumerSubscriptionItem>(`/subscriptions/${id}`)
    },
    enabled: Boolean(id),
  })
}

export function useSubscribe() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ plan_id }: { plan_id: string }) => {
      return api.core.post<{
        id: string
        api_key?: string
        checkout_url?: string
      }>('/subscriptions', { plan_id })
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
      if (!data.checkout_url) {
        toast.success('Subscription provisioned successfully.')
      }
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to create subscription.')
    },
  })
}

export function useCancelSubscription() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      return api.core.del(`/subscriptions/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
      toast.success('Subscription canceled successfully.')
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to cancel subscription.')
    },
  })
}

export function useRotateKey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      return api.core.post<{ api_key: string }>(`/subscriptions/${id}/rotate-key`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
      toast.success('Key rotated. Please save your new token.')
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to rotate key.')
    },
  })
}
