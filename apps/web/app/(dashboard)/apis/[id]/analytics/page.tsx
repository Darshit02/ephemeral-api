'use client'

import React, { useState } from 'react'
import { Hero } from '@/components/publisher/hero'
import { SectionRule } from '@/components/publisher/section-rule'
import { StatCard } from '@/components/publisher/stat-card'
import { MetricChart } from '@/components/publisher/chart'
import { DataTable, Column } from '@/components/publisher/data-table'

interface ConsumerMetric {
  id: string
  identifier: string
  plan: string
  totalCalls: string
  p50Latency: string
  errorCount: number
  quotaPercent: number
  lastActive: string
}

const CONSUMER_METRICS: ConsumerMetric[] = [
  {
    id: 'c-1',
    identifier: 'acme_corp (key_98a7...31)',
    plan: 'ENTERPRISE DEDICATED',
    totalCalls: '1,420,800',
    p50Latency: '22ms',
    errorCount: 14,
    quotaPercent: 42,
    lastActive: 'JUST NOW',
  },
  {
    id: 'c-2',
    identifier: 'vanguard_ai (key_42c1...08)',
    plan: 'GROWTH USAGE',
    totalCalls: '984,200',
    p50Latency: '26ms',
    errorCount: 8,
    quotaPercent: 78,
    lastActive: '2M AGO',
  },
  {
    id: 'c-3',
    identifier: 'strata_analytics (key_11ef...99)',
    plan: 'GROWTH USAGE',
    totalCalls: '640,110',
    p50Latency: '28ms',
    errorCount: 22,
    quotaPercent: 54,
    lastActive: '5M AGO',
  },
  {
    id: 'c-4',
    identifier: 'dev_sandbox (key_33ab...12)',
    plan: 'COMMUNITY FREE',
    totalCalls: '28,400',
    p50Latency: '34ms',
    errorCount: 3,
    quotaPercent: 94,
    lastActive: '18M AGO',
  },
]

const HOURLY_REQUESTS = [
  { label: '00:00', value: 124000 },
  { label: '02:00', value: 98000 },
  { label: '04:00', value: 84000 },
  { label: '06:00', value: 142000 },
  { label: '08:00', value: 248000 },
  { label: '10:00', value: 380000 },
  { label: '12:00', value: 420000 },
  { label: '14:00', value: 450000 },
  { label: '16:00', value: 390000 },
  { label: '18:00', value: 340000 },
  { label: '20:00', value: 290000 },
  { label: '22:00', value: 180000 },
]

const LATENCY_DISTRIBUTION = [
  { label: '00:00', value: 24 },
  { label: '04:00', value: 22 },
  { label: '08:00', value: 28 },
  { label: '12:00', value: 34 },
  { label: '16:00', value: 31 },
  { label: '20:00', value: 26 },
  { label: '23:59', value: 24 },
]

