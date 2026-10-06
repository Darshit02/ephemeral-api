'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { RefreshIcon, ArrowLeft02Icon } from '@/components/icons'

export default function MarketplaceError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Marketplace Error]', error)
  }, [error])

  return (
    <div className="min-h-[70vh] bg-white text-black flex flex-col justify-center items-start px-6 md:px-12 py-16 max-w-4xl mx-auto">
      <span className="font-mono text-xs uppercase tracking-widest text-[#525252] mb-3">
        EXCEPTION // MARKETPLACE_REGISTRY
      </span>

      <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-4">
        Failed to load marketplace index.
      </h1>

      <div className="w-full h-px bg-black relative my-6">
        <div className="absolute right-0 -top-1 w-2 h-2 bg-black" />
      </div>

      <p className="font-serif text-lg text-[#525252] leading-relaxed max-w-2xl mb-6">
        The marketplace registry could not sync with live telemetry records. Please re-query the cluster or return to the directory.
      </p>

      {error.message && (
        <div className="border border-black bg-[#F5F5F5] p-4 font-mono text-xs text-black w-full mb-8 break-all">
          ERROR: {error.message}
          {error.digest && <span className="block mt-1 text-[#525252]">DIGEST: {error.digest}</span>}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Button onClick={reset} variant="primary" className="flex items-center gap-2">
          <RefreshIcon size={16} />
          <span>RETRY QUERY</span>
        </Button>
        <Link href="/apis">
          <Button variant="secondary" className="flex items-center gap-2">
            <ArrowLeft02Icon size={16} />
            <span>ALL APIS</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}
