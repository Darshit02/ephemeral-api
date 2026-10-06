import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight01Icon } from '@/components/icons'

export function MarketingHero() {
  return (
    <section className="relative w-full pt-20 pb-24 md:pt-32 md:pb-36 border-b-2 border-black">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-8">
          <span className="font-mono text-xs uppercase tracking-widest text-[#525252] font-semibold">
            PUBLISH &bull; RENT &bull; CONSUME
          </span>
          <span className="w-12 h-[1px] bg-[#E5E5E5]" />
          <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
            VERSION 2.0 PROTOCOL
          </span>
        </div>

        {/* Hero Headline */}
        <div className="space-y-2 select-none">
          <h1 className="font-display text-8xl sm:text-9xl md:text-[11rem] font-bold tracking-tighter text-black leading-none uppercase">
            APIs
          </h1>
          <h2 className="font-display text-5xl sm:text-7xl md:text-8xl italic font-normal tracking-tight text-black leading-tight">
            for rent.
          </h2>
        </div>

        {/* Architectural Decorative Element */}
        <div className="flex items-center gap-3 my-10">
          <div className="w-10 h-1 bg-black" />
          <div className="w-2.5 h-2.5 border-2 border-black bg-white" />
          <div className="w-24 h-[1px] bg-[#E5E5E5]" />
        </div>

        {/* Editorial Subhead */}
        <p className="font-serif text-lg sm:text-xl md:text-2xl text-[#525252] max-w-2xl leading-relaxed mb-12">
          A high-performance cryptographic marketplace for production-grade APIs.
          Deploy your origin, establish unmetered or tier-based rates, and stream revenue instantly.
        </p>

        {/* Dual CTAs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <Link href="/apis">
            <Button variant="primary" className="w-full sm:w-auto text-xs py-4 px-8 flex items-center justify-center gap-3">
              <span>BROWSE MARKETPLACE</span>
              <ArrowRight01Icon size={16} />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary" className="w-full sm:w-auto text-xs py-4 px-8">
              PUBLISH YOUR API
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