export default function ApiAnalyticsPage() {
  const [range, setRange] = useState<'24H' | '7D' | '30D' | '90D'>('24H')

  const columns: Column<ConsumerMetric>[] = [
    {
      key: 'identifier',
      header: 'CONSUMER TENANT',
      render: (item) => (
        <div>
          <span className="font-bold text-black group-hover:text-white block">
            {item.identifier.split(' ')[0]}
          </span>
          <span className="font-mono text-[10px] text-[#525252] group-hover:text-white block mt-0.5">
            {item.identifier.split(' ')[1]}
          </span>
        </div>
      ),
    },
    {
      key: 'plan',
      header: 'PLAN TIER',
      render: (item) => (
        <span className="font-mono text-xs uppercase tracking-wider text-[#525252] group-hover:text-white">
          {item.plan}
        </span>
      ),
    },
    {
      key: 'totalCalls',
      header: 'REQUESTS',
      render: (item) => (
        <span className="font-mono text-xs font-semibold">
          {item.totalCalls}
        </span>
      ),
    },
    {
      key: 'p50Latency',
      header: 'P50 LATENCY',
      render: (item) => (
        <span className="font-mono text-xs">
          {item.p50Latency}
        </span>
      ),
    },
    {
      key: 'quotaPercent',
      header: 'QUOTA USAGE',
      render: (item) => (
        <div className="w-32">
          <div className="flex justify-between font-mono text-[10px] mb-1">
            <span>{item.quotaPercent}%</span>
          </div>
          <div className="w-full bg-[#E5E5E5] h-1.5 border border-black">
            <div
              className="bg-black h-full group-hover:bg-white transition-none"
              style={{ width: `${item.quotaPercent}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'lastActive',
      header: 'LAST ACTIVE',
      className: 'text-right',
      headerClassName: 'text-right',
      render: (item) => (
        <span className="font-mono text-xs text-[#525252] group-hover:text-white">
          {item.lastActive}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-12">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <Hero
          supertitle="TELEMETRY // INGRESS, LATENCY & ERROR RATES"
          title="Analytics."
          subtitle="Precision edge metrics, latency percentiles, and subscriber quota consumption."
          className="pb-0"
        />

        {/* Time Window Selector */}
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

      {/* Inverted Hero Stats */}
      <section className="bg-black text-white p-8 border-2 border-black texture-inverted-lines">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard
            label="TOTAL REQUESTS"
            value="3.84M"
            subtext="THROUGHPUT: 44.4 REQ/S"
            inverted
          />
          <StatCard
            label="MEDIAN LATENCY (P50)"
            value="24ms"
            subtext="GATEWAY PROXY OVERHEAD: 2MS"
            inverted
          />
          <StatCard
            label="TAIL LATENCY (P99)"
            value="92ms"
            subtext="ORIGIN ENGINE EXECUTION"
            inverted
          />
          <StatCard
            label="ERROR RATE"
            value="0.02%"
            subtext="HTTP 5XX CODES: 8 TOTAL"
            inverted
          />
        </div>
      </section>

      {/* Dual Monochrome Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <MetricChart
          title="Ingress Traffic Profile"
          subtitle="Hourly request volume routed through gateway"
          data={HOURLY_REQUESTS}
          type="area"
          height={240}
          valueFormatter={(v) => `${(v / 1000).toFixed(0)}k req`}
        />

        <MetricChart
          title="Median Latency (P50)"
          subtitle="Milliseconds per proxy transaction"
          data={LATENCY_DISTRIBUTION}
          type="line"
          height={240}
          valueFormatter={(v) => `${v}ms`}
        />
      </div>

      <SectionRule thickness="thin" />

      {/* HTTP Status Code Distribution */}
      <section className="border border-black p-6 bg-white space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
          <h3 className="font-display text-lg font-bold tracking-tight text-black">
            HTTP Status Breakdown
          </h3>
          <span className="font-mono text-xs uppercase tracking-widest text-[#525252]">
            TOTAL: 3,841,200 RESPONSES
          </span>
        </div>

        {/* Sharp Segment Bar */}
        <div className="w-full h-8 flex border border-black overflow-hidden font-mono text-[10px] text-white">
          <div
            style={{ width: '98.4%' }}
            className="bg-black flex items-center justify-center font-bold tracking-wider"
            title="2xx Success: 98.4%"
          >
            2XX SUCCESS (98.4%)
          </div>
          <div
            style={{ width: '1.4%' }}
            className="bg-[#525252] flex items-center justify-center"
            title="4xx Client Error: 1.4%"
          />
          <div
            style={{ width: '0.2%' }}
            className="bg-[#E5E5E5] flex items-center justify-center"
            title="5xx Gateway Error: 0.2%"
          />
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2 font-mono text-xs">
          <div>
            <span className="text-[#525252] block uppercase tracking-wider">2XX SUCCESS:</span>
            <span className="font-bold text-black">3,779,740 (98.4%)</span>
          </div>
          <div>
            <span className="text-[#525252] block uppercase tracking-wider">4XX CLIENT (RATE LIMIT):</span>
            <span className="font-bold text-black">53,776 (1.4%)</span>
          </div>
          <div>
            <span className="text-[#525252] block uppercase tracking-wider">5XX GATEWAY / ORIGIN:</span>
            <span className="font-bold text-black">7,684 (0.2%)</span>
          </div>
        </div>
      </section>

      <SectionRule thickness="thick" />

      {/* Top Consumers Table */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h3 className="font-display text-2xl font-bold tracking-tight text-black">
            Top Consumer Subscribers.
          </h3>
          <span className="font-mono text-xs uppercase tracking-widest text-[#525252]">
            RANKED BY VOLUME (24H)
          </span>
        </div>

        <DataTable
          columns={columns}
          data={CONSUMER_METRICS}
          keyExtractor={(item) => item.id}
        />
      </section>
    </div>
  )
}
