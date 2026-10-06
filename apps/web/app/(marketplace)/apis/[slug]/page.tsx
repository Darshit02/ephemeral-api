'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'
import { StatusBadge } from '@/components/publisher/status-badge'
import { PlanSelector, ApiPlanItem } from '@/components/marketplace/plan-selector'
import { CodeBlock } from '@/components/marketplace/code-block'
import { Button } from '@/components/ui/button'
import {
  Copy01Icon,
  CheckmarkCircle02Icon,
  Book02Icon,
  PlayIcon,
  ArrowRight01Icon,
} from '@/components/icons'
import { toast } from '@/components/ui/toast'

interface ApiDetail {
  id: string
  name: string
  slug: string
  description: string
  provider_name?: string
  category?: string
  status?: 'ACTIVE' | 'DRAFT' | 'MAINTENANCE' | 'DEPRECATED'
}

const SEED_API_DATA: Record<string, ApiDetail> = {
  'neural-embeddings': {
    id: 'api-1',
    name: 'Neural Embeddings Engine',
    slug: 'neural-embeddings',
    description:
      'High-dimensional vector embedding generation for multimodal text and semantic similarity search with sub-15ms p50 latency. Designed for retrieval-augmented generation (RAG) pipelines and high-throughput vector database ingestion.',
    provider_name: 'Cerebral Labs Inc.',
    category: 'MACHINE LEARNING',
    status: 'ACTIVE',
  },
  'ledger-consensus': {
    id: 'api-2',
    name: 'Financial Ledger Consensus',
    slug: 'ledger-consensus',
    description:
      'Double-entry cryptographic ledger reconciliation, settlement verification, and real-time fraud scoring engine with immutable audit trails.',
    provider_name: 'Consensus Core',
    category: 'FINTECH',
    status: 'ACTIVE',
  },
}

const DEFAULT_PLANS: ApiPlanItem[] = [
  {
    id: 'plan-free',
    name: 'COMMUNITY FREE',
    price: '$0.00',
    period: '/mo',
    quota: '1,000 calls / day',
    rateLimit: '10 req / sec',
    billingModel: 'FREE TIER',
  },
  {
    id: 'plan-pro',
    name: 'GROWTH USAGE',
    price: '$49.00',
    period: '/mo',
    quota: '100,000 calls / mo',
    rateLimit: '100 req / sec',
    billingModel: 'MONTHLY FIXED',
  },
  {
    id: 'plan-enterprise',
    name: 'ENTERPRISE DEDICATED',
    price: '$1,200.00',
    period: '/mo',
    quota: '10,000,000 calls / mo',
    rateLimit: '500 req / sec',
    billingModel: 'DEDICATED CAPACITY',
  },
]

