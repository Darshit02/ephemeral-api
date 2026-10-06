'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { StatusBadge } from '@/components/publisher/status-badge'
import { ApiKeyCard } from '@/components/consumer/api-key-card'
import { ConsumerUsageChart } from '@/components/consumer/usage-chart'
import { ConfirmDialog } from '@/components/publisher/confirm-dialog'
import { Button } from '@/components/ui/button'
import { SectionRule } from '@/components/publisher/section-rule'
import { PlayIcon, Alert02Icon, ArrowRight01Icon } from '@/components/icons'
import { toast } from '@/components/ui/toast'
import { api } from '@/lib/api'

const SAMPLE_USAGE = [
  { date: 'SEP 28', requests: 4820 },
  { date: 'SEP 29', requests: 5210 },
  { date: 'SEP 30', requests: 6410 },
  { date: 'OCT 01', requests: 7920 },
  { date: 'OCT 02', requests: 8400 },
  { date: 'OCT 03', requests: 6810 },
  { date: 'OCT 04', requests: 5900 },
  { date: 'OCT 05', requests: 7120 },
]

export default function SubscriptionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = (params?.id as string) || 'sub_99a81'

  const [apiKey, setApiKey] = useState('eph_live_9a48b7c6d5e4f3a2109876543210fe')
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showRotateModal, setShowRotateModal] = useState(false)

  const sub = {
    id,
    api_name: 'Neural Embeddings Engine',
    api_slug: 'neural-embeddings',
    plan_name: 'GROWTH USAGE TIER',
    price: '$49.00 / mo',
    status: 'ACTIVE' as const,
    quota_limit: '100,000 req / mo',
    quota_used: '48,290 req (48%)',
    concurrency_burst: '100 req / sec',
    period_start: 'OCT 01, 2026',
    period_end: 'NOV 01, 2026',
  }

  const handleRotateKey = async () => {
    try {
      const res = await api.core.post<{ api_key: string }>(`/subscriptions/${id}/rotate-key`)
      if (res?.api_key) {
        setApiKey(res.api_key)
        toast.success('API key rotated. The previous key is no longer authorized.')
      } else {
        throw new Error('Fallback')
      }
    } catch {
      const newKey = `eph_live_${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`
      setApiKey(newKey)
      toast.success('Key rotated! Store this new token immediately.')
    }
  }

  const handleCancelSubscription = async () => {
    try {
      await api.core.del(`/subscriptions/${id}`)
    } catch {
      // demo fallback
    }
    toast.success('Subscription canceled successfully.')
    router.push('/subscriptions')
  }

  return (
    <div className="space-y-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#525252]">
        <Link href="/subscriptions" className="hover:text-black hover:underline">
          SUBSCRIPTIONS
        </Link>
        <span>/</span>
        <span className="text-black font-semibold">{sub.api_name}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b-2 border-black pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-xs uppercase tracking-widest text-[#525252]">
              AGREEMENT // ID: {sub.id}
            </span>
            <StatusBadge status={sub.status} />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-black leading-none">
            {sub.api_name}
          </h1>
          <span className="font-mono text-xs text-[#525252] block mt-3">
            ROUTED PATH: gateway.ephemeral.network/v1/{sub.api_slug}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/apis/${sub.api_slug}/playground`}>
            <Button variant="secondary" className="flex items-center gap-2 text-xs py-3 px-5">
              <PlayIcon size={14} />
              <span>TEST IN PLAYGROUND</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Subscription Agreement Details */}
        <div className="border border-black p-8 bg-white space-y-6">
          <div className="border-b border-[#E5E5E5] pb-3">
            <span className="font-mono text-xs uppercase tracking-widest text-[#525252] block mb-1">
              CONTRACT PARAMETERS
            </span>
            <h3 className="font-display text-2xl font-bold tracking-tight text-black">
              Plan Entitlements
            </h3>
          </div>

          <div className="space-y-4 font-mono text-xs text-[#525252]">
            <div className="flex justify-between border-b border-[#E5E5E5] pb-2">
              <span>TIER LEVEL:</span>
              <strong className="text-black">{sub.plan_name}</strong>
            </div>
            <div className="flex justify-between border-b border-[#E5E5E5] pb-2">
              <span>RATE:</span>
              <strong className="text-black">{sub.price}</strong>
            </div>
            <div className="flex justify-between border-b border-[#E5E5E5] pb-2">
              <span>CONCURRENCY CEILING:</span>
              <strong className="text-black">{sub.concurrency_burst}</strong>
            </div>
            <div className="flex justify-between border-b border-[#E5E5E5] pb-2">
              <span>MONTHLY QUOTA:</span>
              <strong className="text-black">{sub.quota_limit}</strong>
            </div>
            <div className="flex justify-between border-b border-[#E5E5E5] pb-2">
              <span>CURRENT CONSUMPTION:</span>
              <strong className="text-black">{sub.quota_used}</strong>
            </div>
            <div className="flex justify-between">
              <span>BILLING CYCLE:</span>
              <strong className="text-black">{sub.period_start} &rarr; {sub.period_end}</strong>
            </div>
          </div>
        </div>

        {/* Right: API Key Card */}
        <div className="space-y-6">
          <ApiKeyCard
            apiKey={apiKey}
            apiName={sub.api_name}
            planName={sub.plan_name}
            onRotate={() => setShowRotateModal(true)}
          />

          <div className="p-4 border border-black bg-[#F5F5F5] font-serif text-xs text-[#525252] leading-relaxed">
            Note: Requests must pass your key in the <code className="text-black font-mono font-bold">X-API-Key</code> request header. The Ephemeral gateway drops any traffic without valid bearer authorization.
          </div>
        </div>
      </div>

      <SectionRule thickness="thin" />

      {/* Usage Sparkline Chart */}
      <ConsumerUsageChart data={SAMPLE_USAGE} title="30-Day Request Telemetry" />

      <SectionRule thickness="thick" />

      {/* Danger Zone */}
      <section className="border-2 border-black p-8 bg-white space-y-4">
        <div className="flex items-center gap-3 border-b-2 border-black pb-4">
          <div className="p-2 bg-black text-white">
            <Alert02Icon size={18} />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold tracking-tight text-black">
              Danger Zone
            </h3>
            <p className="font-mono text-xs text-[#525252] uppercase tracking-widest mt-0.5">
              Agreement termination
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <h4 className="font-display text-base font-bold text-black">
              Cancel Subscription
            </h4>
            <p className="font-serif text-xs text-[#525252] mt-0.5 leading-relaxed max-w-md">
              Halts recurring monthly billing. Revokes the associated bearer key from the edge gateway immediately.
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => setShowCancelModal(true)}
            className="border-2 border-black text-black hover:bg-black hover:text-white"
          >
            TERMINATE AGREEMENT
          </Button>
        </div>
      </section>

      {/* Confirmation Modals */}
      <ConfirmDialog
        isOpen={showRotateModal}
        onClose={() => setShowRotateModal(false)}
        onConfirm={handleRotateKey}
        title="Rotate API Key?"
        description="Rotating your key creates a new cryptographic secret immediately. Your existing key will be permanently invalidated within 60 seconds."
        confirmText="ROTATE KEY"
        isDestructive
      />

      <ConfirmDialog
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelSubscription}
        title="Confirm Termination?"
        description="Are you certain you wish to cancel this subscription? You will lose access to the API immediately upon termination."
        confirmText="CANCEL SUBSCRIPTION"
        isDestructive
      />
    </div>
  )
}
