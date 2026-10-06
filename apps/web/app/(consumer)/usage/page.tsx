'use client'

import React, { useState } from 'react'
import { Hero } from '@/components/publisher/hero'
import { StatCard } from '@/components/publisher/stat-card'
import { SectionRule } from '@/components/publisher/section-rule'
import { ConsumerUsageChart, DailyUsagePoint } from '@/components/consumer/usage-chart'
import { DataTable, Column } from '@/components/publisher/data-table'

interface EndpointUsageItem {
  id: string
  api_name: string
  endpoint: string
  requests: string
  avg_latency: string
  error_rate: string
}

const ENDPOINT_METRICS: EndpointUsageItem[] = [
  {
    id: '1',
    api_name: 'Neural Embeddings Engine',
    endpoint: '/v1/neural-embeddings/predict',
    requests: '1,420,800',
    avg_latency: '18ms',
    error_rate: '0.01%',
  },
  {
    id: '2',
    api_name: 'Financial Ledger Consensus',
    endpoint: '/v1/ledger-consensus/verify',
    requests: '984,200',
    avg_latency: '24ms',
    error_rate: '0.00%',
  },
  {
    id: '3',
    api_name: 'Geolocation Geofencing',
    endpoint: '/v1/geo-geofencing/intersect',
    requests: '435,000',
    avg_latency: '12ms',
    error_rate: '0.03%',
  },
]

const DAILY_USAGE_DATA: DailyUsagePoint[] = [
  { date: 'SEP 29', requests: 74200 },
  { date: 'SEP 30', requests: 88400 },
  { date: 'OCT 01', requests: 92100 },
  { date: 'OCT 02', requests: 104500 },
  { date: 'OCT 03', requests: 112000 },
  { date: 'OCT 04', requests: 98400 },
  { date: 'OCT 05', requests: 124800 },
]

export default function ConsumerUsagePage() {
  const [range, setRange] = useState<'24H' | '7D' | '30D' | '90D'>('7D')

  const columns: Column<EndpointUsageItem>[] = [
    {
      key: 'api_name',
      header: 'SERVICE',
      render: (item) => (
        <span className="font-bold text-black group-hover:text-white block">
          {item.api_name}
        </span>
      ),
    },
    {
      key: 'endpoint',
      header: 'TARGET ENDPOINT',
      render: (item) => (
        <span className="font-mono text-xs text-[#525252] group-hover:text-white select-all">
          {item.endpoint}
        </span>
      ),
    },
    {
      key: 'requests',
      header: 'CALLS (INTERVAL)',
      render: (item) => (
        <span className="font-mono text-xs font-semibold">{item.requests}</span>
      ),
    },
    {
      key: 'avg_latency',
      header: 'AVG LATENCY',
      render: (item) => (
        <span className="font-mono text-xs">{item.avg_latency}</span>
      ),
    },
    {
      key: 'error_rate',
      header: 'ERROR RATE',
      className: 'text-right',
      headerClassName: 'text-right',
      render: (item) => (
        <span className="font-mono text-xs font-bold">{item.error_rate}</span>
      ),
    },
  ]

  return (
    <div className="space-y-12">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <Hero
          supertitle="TELEMETRY // QUOTA & INGRESS"
          title="Usage."
          subtitle="Real-time request volume, percentile latency breakdowns, and rate-limit headroom."
          className="pb-0"
        />

        {/* Range Selector */}
        <div className="flex items-center gap-1 font-mono text-xs">
          {(['24H', '7D', '30D', '90D'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setRange(t)}
              className={`px-4 py-2 border transition-none uppercase tracking-widest ${
                range === t
                  ? 'bg-black text-white border-black font-bold'
                  : 'bg-white text-black border-[#E5E5E5] hover:border-black'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Inverted Hero Telemetry Stats */}
      <section className="bg-black text-white p-8 border-2 border-black texture-inverted-lines">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard
            label="TOTAL REQUESTS"
            value="2.84M"
            subtext="ACROSS 3 APIS"
            inverted
          />
          <StatCard
            label="FAILED INVOCATIONS"
            value="42"
            subtext="ERROR RATE: 0.001%"
            inverted
          />
          <StatCard
            label="AVERAGE LATENCY"
            value="18ms"
            subtext="P99: 44MS WORLDWIDE"
            inverted
          />
          <StatCard
            label="QUOTA HEADROOM"
            value="52%"
            subtext="51,710 CALLS REMAINING"
            inverted
          />
        </div>
      </section>

      {/* Daily Usage Chart */}
      <ConsumerUsageChart data={DAILY_USAGE_DATA} title="Daily Request Volume" />

      <SectionRule thickness="thin" />

      {/* Breakdown by Endpoint */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h3 className="font-display text-2xl font-bold tracking-tight text-black">
            Ingress by Endpoint.
          </h3>
          <span className="font-mono text-xs uppercase tracking-widest text-[#525252]">
            RANKED BY FREQUENCY
          </span>
        </div>

        <DataTable
          columns={columns}
          data={ENDPOINT_METRICS}
          keyExtractor={(item) => item.id}
        />
      </section>
    </div>
  )
}