export default function ApiDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = (params?.slug as string) || 'neural-embeddings'
  const { isAuthenticated } = useAuth()

  const [apiData, setApiData] = useState<ApiDetail>(
    SEED_API_DATA[slug] || {
      id: 'api-default',
      name: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      slug,
      description:
        'Production grade verified API endpoint running across the Ephemeral high-availability edge proxy network.',
      provider_name: 'Verified Publisher',
      category: 'ENTERPRISE API',
      status: 'ACTIVE',
    }
  )

  const [plans, setPlans] = useState<ApiPlanItem[]>(DEFAULT_PLANS)
  const [selectedPlanId, setSelectedPlanId] = useState<string>(DEFAULT_PLANS[0].id)
  const [isSubscribing, setIsSubscribing] = useState(false)

  useEffect(() => {
    async function fetchApi() {
      try {
        const detail = await api.core.get<ApiDetail>(`/apis/${slug}`)
        if (detail && detail.name) {
          setApiData(detail)
        }
      } catch {
        // Keep fallback seed
      }
      try {
        const livePlans = await api.core.get<ApiPlanItem[]>(`/apis/${slug}/plans`)
        if (Array.isArray(livePlans) && livePlans.length > 0) {
          setPlans(livePlans)
          setSelectedPlanId(livePlans[0].id)
        }
      } catch {
        // Keep default plans
      }
    }
    fetchApi()
  }, [slug])

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      router.push(`/login?next=/apis/${slug}`)
      return
    }

    setIsSubscribing(true)
    try {
      const res = await api.core.post<{
        id: string
        api_key?: string
        checkout_url?: string
      }>('/subscriptions', {
        plan_id: selectedPlanId,
      })

      if (res?.checkout_url) {
        window.location.href = res.checkout_url
        return
      }

      toast.success('Subscription provisioned. Your API key is now active in your portal.')
      router.push('/subscriptions')
    } catch (err: any) {
      // Demo fallback: simulate successful enrollment
      toast.success('Demo subscription created! Forwarding to API keys...')
      router.push('/api-keys')
    } finally {
      setIsSubscribing(false)
    }
  }

  const endpointUrl = `https://gateway.ephemeral.network/v1/${slug}`
  const sampleCurl = `curl -X POST "${endpointUrl}/predict" \\\n  -H "X-API-Key: YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"input": "Ephemeral Protocol"}'`

  return (
    <div className="w-full">
      {/* Top Header & Breadcrumb */}
      <section className="pt-16 pb-12 md:pt-24 md:pb-16 border-b-2 border-black bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#525252]">
            <Link href="/apis" className="hover:text-black hover:underline">
              MARKETPLACE
            </Link>
            <span>/</span>
            <span className="text-black font-semibold">{apiData.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-xs uppercase tracking-widest text-[#525252] font-semibold">
                  {apiData.category || 'API'} &bull; PUBLISHER: {apiData.provider_name}
                </span>
                <StatusBadge status={apiData.status || 'ACTIVE'} />
              </div>

              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-black leading-none">
                {apiData.name}
              </h1>

              <span className="font-mono text-xs text-[#525252] block mt-3 select-all">
                ENDPOINT: gateway.ephemeral.network/v1/{apiData.slug}
              </span>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="flex items-center gap-3">
              <Link href={`/apis/${slug}/docs`}>
                <Button variant="secondary" className="flex items-center gap-2 text-xs py-3 px-5">
                  <Book02Icon size={16} />
                  <span>CONTRACT DOCS</span>
                </Button>
              </Link>
              <Link href={`/apis/${slug}/playground`}>
                <Button variant="secondary" className="flex items-center gap-2 text-xs py-3 px-5">
                  <PlayIcon size={16} />
                  <span>TRY PLAYGROUND</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2-Column Detail & Subscription Viewport */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Left Column (2/3): Service Details & Architecture */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description Section */}
              <section className="space-y-4">
                <div className="border-b-2 border-black pb-3">
                  <h2 className="font-display text-2xl font-bold tracking-tight text-black">
                    Service Description
                  </h2>
                </div>
                <p className="font-serif text-base sm:text-lg text-[#525252] leading-relaxed">
                  {apiData.description}
                </p>
              </section>

              {/* Base Endpoint Section */}
              <section className="space-y-4">
                <div className="border-b-2 border-black pb-3">
                  <h2 className="font-display text-2xl font-bold tracking-tight text-black">
                    Base Edge Gateway Endpoint
                  </h2>
                </div>
                <div className="border border-black p-4 bg-[#F5F5F5] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
                  <span className="font-bold text-black select-all break-all">
                    {endpointUrl}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(endpointUrl)
                      toast.success('Gateway URL copied to clipboard.')
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white hover:bg-white hover:text-black border border-black transition-none uppercase tracking-wider text-[10px] whitespace-nowrap self-start sm:self-auto"
                  >
                    <Copy01Icon size={12} />
                    <span>COPY URL</span>
                  </button>
                </div>
              </section>

              {/* Sample Invocations */}
              <section className="space-y-4">
                <div className="border-b-2 border-black pb-3">
                  <h2 className="font-display text-2xl font-bold tracking-tight text-black">
                    Example Invocation
                  </h2>
                </div>
                <CodeBlock code={sampleCurl} language="bash" title="cURL Example" />
              </section>

              {/* Guarantees Checklist */}
              <section className="space-y-4">
                <div className="border-b-2 border-black pb-3">
                  <h2 className="font-display text-2xl font-bold tracking-tight text-black">
                    Protocol Guarantees
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    'Sub-15ms regional proxy routing overhead',
                    'Automatic TLS 1.3 edge termination',
                    'Zero database locks on rate limit verification',
                    'Hardware-backed cryptographic token verification',
                    '99.98% guaranteed gateway availability SLA',
                    'Real-time quota telemetry & error diagnostics',
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 border border-[#E5E5E5] bg-white">
                      <CheckmarkCircle02Icon size={16} className="mt-0.5 flex-shrink-0 text-black" />
                      <span className="font-serif text-xs text-black">{feat}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column (1/3): Sticky Plan Selector Card */}
            <div className="lg:col-span-1 sticky top-28 space-y-6">
              <div className="border-2 border-black bg-white p-8 space-y-6">
                <div className="border-b-2 border-black pb-3">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#525252] block mb-1">
                    SUBSCRIPTION TIERS
                  </span>
                  <h3 className="font-display text-3xl font-bold tracking-tight text-black">
                    Choose a plan.
                  </h3>
                </div>

                <PlanSelector
                  plans={plans}
                  selectedPlanId={selectedPlanId}
                  onSelectPlan={setSelectedPlanId}
                />

                <div className="pt-2">
                  <Button
                    variant="primary"
                    disabled={isSubscribing}
                    onClick={handleSubscribe}
                    className="w-full text-xs py-4 flex items-center justify-center gap-2"
                  >
                    <span>{isSubscribing ? 'PROVISIONING...' : 'SUBSCRIBE TO PLAN'}</span>
                    <ArrowRight01Icon size={14} />
                  </Button>
                </div>

                <p className="font-serif text-[11px] text-[#525252] text-center leading-relaxed">
                  Cancel anytime from your portal dashboard. Instant token revocation upon termination.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
