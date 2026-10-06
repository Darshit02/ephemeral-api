'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { Hero } from '@/components/publisher/hero'
import { StatusBadge } from '@/components/publisher/status-badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EmptyState } from '@/components/publisher/empty-state'
import {
  ApiIcon,
  PlusSignIcon,
  ArrowRight01Icon,
  Analytics01Icon,
  Settings01Icon,
} from '@/components/icons'

interface ApiListing {
  id: string
  name: string
  slug: string
  description: string
  category: string
  status: 'ACTIVE' | 'DRAFT' | 'MAINTENANCE' | 'DEPRECATED'
  subscribers: number
  calls24h: string
  mrr: string
  version: string
  updatedAt: string
}

const INITIAL_APIS: ApiListing[] = [
  {
    id: 'api-1',
    name: 'Neural Embeddings Engine',
    slug: 'neural-embeddings',
    description: 'High-dimensional text and multimodal vector embedding generation with sub-15ms p50 latency and cosine similarity search.',
    category: 'MACHINE LEARNING',
    status: 'ACTIVE',
    subscribers: 642,
    calls24h: '3,841,200',
    mrr: '$14,280.00',
    version: 'v2.4.0',
    updatedAt: '2 HOURS AGO',
  },
  {
    id: 'api-2',
    name: 'Financial Ledger Consensus',
    slug: 'ledger-consensus',
    description: 'Double-entry cryptographic ledger reconciliation, settlement verification, and real-time fraud scoring engine.',
    category: 'FINTECH',
    status: 'ACTIVE',
    subscribers: 318,
    calls24h: '2,190,440',
    mrr: '$6,850.00',
    version: 'v1.8.2',
    updatedAt: 'YESTERDAY',
  },
  {
    id: 'api-3',
    name: 'Geolocation Geofencing',
    slug: 'geo-geofencing',
    description: 'Polygon intersection testing, reverse IP lookup, and dynamic GPS geofence alerts optimized for fleet tracking.',
    category: 'GEOSPATIAL',
    status: 'ACTIVE',
    subscribers: 460,
    calls24h: '1,490,120',
    mrr: '$2,140.00',
    version: 'v3.0.1',
    updatedAt: '3 DAYS AGO',
  },
  {
    id: 'api-4',
    name: 'Biometric Face Verification',
    slug: 'biometric-verify',
    description: 'Strict 1:1 and 1:N facial landmark matching with liveness detection and anti-spoofing cryptographic attestation.',
    category: 'SECURITY',
    status: 'MAINTENANCE',
    subscribers: 120,
    calls24h: '899,400',
    mrr: '$1,580.00',
    version: 'v1.1.0',
    updatedAt: 'OCT 04, 2026',
  },
  {
    id: 'api-5',
    name: 'Synthetic Document OCR',
    slug: 'synthetic-ocr',
    description: 'Multilingual tabular document extraction, receipt parsing, and automated redaction of sensitive personally identifiable records.',
    category: 'PRODUCTIVITY',
    status: 'DRAFT',
    subscribers: 0,
    calls24h: '0',
    mrr: '$0.00',
    version: 'v0.9.0',
    updatedAt: 'OCT 01, 2026',
  },
]

type StatusFilter = 'ALL' | 'ACTIVE' | 'DRAFT' | 'MAINTENANCE'

export default function PublisherApisPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<StatusFilter>('ALL')

  const filteredApis = useMemo(() => {
    return INITIAL_APIS.filter((api) => {
      const matchesSearch =
        api.name.toLowerCase().includes(search.toLowerCase()) ||
        api.slug.toLowerCase().includes(search.toLowerCase()) ||
        api.category.toLowerCase().includes(search.toLowerCase())
      const matchesFilter = filter === 'ALL' || api.status === filter
      return matchesSearch && matchesFilter
    })
  }, [search, filter])

  return (
    <div className="space-y-12">
      {/* Editorial Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <Hero
          supertitle="REGISTRY // DEPLOYED INTERFACES"
          title="Catalog."
          subtitle="All API products published under your organization. Manage versions, pricing schemas, and origin endpoints."
          className="pb-0"
        />
        <Link href="/apis/new">
          <Button variant="primary" className="flex items-center gap-2">
            <PlusSignIcon size={16} />
            <span>PUBLISH NEW API</span>
          </Button>
        </Link>
      </div>

      {/* Filter and Query Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-black pb-6">
        {/* Search Input */}
        <div className="w-full md:w-96">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, slug, or category..."
            className="w-full font-serif text-sm"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1 font-mono text-xs overflow-x-auto pb-2 md:pb-0">
          {(['ALL', 'ACTIVE', 'DRAFT', 'MAINTENANCE'] as StatusFilter[]).map((tab) => {
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
                {tab}
              </button>
            )
          })}
        </div>
      </div>

      {/* Catalog Grid */}
      {filteredApis.length === 0 ? (
        <EmptyState
          icon={<ApiIcon size={32} />}
          title="No APIs Located."
          description={`No published APIs matched the active filter "${filter}" or search query "${search}".`}
          actionLabel="RESET FILTERS"
          onAction={() => {
            setSearch('')
            setFilter('ALL')
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredApis.map((api) => (
            <div
              key={api.id}
              className="border border-black bg-white p-8 flex flex-col justify-between hover:border-2 transition-none relative group"
            >
              <div>
                {/* Meta Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#525252] block">
                      {api.category} &bull; {api.version}
                    </span>
                    <Link href={`/apis/${api.id}`}>
                      <h3 className="font-display text-2xl font-bold tracking-tight text-black group-hover:underline mt-1">
                        {api.name}
                      </h3>
                    </Link>
                    <span className="font-mono text-xs text-[#525252] mt-0.5 block">
                      /{api.slug}
                    </span>
                  </div>
                  <StatusBadge status={api.status} />
                </div>

                {/* Description */}
                <p className="font-serif text-sm text-[#525252] leading-relaxed line-clamp-2 mb-6">
                  {api.description}
                </p>

                {/* Performance Metrics Row */}
                <div className="grid grid-cols-3 border-y border-[#E5E5E5] py-3.5 mb-6 text-left">
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#525252] block">
                      SUBSCRIBERS
                    </span>
                    <span className="font-mono text-sm font-bold text-black mt-0.5 block">
                      {api.subscribers.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#525252] block">
                      24H CALLS
                    </span>
                    <span className="font-mono text-sm font-bold text-black mt-0.5 block">
                      {api.calls24h}
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#525252] block">
                      MONTHLY REV
                    </span>
                    <span className="font-mono text-sm font-bold text-black mt-0.5 block">
                      {api.mrr}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between border-t border-black pt-4 mt-auto">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#525252]">
                  UPDATED {api.updatedAt}
                </span>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/apis/${api.id}/analytics`}
                    title="Analytics"
                    className="p-2 border border-transparent hover:border-black transition-none"
                  >
                    <Analytics01Icon size={16} />
                  </Link>
                  <Link
                    href={`/apis/${api.id}/settings`}
                    title="Settings"
                    className="p-2 border border-transparent hover:border-black transition-none"
                  >
                    <Settings01Icon size={16} />
                  </Link>
                  <Link href={`/apis/${api.id}`}>
                    <Button variant="secondary" className="text-[10px] py-1.5 px-3">
                      <span>MANAGE</span>
                      <ArrowRight01Icon size={12} className="ml-1 inline" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
