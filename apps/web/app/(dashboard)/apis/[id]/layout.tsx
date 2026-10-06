'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import { StatusBadge } from '@/components/publisher/status-badge'
import { Copy01Icon, ArrowRight01Icon } from '@/components/icons'

export default function ApiDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const params = useParams()
  const id = (params?.id as string) || 'api-1'

  // Mock API detail
  const api = {
    id,
    name: 'Neural Embeddings Engine',
    slug: 'neural-embeddings',
    status: 'ACTIVE' as const,
    upstream: 'https://origin.internal-ml.network/v1',
  }

  const [copied, setCopied] = React.useState(false)

  const handleCopyEndpoint = () => {
    navigator.clipboard.writeText(`https://gateway.ephemeral.network/v1/${api.slug}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tabs = [
    { label: 'OVERVIEW', href: `/apis/${id}` },
    { label: 'PLANS & PRICING', href: `/apis/${id}/plans` },
    { label: 'ANALYTICS & LOGS', href: `/apis/${id}/analytics` },
    { label: 'CONFIGURATION', href: `/apis/${id}/settings` },
  ]

  return (
    <div className="space-y-8">
      {/* Editorial Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#525252]">
        <Link href="/apis" className="hover:text-black hover:underline">
          CATALOG
        </Link>
        <span>/</span>
        <span className="text-black font-semibold">{api.name}</span>
      </nav>

      {/* API Header Title Block */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-black pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#525252]">
              SERVICE REGISTRY // ID: {api.id}
            </span>
            <StatusBadge status={api.status} />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black leading-none">
            {api.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-4 font-mono text-xs text-[#525252]">
            <span>
              SLUG: <strong className="text-black">/{api.slug}</strong>
            </span>
            <span>&bull;</span>
            <span className="truncate max-w-xs" title={api.upstream}>
              ORIGIN: <strong className="text-black">{api.upstream}</strong>
            </span>
          </div>
        </div>

        {/* Public Endpoint Clipboard Box */}
        <div className="border border-black p-3 bg-[#F5F5F5] flex items-center justify-between gap-4 font-mono text-xs">
          <span className="text-black truncate max-w-xs select-all">
            https://gateway.ephemeral.network/v1/{api.slug}
          </span>
          <button
            onClick={handleCopyEndpoint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white hover:bg-white hover:text-black border border-black transition-none uppercase tracking-wider text-[10px]"
          >
            <Copy01Icon size={12} />
            <span>{copied ? 'COPIED' : 'COPY'}</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="border-b border-black flex gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`py-3.5 px-6 font-mono text-xs uppercase tracking-widest transition-none border-b-4 -mb-[1px] whitespace-nowrap ${
                isActive
                  ? 'border-black text-black font-bold bg-[#F5F5F5]'
                  : 'border-transparent text-[#525252] hover:text-black hover:border-[#E5E5E5]'
              }`}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>

      {/* Tab Viewport */}
      <div>{children}</div>
    </div>
  )
}
