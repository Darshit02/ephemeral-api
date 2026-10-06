'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Hero } from '@/components/publisher/hero'
import { SectionRule } from '@/components/publisher/section-rule'
import { StatCard } from '@/components/publisher/stat-card'
import { StatusBadge } from '@/components/publisher/status-badge'
import { Button } from '@/components/ui/button'
import {
  Store01Icon,
  Key01Icon,
  Analytics01Icon,
  ArrowRight01Icon,
} from '@/components/icons'
import { api } from '@/lib/api'

interface SubItem {
  id: string
  api_id: string
  api_name: string
  api_slug: string
  plan_name: string
  status: 'ACTIVE' | 'DRAFT' | 'MAINTENANCE' | 'DEPRECATED'
  current_period_end: string
  key_prefix: string
  monthly_spend: string
}

const SEED_SUBS: SubItem[] = [
  {
    id: 'sub-1',
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
    id: 'sub-2',
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
    id: 'sub-3',
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

export default function ConsumerDashboardPage() {
  const [subscriptions, setSubscriptions] = useState<SubItem[]>(SEED_SUBS)

  useEffect(() => {
    async function loadSubs() {
      try {
        const liveSubs = await api.core.get<SubItem[]>('/subscriptions')
        if (Array.isArray(liveSubs) && liveSubs.length > 0) {
          setSubscriptions(liveSubs)
        }
      } catch {
        // Keep seed subscriptions
      }
    }
    loadSubs()
  }, [])

  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <Hero
          supertitle="CONSUMER PORTAL // OVERVIEW"
          title="Dashboard."
          subtitle="Monitor active subscriptions, query telemetry, provisioned credentials, and monthly API allocations."
          className="pb-0"
        />
        <Link href="/apis">
          <Button variant="primary" className="flex items-center gap-2">
            <Store01Icon size={16} />
            <span>BROWSE MARKETPLACE</span>
          </Button>
        </Link>
      </div>

      {/* Inverted Stats Hero */}
      <section className="bg-black text-white p-8 md:p-12 relative overflow-hidden texture-inverted-lines border-2 border-black">
        <div className="relative z-10">
          <div className="flex items-center justify-between border-b border-[#333333] pb-4 mb-8">
            <span className="font-mono text-xs uppercase tracking-widest text-[#A3A3A3]">
              MONTH-TO-DATE CONSUMPTION SUMMARY
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#A3A3A3]">
              STATUS: NOMINAL
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard
              label="ACTIVE SUBSCRIPTIONS"
              value={subscriptions.length.toString()}
              subtext="ALL SYSTEMS OPERATIONAL"
              inverted
            />
            <StatCard
              label="REQUESTS (30D)"
              value="2.84M"
              subtext="99.99% CACHE HIT"
              inverted
            />
            <StatCard
              label="ACTIVE API KEYS"
              value={subscriptions.length.toString()}
              subtext="HARDWARE HASHED"
              inverted
            />
            <StatCard
              label="MONTHLY RUN RATE"
              value="$1,249.00"
              subtext="AUTO-BILLED VIA STRIPE"
              inverted
            />
          </div>
        </div>
      </section>

      {/* Quick Action Matrix */}
      <section className="space-y-6">
        <div className="border-b border-black pb-3">
          <span className="font-mono text-xs uppercase tracking-widest text-[#525252]">
            OPERATIONS // SHORTCUTS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/apis"
            className="border border-black p-6 bg-white hover:bg-black hover:text-white transition-none group block"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs uppercase tracking-widest text-[#525252] group-hover:text-white">
                CATALOG
              </span>
              <Store01Icon size={18} />
            </div>
            <h3 className="font-display text-xl font-bold tracking-tight mb-2">
              Explore APIs
            </h3>
            <p className="font-serif text-sm text-[#525252] group-hover:text-white leading-relaxed">
              Discover verified origin endpoints across machine learning, geospatial, security, and financial infrastructure.
            </p>
            <div className="mt-6 flex items-center gap-2 font-mono text-xs font-semibold">
              <span>BROWSE REGISTRY</span>
              <ArrowRight01Icon size={14} />
            </div>
          </Link>

          <Link
            href="/api-keys"
            className="border border-black p-6 bg-white hover:bg-black hover:text-white transition-none group block"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs uppercase tracking-widest text-[#525252] group-hover:text-white">
                CREDENTIALS
              </span>
              <Key01Icon size={18} />
            </div>
            <h3 className="font-display text-xl font-bold tracking-tight mb-2">
              Manage API Keys
            </h3>
            <p className="font-serif text-sm text-[#525252] group-hover:text-white leading-relaxed">
              Inspect bearer tokens, copy gateway secrets, and execute single-click key rotations.
            </p>
            <div className="mt-6 flex items-center gap-2 font-mono text-xs font-semibold">
              <span>VIEW TOKENS</span>
              <ArrowRight01Icon size={14} />
            </div>
          </Link>

          <Link
            href="/usage"
            className="border border-black p-6 bg-white hover:bg-black hover:text-white transition-none group block"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs uppercase tracking-widest text-[#525252] group-hover:text-white">
                TELEMETRY
              </span>
              <Analytics01Icon size={18} />
            </div>
            <h3 className="font-display text-xl font-bold tracking-tight mb-2">
              Quota Consumption
            </h3>
            <p className="font-serif text-sm text-[#525252] group-hover:text-white leading-relaxed">
              Review daily request breakdowns, latency distributions, and billing period quota allocations.
            </p>
            <div className="mt-6 flex items-center gap-2 font-mono text-xs font-semibold">
              <span>VIEW TELEMETRY</span>
              <ArrowRight01Icon size={14} />
            </div>
          </Link>
        </div>
      </section>

      <SectionRule thickness="thin" />

      {/* Active Subscriptions List */}
      <section className="space-y-6">
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-black">
              Enrolled Subscriptions.
            </h2>
            <p className="font-serif text-sm text-[#525252] mt-1">
              Active agreements authorizing traffic through the Ephemeral edge gateway.
            </p>
          </div>
          <Link href="/subscriptions">
            <Button variant="ghost" className="font-mono text-xs uppercase tracking-widest">
              VIEW ALL &rarr;
            </Button>
          </Link>
        </div>

        <div className="border border-black divide-y divide-[#E5E5E5] bg-white">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F5F5F5] transition-none group select-none"
            >
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-display text-xl font-bold text-black group-hover:underline">
                    {sub.api_name}
                  </span>
                  <StatusBadge status={sub.status} />
                </div>
                <div className="flex items-center gap-3 font-mono text-xs text-[#525252]">
                  <span>{sub.plan_name}</span>
                  <span>&bull;</span>
                  <span>Key: {sub.key_prefix}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-mono text-sm font-bold text-black">
                  {sub.monthly_spend}
                </span>
                <Link href={`/subscriptions/${sub.id}`}>
                  <Button variant="secondary" className="text-xs py-1.5 px-3">
                    DETAILS
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
