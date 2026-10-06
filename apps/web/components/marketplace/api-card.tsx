import React from 'react'
import Link from 'next/link'
import { ArrowUpRight01Icon } from '@/components/icons'

export interface ApiListingItem {
  id: string
  name: string
  slug: string
  description: string
  provider_name?: string
  plan_count?: number
  category?: string
  status?: string
}

export function ApiCard({ api }: { api: ApiListingItem }) {
  return (
    <Link
      href={`/apis/${api.slug}`}
      className="group block border border-black p-8 bg-white transition-colors duration-100 hover:bg-black hover:text-white flex flex-col justify-between select-none"
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#525252] group-hover:text-white/70">
            {api.category || 'API SERVICE'}
          </span>
          <ArrowUpRight01Icon
            size={16}
            className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
          />
        </div>

        <h3 className="font-display text-2xl font-bold tracking-tight text-black group-hover:text-white mt-2">
          {api.name}
        </h3>

        <p className="mt-4 font-serif text-sm text-[#525252] group-hover:text-white/80 line-clamp-3 leading-relaxed">
          {api.description}
        </p>
      </div>

      <div className="mt-8 pt-4 border-t border-[#E5E5E5] group-hover:border-[#333333] flex items-center justify-between font-mono text-xs uppercase tracking-widest text-[#525252] group-hover:text-white/70">
        <span className="truncate max-w-[140px]">{api.provider_name || 'Verified Provider'}</span>
        <span>{api.plan_count ?? 3} plans</span>
      </div>
    </Link>
  )
}
