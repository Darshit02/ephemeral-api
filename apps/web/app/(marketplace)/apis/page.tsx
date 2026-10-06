'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Hero } from '@/components/publisher/hero'
import { SearchBar } from '@/components/marketplace/search-bar'
import { CategoryPills } from '@/components/marketplace/category-pills'
import { ApiGrid } from '@/components/marketplace/api-grid'
import { ApiCard, ApiListingItem } from '@/components/marketplace/api-card'
import { ApiCardSkeleton } from '@/components/marketplace/api-card-skeleton'
import { EmptyState } from '@/components/publisher/empty-state'
import { ApiIcon } from '@/components/icons'
import { api } from '@/lib/api'

const SEED_APIS: ApiListingItem[] = [
  {
    id: 'api-1',
    name: 'Neural Embeddings Engine',
    slug: 'neural-embeddings',
    description:
      'High-dimensional vector embedding generation for multimodal text and semantic similarity search with sub-15ms p50 latency.',
    category: 'MACHINE LEARNING',
    provider_name: 'Cerebral Labs',
    plan_count: 3,
    status: 'ACTIVE',
  },
  {
    id: 'api-2',
    name: 'Financial Ledger Consensus',
    slug: 'ledger-consensus',
    description:
      'Double-entry cryptographic ledger reconciliation, real-time transaction validation, and automated multi-currency settlement.',
    category: 'FINTECH',
    provider_name: 'Consensus Core',
    plan_count: 3,
    status: 'ACTIVE',
  },
  {
    id: 'api-3',
    name: 'Geolocation Geofencing',
    slug: 'geo-geofencing',
    description:
      'Polygon intersection testing, reverse IP lookup, and dynamic GPS geofence triggers engineered for autonomous fleet tracking.',
    category: 'GEOSPATIAL',
    provider_name: 'Vector Spatial',
    plan_count: 3,
    status: 'ACTIVE',
  },
  {
    id: 'api-4',
    name: 'Biometric Face Verification',
    slug: 'biometric-verify',
    description:
      'Strict 1:1 and 1:N facial landmark detection with hardware liveness attestation and anti-spoofing cryptographic signatures.',
    category: 'SECURITY',
    provider_name: 'Cipher Security',
    plan_count: 2,
    status: 'ACTIVE',
  },
  {
    id: 'api-5',
    name: 'Weather Radar Doppler',
    slug: 'weather-radar',
    description:
      'Ultra-high resolution NEXRAD precipitation telemetry, atmospheric pressure gradients, and predictive convective weather tracking.',
    category: 'DATA & AI',
    provider_name: 'Atmospheric Labs',
    plan_count: 3,
    status: 'ACTIVE',
  },
  {
    id: 'api-6',
    name: 'Synthetic Document OCR',
    slug: 'synthetic-ocr',
    description:
      'Multilingual document extraction, tax form parsing, automated table understanding, and instant redacting of sensitive personally identifiable records.',
    category: 'DEVELOPER TOOLS',
    provider_name: 'Parse Engine',
    plan_count: 3,
    status: 'ACTIVE',
  },
]

const CATEGORIES = [
  'ALL',
  'MACHINE LEARNING',
  'FINTECH',
  'GEOSPATIAL',
  'SECURITY',
  'DATA & AI',
  'DEVELOPER TOOLS',
]

export default function BrowseApisPage() {
  const [apis, setApis] = useState<ApiListingItem[]>(SEED_APIS)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('ALL')
  const [sortOrder, setSortOrder] = useState<'RECENT' | 'NAME'>('RECENT')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadApis() {
      setLoading(true)
      try {
        const liveApis = await api.core.get<ApiListingItem[]>('/apis')
        if (Array.isArray(liveApis) && liveApis.length > 0) {
          setApis(liveApis)
        }
      } catch {
        // Retain seed catalogue for offline / mock testing
      } finally {
        setLoading(false)
      }
    }
    loadApis()
  }, [])

  const filteredApis = useMemo(() => {
    return apis
      .filter((item) => {
        const matchesQuery =
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.slug.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase())
        const matchesCategory =
          category === 'ALL' ||
          item.category?.toUpperCase() === category.toUpperCase()
        return matchesQuery && matchesCategory
      })
      .sort((a, b) => {
        if (sortOrder === 'NAME') {
          return a.name.localeCompare(b.name)
        }
        return 0
      })
  }, [apis, search, category, sortOrder])

  return (
    <div className="w-full">
      {/* Header */}
      <section className="pt-20 pb-12 md:pt-28 md:pb-16 border-b-2 border-black bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <Hero
            supertitle="MARKETPLACE REGISTRY // DISCOVERY"
            title="Marketplace."
            subtitle="Browse verified production APIs. Inspect contracts, benchmark latency guarantees, and subscribe instantly."
            className="pb-0"
          />
        </div>
      </section>

      {/* Toolbar (Sticky) */}
      <div className="sticky top-20 z-30 bg-white border-b border-black py-4 shadow-none">
        <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="w-full md:w-96">
              <SearchBar value={search} onChange={setSearch} />
            </div>

            <div className="flex items-center gap-4 self-end md:self-auto font-mono text-xs">
              <span className="text-[#525252] uppercase">SORT:</span>
              <button
                onClick={() => setSortOrder(sortOrder === 'RECENT' ? 'NAME' : 'RECENT')}
                className="px-3 py-1.5 border border-black hover:bg-black hover:text-white transition-none uppercase tracking-wider font-semibold"
              >
                {sortOrder} &darr;
              </button>
            </div>
          </div>

          <CategoryPills
            categories={CATEGORIES}
            selected={category}
            onSelect={setCategory}
          />
        </div>
      </div>

      {/* API Listings Viewport */}
      <section className="py-16 md:py-24 bg-white min-h-[500px]">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          {loading ? (
            <ApiGrid>
              {Array.from({ length: 6 }).map((_, i) => (
                <ApiCardSkeleton key={i} />
              ))}
            </ApiGrid>
          ) : filteredApis.length === 0 ? (
            <EmptyState
              icon={<ApiIcon size={36} />}
              title="No APIs match your filters."
              description={`We found zero endpoints matching query "${search}" under category "${category}".`}
              actionLabel="RESET FILTERS"
              onAction={() => {
                setSearch('')
                setCategory('ALL')
              }}
            />
          ) : (
            <ApiGrid>
              {filteredApis.map((apiItem) => (
                <ApiCard key={apiItem.id || apiItem.slug} api={apiItem} />
              ))}
            </ApiGrid>
          )}
        </div>
      </section>
    </div>
  )
}
