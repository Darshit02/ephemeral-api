'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { StatCard } from '@/components/publisher/stat-card'
import { SectionRule } from '@/components/publisher/section-rule'
import { Button } from '@/components/ui/button'
import { ArrowRight01Icon, CheckmarkCircle02Icon } from '@/components/icons'

interface PlanSummary {
  name: string
  price: string
  quota: string
  subscribers: number
  rateLimit: string
}

const ACTIVE_PLANS: PlanSummary[] = [
  {
    name: 'COMMUNITY FREE',
    price: '$0.00 / mo',
    quota: '1,000 req / day',
    subscribers: 284,
    rateLimit: '10 req / sec',
  },
  {
    name: 'PROFESSIONAL USAGE',
    price: '$0.002 / req',
    quota: 'Unlimited (Metered)',
    subscribers: 312,
    rateLimit: '100 req / sec',
  },
  {
    name: 'ENTERPRISE DEDICATED',
    price: '$1,200.00 / mo',
    quota: '10,000,000 req / mo',
    subscribers: 46,
    rateLimit: '500 req / sec',
  },
]

const RECENT_REQUESTS = [
  {
    method: 'POST',
    path: '/v1/embeddings',
    status: 200,
    latency: '18ms',
    time: '4s ago',
    consumer: 'sub_98a7...31',
  },
  {
    method: 'POST',
    path: '/v1/embeddings',
    status: 200,
    latency: '24ms',
    time: '9s ago',
    consumer: 'sub_42c1...08',
  },
  {
    method: 'GET',
    path: '/v1/healthz',
    status: 200,
    latency: '4ms',
    time: '14s ago',
    consumer: 'internal_probe',
  },
  {
    method: 'POST',
    path: '/v1/embeddings',
    status: 200,
    latency: '31ms',
    time: '22s ago',
    consumer: 'sub_11ef...99',
  },
  {
    method: 'POST',
    path: '/v1/batch-tokenize',
    status: 201,
    latency: '52ms',
    time: '31s ago',
    consumer: 'sub_98a7...31',
  },
]

export default function ApiOverviewPage() {
  const params = useParams()
  const id = (params?.id as string) || 'api-1'

  return (
    <div className="space-y-12">
      {/* 4 Inverted Stat Cards */}
      <section className="bg-black text-white p-8 border-2 border-black texture-inverted-lines">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard
            label="ACTIVE CONSUMERS"
            value="642"
            subtext="+14 NEW THIS MONTH"
            inverted
          />
          <StatCard
            label="24H REQUEST VOLUME"
            value="3.84M"
            subtext="PEAK 840 REQ/SEC"
            inverted
          />
          <StatCard
            label="MONTHLY RUN RATE"
            value="$14,280.00"
            subtext="BILLED VIA STRIPE"
            inverted
          />
          <StatCard
            label="GATEWAY ERROR RATE"
            value="0.02%"
            subtext="99.98% SUCCESS RATIO"
            inverted
          />
        </div>
      </section>

      {/* 2-Column Architecture Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Left Column (2/3): Service Details & Active Plans */}
        <div className="lg:col-span-2 space-y-12">
          {/* Section: Origin Gateway Routing */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <h2 className="font-display text-xl font-bold tracking-tight text-black">
                Upstream Target &amp; Proxy Configuration
              </h2>
              <Link href={`/publisher/apis/${id}/settings`}>
                <Button variant="ghost" className="text-xs font-mono uppercase tracking-widest p-0">
                  EDIT &rarr;
                </Button>
              </Link>
            </div>

            <div className="border border-black p-6 bg-white space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                <div>
                  <span className="text-[#525252] block uppercase tracking-wider mb-1">
                    UPSTREAM ORIGIN URL:
                  </span>
                  <span className="font-bold text-black select-all">
                    https://origin.internal-ml.network/v1
                  </span>
                </div>
                <div>
                  <span className="text-[#525252] block uppercase tracking-wider mb-1">
                    HEALTH PROBE ENDPOINT:
                  </span>
                  <span className="font-bold text-black select-all">
                    /healthz (every 30s)
                  </span>
                </div>
                <div>
                  <span className="text-[#525252] block uppercase tracking-wider mb-1">
                    GATEWAY TIMEOUT:
                  </span>
                  <span className="font-bold text-black">
                    30 seconds (hard drop)
                  </span>
                </div>
                <div>
                  <span className="text-[#525252] block uppercase tracking-wider mb-1">
                    RATE LIMITING STRATEGY:
                  </span>
                  <span className="font-bold text-black">
                    Redis Token Bucket (per API Key)
                  </span>
                </div>
              </div>
            </div>
          </section>

          <SectionRule thickness="thin" />

          {/* Section: Active Pricing Plans */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <h2 className="font-display text-xl font-bold tracking-tight text-black">
                Configured Monetization Plans
              </h2>
              <Link href={`/publisher/apis/${id}/plans`}>
                <Button variant="ghost" className="text-xs font-mono uppercase tracking-widest p-0">
                  MANAGE ALL PLANS &rarr;
                </Button>
              </Link>
            </div>

            <div className="border border-black divide-y divide-black bg-white">
              {ACTIVE_PLANS.map((plan, idx) => (
                <div key={idx} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest font-bold text-black block">
                      {plan.name}
                    </span>
                    <span className="font-serif text-sm text-[#525252] block mt-0.5">
                      Quota: {plan.quota} &bull; Throttle: {plan.rateLimit}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 sm:text-right">
                    <div>
                      <span className="font-mono text-xs text-[#525252] block">CONSUMERS</span>
                      <span className="font-mono text-sm font-bold text-black">{plan.subscribers}</span>
                    </div>
                    <div>
                      <span className="font-mono text-xs text-[#525252] block">PRICING</span>
                      <span className="font-mono text-sm font-bold text-black">{plan.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (1/3): Live Edge Request Feed */}
        <div className="lg:col-span-1 space-y-6">
          <div className="border-b-2 border-black pb-3 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold tracking-tight text-black">
              Live Invocations
            </h3>
            <span className="w-2 h-2 bg-black inline-block animate-ping" />
          </div>

          <div className="border border-black bg-white p-4 space-y-3 font-mono text-xs">
            {RECENT_REQUESTS.map((req, idx) => (
              <div key={idx} className="p-3 border border-[#E5E5E5] hover:border-black transition-none">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="px-1.5 py-0.5 bg-black text-white text-[10px] font-bold">
                    {req.method}
                  </span>
                  <span className="text-[10px] text-[#525252]">{req.time}</span>
                </div>
                <div className="text-black font-semibold truncate select-all">{req.path}</div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E5E5E5] text-[10px] text-[#525252]">
                  <span>Status: <strong className="text-black">{req.status}</strong></span>
                  <span>Latency: <strong className="text-black">{req.latency}</strong></span>
                </div>
                <div className="text-[9px] text-[#525252] mt-1 truncate">
                  Key: {req.consumer}
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 border border-black bg-[#F5F5F5]">
            <div className="flex items-center gap-2 mb-2 font-mono text-xs font-bold text-black uppercase">
              <CheckmarkCircle02Icon size={16} />
              <span>TLS Termination Active</span>
            </div>
            <p className="font-serif text-xs text-[#525252] leading-relaxed">
              Edge routing uses automated Let's Encrypt certificates with HTTP/2 and HTTP/3 multiplexing enabled.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
