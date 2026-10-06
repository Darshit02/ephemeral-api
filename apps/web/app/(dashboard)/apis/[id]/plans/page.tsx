'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Hero } from '@/components/publisher/hero'
import { SectionRule } from '@/components/publisher/section-rule'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/publisher/confirm-dialog'
import {
  PlusSignIcon,
  PencilEdit01Icon,
  Delete01Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
} from '@/components/icons'

interface Plan {
  id: string
  name: string
  billingModel: 'FREE' | 'USAGE' | 'SUBSCRIPTION'
  priceDisplay: string
  priceValue: number
  quota: string
  rateLimitPerSec: number
  subscribers: number
  isActive: boolean
  features: string[]
}

const INITIAL_PLANS: Plan[] = [
  {
    id: 'plan-1',
    name: 'COMMUNITY FREE',
    billingModel: 'FREE',
    priceDisplay: '$0.00',
    priceValue: 0,
    quota: '1,000 calls / day',
    rateLimitPerSec: 10,
    subscribers: 284,
    isActive: true,
    features: [
      'Standard edge latency',
      'Shared Redis rate bucket',
      'Public community support',
      'Community rate throttle (10 req/s)',
    ],
  },
  {
    id: 'plan-2',
    name: 'GROWTH USAGE',
    billingModel: 'USAGE',
    priceDisplay: '$0.002 / req',
    priceValue: 0.002,
    quota: 'Pay-as-you-go metered',
    rateLimitPerSec: 150,
    subscribers: 312,
    isActive: true,
    features: [
      'Automated Stripe monthly billing',
      'Priority routing queue',
      'Detailed telemetry logs',
      'Burst tolerance (150 req/s)',
    ],
  },
  {
    id: 'plan-3',
    name: 'ENTERPRISE DEDICATED',
    billingModel: 'SUBSCRIPTION',
    priceDisplay: '$1,200.00 / mo',
    priceValue: 1200,
    quota: '10,000,000 calls / mo',
    rateLimitPerSec: 500,
    subscribers: 46,
    isActive: true,
    features: [
      'Dedicated gateway IP pools',
      'Custom SLA & 99.99% uptime',
      'Direct VPC peering support',
      'Highest burst allocation (500 req/s)',
    ],
  },
]

