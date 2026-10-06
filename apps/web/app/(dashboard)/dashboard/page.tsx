'use client'

import React from 'react'
import Link from 'next/link'
import { Hero } from '@/components/publisher/hero'
import { SectionRule } from '@/components/publisher/section-rule'
import { StatCard } from '@/components/publisher/stat-card'
import { MetricChart } from '@/components/publisher/chart'
import { DataTable, Column } from '@/components/publisher/data-table'
import { StatusBadge } from '@/components/publisher/status-badge'
import { Button } from '@/components/ui/button'
import {
  ApiIcon,
  PlusSignIcon,
  MoneyBagIcon,
  ArrowRight01Icon,
  Key01Icon,
} from '@/components/icons'

interface ApiActivity {
  id: string
  name: string
  slug: string
  tier: string
  requests24h: string
  latencyP50: string
  status: 'ACTIVE' | 'DRAFT' | 'MAINTENANCE' | 'DEPRECATED'
  revenue: string
}

const RECENT_APIS: ApiActivity[] = [
  {
    id: 'api-1',
    name: 'Neural Embeddings Engine',
    slug: 'neural-embeddings',
    tier: 'ENTERPRISE / USAGE',
    requests24h: '3,841,200',
    latencyP50: '28ms',
    status: 'ACTIVE',
    revenue: '$14,280.00',
  },
  {
    id: 'api-2',
    name: 'Financial Ledger Consensus',
    slug: 'ledger-consensus',
    tier: 'PRO TIER',
    requests24h: '2,190,440',
    latencyP50: '46ms',
    status: 'ACTIVE',
    revenue: '$6,850.00',
  },
  {
    id: 'api-3',
    name: 'Geolocation Geofencing',
    slug: 'geo-geofencing',
    tier: 'STARTER / FREE',
    requests24h: '1,490,120',
    latencyP50: '19ms',
    status: 'ACTIVE',
    revenue: '$2,140.00',
  },
  {
    id: 'api-4',
    name: 'Biometric Face Verification',
    slug: 'biometric-verify',
    tier: 'ENTERPRISE',
    requests24h: '899,400',
    latencyP50: '64ms',
    status: 'MAINTENANCE',
    revenue: '$1,580.00',
  },
]

const VOLUME_CHART_DATA = [
  { label: 'MON 00:00', value: 1042000 },
  { label: 'TUE 04:00', value: 1184000 },
  { label: 'WED 08:00', value: 1290000 },
  { label: 'THU 12:00', value: 1450000 },
  { label: 'FRI 16:00', value: 1380000 },
  { label: 'SAT 20:00', value: 920000 },
  { label: 'SUN 23:59', value: 1155000 },
]

