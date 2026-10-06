'use client'

import React from 'react'

export interface ApiPlanItem {
  id: string
  name: string
  price: string
  period?: string
  quota?: string
  rateLimit?: string
  billingModel?: string
}

export interface PlanSelectorProps {
  plans: ApiPlanItem[]
  selectedPlanId: string
  onSelectPlan: (planId: string) => void
}

export function PlanSelector({
  plans,
  selectedPlanId,
  onSelectPlan,
}: PlanSelectorProps) {
  return (
    <div className="space-y-4">
      {plans.map((plan) => {
        const isSelected = selectedPlanId === plan.id
        return (
          <div
            key={plan.id}
            onClick={() => onSelectPlan(plan.id)}
            className={`border p-6 cursor-pointer transition-colors duration-100 flex flex-col justify-between select-none ${
              isSelected
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-[#E5E5E5] hover:border-black'
            }`}
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <span className={`font-mono text-[9px] uppercase tracking-widest ${
                  isSelected ? 'text-[#A3A3A3]' : 'text-[#525252]'
                }`}>
                  {plan.billingModel || 'SUBSCRIPTION TIER'}
                </span>
                <h4 className="font-display text-xl font-bold tracking-tight mt-0.5">
                  {plan.name}
                </h4>
              </div>

              <div className="text-right">
                <span className="font-display text-2xl font-bold leading-none">
                  {plan.price}
                </span>
                <span className={`font-mono text-xs block ${
                  isSelected ? 'text-[#A3A3A3]' : 'text-[#525252]'
                }`}>
                  {plan.period || '/mo'}
                </span>
              </div>
            </div>

            <div className={`mt-4 pt-3 border-t flex items-center justify-between font-mono text-[10px] uppercase tracking-wider ${
              isSelected ? 'border-[#333333] text-[#A3A3A3]' : 'border-[#E5E5E5] text-[#525252]'
            }`}>
              <span>Quota: {plan.quota || 'Unlimited'}</span>
              <span>Burst: {plan.rateLimit || '100 req/s'}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
