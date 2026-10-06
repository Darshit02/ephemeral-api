'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Hero } from '@/components/publisher/hero'
import { SubscriptionCard, ConsumerSubscriptionItem } from '@/components/consumer/subscription-card'
import { ConsumerEmptyState } from '@/components/consumer/empty-state'
import { ConfirmDialog } from '@/components/publisher/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Store01Icon, PlusSignIcon } from '@/components/icons'
import { api } from '@/lib/api'
import { toast } from '@/components/ui/toast'

const SEED_SUBSCRIPTIONS: ConsumerSubscriptionItem[] = [
  {
    id: 'sub_99a81',
    api_id: 'api-1',
    api_name: 'Neural Embeddings Engine',
    api_slug: 'neural-embeddings',
    plan_name: 'GROWTH USAGE ($49/mo)',
    status: 'ACTIVE',
    current_period_end: 'NOV 01, 2026',
    key_prefix: 'eph_live_9a48••••',
    monthly_spend: '$49.00',
  },
  {
    id: 'sub_42c12',
    api_id: 'api-2',
    api_name: 'Financial Ledger Consensus',
    api_slug: 'ledger-consensus',
    plan_name: 'ENTERPRISE DEDICATED',
    status: 'ACTIVE',
    current_period_end: 'OCT 28, 2026',
    key_prefix: 'eph_live_42c1••••',
    monthly_spend: '$1,200.00',
  },
  {
    id: 'sub_11ef9',
    api_id: 'api-3',
    api_name: 'Geolocation Geofencing',
    api_slug: 'geo-geofencing',
    plan_name: 'COMMUNITY FREE',
    status: 'ACTIVE',
    current_period_end: 'NOV 15, 2026',
    key_prefix: 'eph_live_11ef••••',
    monthly_spend: '$0.00',
  },
]

type FilterStatus = 'ALL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED'

export default function ConsumerSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<ConsumerSubscriptionItem[]>(SEED_SUBSCRIPTIONS)
  const [filter, setFilter] = useState<FilterStatus>('ALL')
  const [cancelingId, setCancelingId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSubs() {
      try {
        const live = await api.core.get<ConsumerSubscriptionItem[]>('/subscriptions')
        if (Array.isArray(live) && live.length > 0) {
          setSubscriptions(live)
        }
      } catch {
        // Keep seed subscriptions
      }
    }
    fetchSubs()
  }, [])

  const filteredSubs = useMemo(() => {
    if (filter === 'ALL') return subscriptions
    if (filter === 'ACTIVE') return subscriptions.filter((s) => s.status === 'ACTIVE')
    if (filter === 'PAST_DUE') return subscriptions.filter((s) => s.status === 'MAINTENANCE')
    if (filter === 'CANCELED') return subscriptions.filter((s) => s.status === 'DEPRECATED')
    return subscriptions
  }, [subscriptions, filter])

  const handleConfirmCancel = async () => {
    if (!cancelingId) return
    try {
      await api.core.del(`/subscriptions/${cancelingId}`)
      toast.success('Subscription canceled. Gateway key has been invalidated.')
    } catch {
      toast.success('Demo subscription marked as canceled.')
    }

    setSubscriptions((prev) =>
      prev.map((s) => (s.id === cancelingId ? { ...s, status: 'DEPRECATED' } : s))
    )
    setCancelingId(null)
  }

  return (
    <div className="space-y-12">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <Hero
          supertitle="CONSUMER SUITE // ACTIVE AGREEMENTS"
          title="Subscriptions."
          subtitle="Manage active API rentals, inspect renewal deadlines, and review quota agreements."
          className="pb-0"
        />
        <Link href="/apis">
          <Button variant="primary" className="flex items-center gap-2">
            <PlusSignIcon size={16} />
            <span>DISCOVER APIS</span>
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-black pb-4 overflow-x-auto font-mono text-xs">
        {(['ALL', 'ACTIVE', 'PAST_DUE', 'CANCELED'] as FilterStatus[]).map((tab) => {
          const isActive = filter === tab
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 border transition-none uppercase tracking-widest ${
                isActive
                  ? 'bg-black text-white border-black font-bold'
                  : 'bg-white text-black border-[#E5E5E5] hover:border-black'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          )
        })}
      </div>

      {/* Subscriptions List */}
      {filteredSubs.length === 0 ? (
        <ConsumerEmptyState
          icon={<Store01Icon size={32} />}
          title="No subscriptions match this filter."
          description="Explore our curated registry to subscribe to low-latency machine learning and fintech APIs."
          actionLabel="EXPLORE MARKETPLACE"
          actionHref="/apis"
        />
      ) : (
        <div className="space-y-6">
          {filteredSubs.map((sub) => (
            <SubscriptionCard
              key={sub.id}
              subscription={sub}
              onCancel={(id) => setCancelingId(id)}
            />
          ))}
        </div>
      )}

      {/* Cancellation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(cancelingId)}
        onClose={() => setCancelingId(null)}
        onConfirm={handleConfirmCancel}
        title="Cancel Subscription?"
        description="Terminating this subscription will immediately revoke your associated API key. Upstream calls utilizing this token will begin receiving HTTP 401 Unauthorized errors."
        confirmText="TERMINATE SUBSCRIPTION"
        isDestructive
      />
    </div>
  )
}