export default function PublisherDashboardPage() {
  const tableColumns: Column<ApiActivity>[] = [
    {
      key: 'name',
      header: 'SERVICE / IDENTIFIER',
      render: (item) => (
        <div>
          <span className="font-bold text-black group-hover:text-white block tracking-tight">
            {item.name}
          </span>
          <span className="font-mono text-xs text-[#525252] group-hover:text-white block mt-0.5">
            /{item.slug}
          </span>
        </div>
      ),
    },
    {
      key: 'tier',
      header: 'DEFAULT PLAN',
      render: (item) => (
        <span className="font-mono text-xs uppercase tracking-wider text-[#525252] group-hover:text-white">
          {item.tier}
        </span>
      ),
    },
    {
      key: 'requests24h',
      header: '24H CALLS',
      render: (item) => (
        <span className="font-mono text-xs font-semibold">
          {item.requests24h}
        </span>
      ),
    },
    {
      key: 'latencyP50',
      header: 'P50 LATENCY',
      render: (item) => (
        <span className="font-mono text-xs">
          {item.latencyP50}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'STATUS',
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: 'revenue',
      header: '30D REVENUE',
      className: 'text-right',
      headerClassName: 'text-right',
      render: (item) => (
        <span className="font-mono text-xs font-bold tracking-tight">
          {item.revenue}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-16">
      {/* Editorial Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <Hero
          supertitle="OVERVIEW // SYSTEM METRICS"
          title="Telemetry."
          subtitle="Real-time ingestion, consumer monetization, and edge gateway telemetry across your published APIs."
          className="pb-0"
        />
        <div className="flex items-center gap-3">
          <Link href="/apis/new">
            <Button variant="primary" className="flex items-center gap-2">
              <PlusSignIcon size={16} />
              <span>PUBLISH NEW API</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Inverted Hero Stats Section */}
      <section className="bg-black text-white p-8 md:p-12 relative overflow-hidden texture-inverted-lines border-2 border-black">
        <div className="relative z-10">
          <div className="flex items-center justify-between border-b border-[#333333] pb-4 mb-8">
            <span className="font-mono text-xs uppercase tracking-widest text-[#A3A3A3]">
              AGGREGATED 30-DAY PERFORMANCE
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#A3A3A3]">
              LIVE REFRESH: SYNCED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard
              label="MONTHLY REVENUE"
              value="$24,850.00"
              subtext="+18.4% FROM PREVIOUS MONTH"
              inverted
            />
            <StatCard
              label="ACTIVE SUBSCRIBERS"
              value="1,420"
              subtext="88 NEW CONSUMERS THIS WEEK"
              inverted
            />
            <StatCard
              label="24H REQUEST VOLUME"
              value="8.42M"
              subtext="99.98% SUCCESS RATIO"
              inverted
            />
            <StatCard
              label="MEDIAN GATEWAY LATENCY"
              value="28ms"
              subtext="P99: 94MS WORLDWIDE"
              inverted
            />
          </div>
        </div>
      </section>

      {/* Primary 7-Day Request Volume Metric Chart */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-black">
              Ingress Traffic.
            </h2>
            <p className="font-serif text-sm text-[#525252] mt-1">
              Cumulative incoming API calls routed through the Ephemeral edge proxy over the last 7 calendar days.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1 bg-black text-white font-bold">7 DAYS</span>
            <span className="px-3 py-1 border border-black text-black">30 DAYS</span>
          </div>
        </div>

        <MetricChart
          title="Aggregate Edge Throughput"
          subtitle="Requests per 4-hour aggregation window"
          data={VOLUME_CHART_DATA}
          type="area"
          height={260}
          valueFormatter={(v) => `${(v / 1000000).toFixed(2)}M calls`}
        />
      </section>

      <SectionRule thickness="thick" />

      {/* Quick Action Matrix */}
      <section className="space-y-6">
        <div className="border-b border-black pb-3">
          <span className="font-mono text-xs uppercase tracking-widest text-[#525252]">
            QUICK ACCESS // OPERATIONS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/apis/new"
            className="border border-black p-6 bg-white hover:bg-black hover:text-white transition-none group block"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs uppercase tracking-widest text-[#525252] group-hover:text-white">
                CATALOG
              </span>
              <PlusSignIcon size={18} />
            </div>
            <h3 className="font-display text-xl font-bold tracking-tight mb-2">
              Publish New API
            </h3>
            <p className="font-serif text-sm text-[#525252] group-hover:text-white leading-relaxed">
              Define upstream origin endpoints, configure rate limits, and sync OpenAPI specifications.
            </p>
            <div className="mt-6 flex items-center gap-2 font-mono text-xs font-semibold">
              <span>GET STARTED</span>
              <ArrowRight01Icon size={14} />
            </div>
          </Link>

          <Link
            href="/revenue"
            className="border border-black p-6 bg-white hover:bg-black hover:text-white transition-none group block"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs uppercase tracking-widest text-[#525252] group-hover:text-white">
                FINANCIALS
              </span>
              <MoneyBagIcon size={18} />
            </div>
            <h3 className="font-display text-xl font-bold tracking-tight mb-2">
              Payouts &amp; Balances
            </h3>
            <p className="font-serif text-sm text-[#525252] group-hover:text-white leading-relaxed">
              Review current Stripe Connect escrow balance, monthly recurring revenue, and subscription tranches.
            </p>
            <div className="mt-6 flex items-center gap-2 font-mono text-xs font-semibold">
              <span>VIEW PAYOUTS</span>
              <ArrowRight01Icon size={14} />
            </div>
          </Link>

          <Link
            href="/settings"
            className="border border-black p-6 bg-white hover:bg-black hover:text-white transition-none group block"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs uppercase tracking-widest text-[#525252] group-hover:text-white">
                SECURITY
              </span>
              <Key01Icon size={18} />
            </div>
            <h3 className="font-display text-xl font-bold tracking-tight mb-2">
              Publisher Keys
            </h3>
            <p className="font-serif text-sm text-[#525252] group-hover:text-white leading-relaxed">
              Generate administrative SDK tokens, rotate deployment keys, and inspect webhook signing secrets.
            </p>
            <div className="mt-6 flex items-center gap-2 font-mono text-xs font-semibold">
              <span>CONFIGURE</span>
              <ArrowRight01Icon size={14} />
            </div>
          </Link>
        </div>
      </section>

      <SectionRule thickness="thin" />

      {/* Top Performing Services Table */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-black">
              Active Deployments.
            </h2>
            <p className="font-serif text-sm text-[#525252] mt-1">
              Top traffic-generating services managed under your publisher tenant.
            </p>
          </div>
          <Link href="/apis">
            <Button variant="ghost" className="font-mono text-xs uppercase tracking-widest">
              VIEW FULL CATALOG &rarr;
            </Button>
          </Link>
        </div>

        <DataTable
          columns={tableColumns}
          data={RECENT_APIS}
          keyExtractor={(item) => item.id}
          onRowClick={(item) => {
            window.location.href = `/apis/${item.id}`
          }}
        />
      </section>
    </div>
  )
}
