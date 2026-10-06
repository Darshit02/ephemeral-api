import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight01Icon } from '@/components/icons'

export function MarketingFinalCta() {
  return (
    <section className="w-full bg-black text-white py-24 md:py-36 relative overflow-hidden texture-inverted-lines select-none">
      <div className="max-w-7xl mx-auto px-6 md:px-8 text-center relative z-10 space-y-8">
        <span className="font-mono text-xs uppercase tracking-widest text-[#A3A3A3] font-semibold block">
          COMMISSION YOUR INTERFACES
        </span>

        <h2 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white leading-none">
          Start publishing.
        </h2>

        <p className="font-serif text-base sm:text-lg text-[#A3A3A3] max-w-xl mx-auto leading-relaxed">
          Zero upfront fees. Connect your OpenAPI contract in minutes, assign quota rules, and accept API subscribers worldwide.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register">
            <Button
              variant="primary"
              className="w-full sm:w-auto text-xs py-4 px-8 bg-white text-black hover:bg-black hover:text-white border-2 border-white flex items-center justify-center gap-3"
            >
              <span>GET STARTED NOW</span>
              <ArrowRight01Icon size={16} />
            </Button>
          </Link>
          <Link href="/apis">
            <Button
              variant="secondary"
              className="w-full sm:w-auto text-xs py-4 px-8 text-white border-white hover:bg-white hover:text-black"
            >
              BROWSE MARKETPLACE
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