export default function ApiPlansPage() {
  const [plans, setPlans] = useState<Plan[]>(INITIAL_PLANS)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null)

  // Plan creation/edit fields
  const [formName, setFormName] = useState('')
  const [formModel, setFormModel] = useState<'FREE' | 'USAGE' | 'SUBSCRIPTION'>('SUBSCRIPTION')
  const [formPrice, setFormPrice] = useState('49.00')
  const [formQuota, setFormQuota] = useState('100,000 req / mo')
  const [formRateLimit, setFormRateLimit] = useState('50')

  // Archive modal
  const [archivePlanId, setArchivePlanId] = useState<string | null>(null)

  const handleOpenCreate = () => {
    setEditingPlanId(null)
    setFormName('')
    setFormModel('SUBSCRIPTION')
    setFormPrice('49.00')
    setFormQuota('100,000 req / mo')
    setFormRateLimit('50')
    setShowCreateForm(true)
  }

  const handleOpenEdit = (plan: Plan) => {
    setEditingPlanId(plan.id)
    setFormName(plan.name)
    setFormModel(plan.billingModel)
    setFormPrice(plan.priceValue.toString())
    setFormQuota(plan.quota)
    setFormRateLimit(plan.rateLimitPerSec.toString())
    setShowCreateForm(true)
  }

  const handleSavePlan = () => {
    if (!formName) return

    const priceNum = parseFloat(formPrice) || 0
    let priceFormatted = `$${priceNum.toFixed(2)} / mo`
    if (formModel === 'FREE') priceFormatted = '$0.00'
    if (formModel === 'USAGE') priceFormatted = `$${formPrice} / req`

    if (editingPlanId) {
      setPlans((prev) =>
        prev.map((p) =>
          p.id === editingPlanId
            ? {
                ...p,
                name: formName.toUpperCase(),
                billingModel: formModel,
                priceDisplay: priceFormatted,
                priceValue: priceNum,
                quota: formQuota,
                rateLimitPerSec: parseInt(formRateLimit) || 10,
              }
            : p
        )
      )
    } else {
      const newPlan: Plan = {
        id: `plan-${Date.now()}`,
        name: formName.toUpperCase(),
        billingModel: formModel,
        priceDisplay: priceFormatted,
        priceValue: priceNum,
        quota: formQuota,
        rateLimitPerSec: parseInt(formRateLimit) || 10,
        subscribers: 0,
        isActive: true,
        features: [
          'Automatic gateway enforcement',
          `Rate limit: ${formRateLimit} req/s`,
          'Direct Stripe metering sync',
        ],
      }
      setPlans((prev) => [...prev, newPlan])
    }

    setShowCreateForm(false)
    setEditingPlanId(null)
  }

  const handleConfirmArchive = () => {
    if (!archivePlanId) return
    setPlans((prev) => prev.filter((p) => p.id !== archivePlanId))
    setArchivePlanId(null)
  }

  return (
    <div className="space-y-12">
      {/* Header Block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <Hero
          supertitle="PRICING ARCHITECTURE // TIERS & CONTRACTS"
          title="Plans."
          subtitle="Define monetization structures, quotas, and gateway burst constraints for consumers."
          className="pb-0"
        />
        {!showCreateForm && (
          <Button variant="primary" onClick={handleOpenCreate} className="flex items-center gap-2">
            <PlusSignIcon size={16} />
            <span>CREATE NEW PLAN</span>
          </Button>
        )}
      </div>

      {/* Plan Creation / Edit Drawer */}
      {showCreateForm && (
        <section className="border-2 border-black p-8 bg-white animate-in fade-in duration-100 space-y-6">
          <div className="flex items-center justify-between border-b-2 border-black pb-4">
            <h2 className="font-display text-2xl font-bold tracking-tight text-black">
              {editingPlanId ? 'Edit Monetization Tier' : 'Configure New Pricing Plan'}
            </h2>
            <button
              onClick={() => setShowCreateForm(false)}
              className="p-1 hover:bg-black hover:text-white transition-none"
              aria-label="Close form"
            >
              <Cancel01Icon size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="plan-name">PLAN NAME</Label>
              <Input
                id="plan-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. PROFESSIONAL TIER"
                className="mt-2 font-mono text-sm"
              />
            </div>

            <div>
              <Label>BILLING MODEL</Label>
              <div className="flex gap-2 mt-2">
                {(['FREE', 'USAGE', 'SUBSCRIPTION'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setFormModel(m)}
                    className={`flex-1 py-2 font-mono text-xs uppercase tracking-wider border transition-none ${
                      formModel === m
                        ? 'bg-black text-white border-black font-bold'
                        : 'bg-white text-black border-[#E5E5E5] hover:border-black'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="plan-price">
                {formModel === 'USAGE' ? 'PRICE PER CALL (USD)' : 'PRICE PER MONTH (USD)'}
              </Label>
              <Input
                id="plan-price"
                value={formPrice}
                disabled={formModel === 'FREE'}
                onChange={(e) => setFormPrice(e.target.value)}
                placeholder={formModel === 'USAGE' ? '0.002' : '49.00'}
                className="mt-2 font-mono text-sm"
              />
            </div>

            <div>
              <Label htmlFor="plan-quota">MONTHLY INCLUDED QUOTA</Label>
              <Input
                id="plan-quota"
                value={formQuota}
                onChange={(e) => setFormQuota(e.target.value)}
                placeholder="e.g. 50,000 calls / mo"
                className="mt-2 font-mono text-sm"
              />
            </div>

            <div>
              <Label htmlFor="plan-rate">BURST RATE LIMIT (REQ / SEC)</Label>
              <Input
                id="plan-rate"
                type="number"
                value={formRateLimit}
                onChange={(e) => setFormRateLimit(e.target.value)}
                placeholder="50"
                className="mt-2 font-mono text-sm"
              />
            </div>
          </div>

          <div className="border-t border-black pt-6 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowCreateForm(false)}>
              CANCEL
            </Button>
            <Button variant="primary" onClick={handleSavePlan}>
              {editingPlanId ? 'UPDATE PLAN' : 'PUBLISH PLAN'}
            </Button>
          </div>
        </section>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="border-2 border-black bg-white p-8 flex flex-col justify-between relative group hover:bg-[#F5F5F5] transition-none"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#525252] border border-[#E5E5E5] px-2 py-0.5">
                  {plan.billingModel}
                </span>
                <span className="font-mono text-xs font-bold text-black">
                  {plan.subscribers} SUBSCRIBERS
                </span>
              </div>

              {/* Title & Price */}
              <h3 className="font-display text-2xl font-bold tracking-tight text-black mb-2">
                {plan.name}
              </h3>
              <div className="font-mono text-2xl font-bold text-black border-b border-black pb-4 mb-6">
                {plan.priceDisplay}
              </div>

              {/* Limits */}
              <div className="space-y-2 mb-6 font-mono text-xs text-[#525252]">
                <div className="flex justify-between border-b border-[#E5E5E5] pb-1.5">
                  <span>ALLOWANCE:</span>
                  <strong className="text-black">{plan.quota}</strong>
                </div>
                <div className="flex justify-between border-b border-[#E5E5E5] pb-1.5">
                  <span>BURST CEILING:</span>
                  <strong className="text-black">{plan.rateLimitPerSec} req/sec</strong>
                </div>
              </div>

              {/* Feature List */}
              <ul className="space-y-2.5 mb-8">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 font-serif text-xs text-black">
                    <CheckmarkCircle02Icon size={14} className="mt-0.5 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions Bar */}
            <div className="border-t border-black pt-4 flex items-center justify-between mt-auto">
              <button
                onClick={() => setArchivePlanId(plan.id)}
                className="p-2 border border-transparent hover:border-black text-[#525252] hover:text-black transition-none"
                title="Archive Plan"
              >
                <Delete01Icon size={16} />
              </button>
              <Button
                variant="secondary"
                onClick={() => handleOpenEdit(plan)}
                className="text-[10px] py-1.5 px-3 flex items-center gap-1.5"
              >
                <PencilEdit01Icon size={12} />
                <span>EDIT TIER</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <SectionRule thickness="thin" />

      {/* Stripe Connect Settlement Note */}
      <div className="p-6 border border-black bg-white flex flex-col sm:flex-row items-baseline justify-between gap-4">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-black block">
            STRIPE CONNECT INTEGRATION
          </span>
          <p className="font-serif text-sm text-[#525252] mt-1 leading-relaxed">
            All paid subscriber recurring charges and usage metering events are processed through your linked Stripe Connect account with automated weekly payouts.
          </p>
        </div>
        <Link href="/revenue">
          <Button variant="ghost" className="font-mono text-xs uppercase tracking-widest whitespace-nowrap">
            VIEW ESCROW BALANCES &rarr;
          </Button>
        </Link>
      </div>

      {/* Archive Plan Confirm Dialog */}
      <ConfirmDialog
        isOpen={Boolean(archivePlanId)}
        onClose={() => setArchivePlanId(null)}
        onConfirm={handleConfirmArchive}
        title="Archive Pricing Tier?"
        description="Archiving this plan will prevent new subscribers from enrolling. Existing active subscribers will retain their current quota agreements until renewal."
        confirmText="ARCHIVE TIER"
        isDestructive
      />
    </div>
  )
}
