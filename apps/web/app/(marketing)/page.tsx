import React from 'react'
import { MarketingHero } from '@/components/marketing/hero'
import { MarketingStatsSection } from '@/components/marketing/stats-section'
import { FeatureCard } from '@/components/marketing/feature-card'
import { PullQuote } from '@/components/marketing/pull-quote'
import { MarketingFinalCta } from '@/components/marketing/final-cta'
import {
  ApiIcon,
  Key01Icon,
  Analytics01Icon,
  PricingIcon,
} from '@/components/icons'

export default function MarketingLandingPage() {
  const features = [
    {
      number: '01 // ARCHITECTURE',
      title: 'Unified Gateway',
      description:
        'A single cryptographic ingress layer routes all consumer calls with automated TLS termination, sub-millisecond dispatch, and health monitoring.',
      icon: <ApiIcon size={24} />,
    },
    {
      number: '02 // CREDENTIALS',
      title: 'Instant API Keys',
      description:
        'Zero-friction token generation. Consumers receive cryptographically secure SHA-256 bearer keys provisioned instantly into distributed Redis caches.',
      icon: <Key01Icon size={24} />,
    },
    {
      number: '03 // TELEMETRY',
      title: 'Real-Time Metering',
      description:
        'Distributed token-bucket rate limiting enforces quota tiers with zero database locking overhead and sub-microsecond latency penalties.',
      icon: <Analytics01Icon size={24} />,
    },
    {
      number: '04 // SETTLEMENT',
      title: 'Transparent Pricing',
      description:
        'Seamless subscription orchestration powered by Stripe Connect. Providers receive weekly automated ACH disbursements with clear 10% network splits.',
      icon: <PricingIcon size={24} />,
    },
  ]

  return (
    <div className="w-full">
      {/* 1. Hero */}
      <MarketingHero />

      {/* 2. Inverted Stats */}
      <MarketingStatsSection />

      {/* 3. Feature Grid Section */}
      <section className="w-full py-24 md:py-36 bg-white border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-black pb-8">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#525252] block mb-2 font-semibold">
                SYSTEM CAPABILITIES
              </span>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black leading-tight">
                Engineering precision.
              </h2>
            </div>
            <p className="font-serif text-sm text-[#525252] max-w-md leading-relaxed">
              Every interface in Ephemeral is protected by high-availability edge proxies engineered in Go and verified against stringent latency SLAs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feat) => (
              <FeatureCard
                key={feat.title}
                number={feat.number}
                title={feat.title}
                description={feat.description}
                icon={feat.icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Editorial Pull Quote */}
      <PullQuote />

      {/* 5. Inverted Final CTA */}
      <MarketingFinalCta />
    </div>
  )
}
