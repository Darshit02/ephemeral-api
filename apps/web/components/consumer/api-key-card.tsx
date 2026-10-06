'use client'

import React, { useState } from 'react'
import { Copy01Icon, EyeIcon, CheckmarkCircle02Icon, LockIcon } from '@/components/icons'
import { toast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'

export interface ApiKeyCardProps {
  apiKey: string
  apiName: string
  planName: string
  createdAt?: string
  onRotate?: () => void
}

export function ApiKeyCard({
  apiKey,
  apiName,
  planName,
  createdAt = 'OCT 01, 2026',
  onRotate,
}: ApiKeyCardProps) {
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState(false)

  const maskedKey = apiKey.length > 14
    ? `${apiKey.substring(0, 9)}••••••••••••••••${apiKey.substring(apiKey.length - 4)}`
    : 'eph_live_••••••••••••••••'

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    toast.success('API key copied to clipboard.')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="border border-black p-6 bg-white space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#525252] block">
            {planName}
          </span>
          <h4 className="font-display text-lg font-bold tracking-tight text-black">
            {apiName}
          </h4>
        </div>
        <span className="font-mono text-[10px] text-[#525252] uppercase">
          CREATED: {createdAt}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-[#F5F5F5] border border-black font-mono text-xs">
        <span className="select-all font-bold text-black break-all">
          {revealed ? apiKey : maskedKey}
        </span>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setRevealed(!revealed)}
            className="p-1.5 border border-[#E5E5E5] hover:border-black hover:bg-black hover:text-white transition-none text-black"
            title={revealed ? 'Hide secret key' : 'Reveal secret key'}
            aria-label="Toggle reveal key"
          >
            <EyeIcon size={14} />
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white hover:bg-white hover:text-black border border-black transition-none uppercase tracking-wider text-[10px]"
          >
            {copied ? <CheckmarkCircle02Icon size={12} /> : <Copy01Icon size={12} />}
            <span>{copied ? 'COPIED' : 'COPY'}</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 font-mono text-[10px] text-[#525252]">
        <span>HEADER: X-API-Key</span>
        {onRotate && (
          <button
            onClick={onRotate}
            className="uppercase tracking-widest text-black underline hover:font-bold transition-none"
          >
            ROTATE KEY &rarr;
          </button>
        )}
      </div>
    </div>
  )
}
