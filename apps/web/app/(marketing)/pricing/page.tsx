'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Hero } from '@/components/publisher/hero'
import { SectionRule } from '@/components/publisher/section-rule'
import { Button } from '@/components/ui/button'
import { CheckmarkCircle02Icon, ArrowRight01Icon } from '@/components/icons'

interface PlanTier {
  name: string
  price: string
  period: string
  subtitle: string
  features: string[]
  isPopular?: boolean
  ctaText: string
  href: string
}

export default function MarketingPricingPage() {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0)

  const tiers: PlanTier[] = [
    {
      name: 'COMMUNITY',
      price: '$0',
      period: '/mo',
      subtitle: 'For independent developers experimenting and testing in local sandboxes.',
      features: [
        'Access to all free API tiers',
        '1,000 requests per day base quota',
        'Shared Redis rate bucket (10 req/s)',
        'Community discussion support',
        'Standard TLS 1.3 termination',
      ],
      ctaText: 'START FOR FREE',
      href: '/register',
    },
    {
      name: 'GROWTH PRO',
      price: '$49',
      period: '/mo',
      subtitle: 'For fast-moving engineering teams building production applications.',
      features: [
        'Unlimited API subscriptions',
        '100,000 requests per month allowance',
        '100 req/sec burst concurrency',
        'Sub-15ms regional edge routing',
        'Direct key rotation via SDK & dashboard',
        'Priority email developer support',
      ],
      isPopular: true,
      ctaText: 'COMMENCE PRO',
      href: '/register',
    },
    {
      name: 'ENTERPRISE',
      price: '$1,200',
      period: '/mo',
      subtitle: 'For mission-critical enterprises requiring dedicated throughput guarantees.',
      features: [
        'Dedicated gateway IP addresses',
        '10,000,000 requests monthly quota',
        '500 req/sec burst throughput',
        'Custom uptime SLA (99.99%)',
        'Direct VPC peering & private links',
        '24/7 dedicated engineering hotline',
      ],
      ctaText: 'INQUIRE ENTERPRISE',
      href: 'mailto:enterprise@ephemeral.network',
    },
  ]

  const faqs = [
    {
      q: 'How does API monetization work on Ephemeral?',
      a: 'Publishers declare upstream origin endpoints, assign pricing tiers (Free, Pay-As-You-Go, or Monthly), and sync an OpenAPI contract. Consumers subscribe to obtain authenticated keys. Billed revenue is deposited directly via Stripe Connect with automated payouts.',
    },
    {
      q: 'What happens when a consumer exceeds their monthly quota?',
      a: 'Depending on the publisher’s configuration, the gateway either enforces rate limits by returning HTTP 429 Too Many Requests with standard Retry-After headers, or calculates metered usage overages billed at the close of the billing cycle.',
    },
    {
      q: 'Where are Ephemeral gateway nodes hosted?',
      a: 'Ephemeral edge nodes operate in Tier-1 data facilities globally across North America, Europe, and Asia-Pacific, delivering sub-2ms proxy overhead and redundant automatic failover.',
    },
    {
      q: 'Can I publish private or internal-only APIs?',
      a: 'Yes. APIs can be maintained in DRAFT or PRIVATE mode, allowing team members and authorized partners to access them via scoped API tokens without listing them on the public discovery marketplace.',
    },
  ]

  return (
    <div className="w-full">
      {/* Top Header */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-20 border-b-2 border-black bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <Hero
            supertitle="PLANS &amp; METERING"
            title="Pricing."
            subtitle="Predictable tiers and metered consumption. Never surprise overage fees or ambiguous throttling."
            className="pb-0"
          />
        </div>
      </section>

      {/* 3-Tier Grid */}
      <section className="py-24 md:py-32 bg-white border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {tiers.map((tier) => {
              const isFeatured = tier.isPopular
              return (
                <div
                  key={tier.name}
                  className={`border flex flex-col justify-between p-8 md:p-12 transition-colors duration-100 select-none ${
                    isFeatured
                      ? 'border-2 border-black bg-white lg:-mt-6 lg:-mb-6 shadow-none'
                      : 'border-black bg-white hover:bg-black hover:text-white group'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`font-mono text-xs uppercase tracking-widest font-semibold ${
                        isFeatured ? 'text-black' : 'text-[#525252] group-hover:text-white/70'
                      }`}>
                        {tier.name}
                      </span>
                      {isFeatured && (
                        <span className="font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 bg-black text-white font-bold">
                          RECOMMENDED
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-1 my-6 border-b border-[#E5E5E5] pb-6">
                      <span className="font-display text-6xl font-bold tracking-tight text-black leading-none">
                        {tier.price}
                      </span>
                      <span className={`font-mono text-sm uppercase ${
                        isFeatured ? 'text-[#525252]' : 'text-[#525252] group-hover:text-white/70'
                      }`}>
                        {tier.period}
                      </span>
                    </div>

                    <p className={`font-serif text-sm leading-relaxed mb-8 ${
                      isFeatured ? 'text-[#525252]' : 'text-[#525252] group-hover:text-white/80'
                    }`}>
                      {tier.subtitle}
                    </p>

                    {/* Features */}
                    <ul className="space-y-3.5 mb-10">
                      {tier.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-3">
                          <CheckmarkCircle02Icon
                            size={16}
                            className={`mt-0.5 flex-shrink-0 ${
                              isFeatured ? 'text-black' : 'text-black group-hover:text-white'
                            }`}
                          />
                          <span className="font-serif text-sm leading-snug">
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <div className="pt-6 border-t border-[#E5E5E5] mt-auto">
                    <Link href={tier.href}>
                      <Button
                        variant={isFeatured ? 'primary' : 'secondary'}
                        className="w-full text-xs py-3.5"
                      >
                        {tier.ctaText}
                      </Button>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <div className="border-b-2 border-black pb-4 mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-[#525252] block mb-1">
              FREQUENTLY ASKED INQUIRIES
            </span>
            <h2 className="font-display text-4xl font-bold tracking-tight text-black">
              Clarifications &amp; Protocols.
            </h2>
          </div>

          <div className="border-t border-black divide-y divide-black">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx
              return (
                <div key={faq.q} className="py-6">
                  <button
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left group"
                  >
                    <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-black group-hover:underline">
                      {faq.q}
                    </span>
                    <span className="font-mono text-lg font-bold ml-4">
                      {isOpen ? '—' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <p className="font-serif text-base text-[#525252] mt-4 leading-relaxed max-w-3xl animate-in fade-in duration-100">
                      {faq.a}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
