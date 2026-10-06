import React from 'react'
import Link from 'next/link'
import { StatusBadge } from '@/components/publisher/status-badge'
import { Button } from '@/components/ui/button'
import { ArrowRight01Icon } from '@/components/icons'

export interface ConsumerSubscriptionItem {
  id: string
  api_id: string
  api_name: string
  api_slug: string
  plan_name: string
  status: 'ACTIVE' | 'DRAFT' | 'MAINTENANCE' | 'DEPRECATED'
  current_period_end: string
  key_prefix: string
  monthly_spend?: string
}

export function SubscriptionCard({
  subscription,
  onCancel,
}: {
  subscription: ConsumerSubscriptionItem
  onCancel?: (id: string) => void
}) {
  return (
    <div className="border border-black p-6 md:p-8 bg-white flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-2 transition-none group select-none">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#525252]">
            SUBSCRIPTION // {subscription.id}
          </span>
          <StatusBadge status={subscription.status} />
        </div>

        <Link href={`/subscriptions/${subscription.id}`}>
          <h3 className="font-display text-2xl font-bold tracking-tight text-black group-hover:underline">
            {subscription.api_name}
          </h3>
        </Link>

        <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-[#525252] pt-1">
          <span>
            PLAN: <strong className="text-black">{subscription.plan_name}</strong>
          </span>
          <span>&bull;</span>
          <span>
            KEY: <code className="text-black select-all">{subscription.key_prefix}</code>
          </span>
          <span>&bull;</span>
          <span>RENEWS: {subscription.current_period_end}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-[#E5E5E5] justify-end">
        {onCancel && (
          <Button
            variant="ghost"
            onClick={() => onCancel(subscription.id)}
            className="text-xs font-mono uppercase tracking-widest text-[#525252] hover:text-black hover:underline"
          >
            CANCEL
          </Button>
        )}
        <Link href={`/subscriptions/${subscription.id}`}>
          <Button variant="secondary" className="text-xs py-2 px-4 flex items-center gap-1.5">
            <span>MANAGE</span>
            <ArrowRight01Icon size={12} />
          </Button>
        </Link>
      </div>
    </div>
  )
}
