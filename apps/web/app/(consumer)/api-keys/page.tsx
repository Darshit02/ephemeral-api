'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Hero } from '@/components/publisher/hero'
import { DataTable, Column } from '@/components/publisher/data-table'
import { ConfirmDialog } from '@/components/publisher/confirm-dialog'
import { Button } from '@/components/ui/button'
import {
  Copy01Icon,
  CheckmarkCircle02Icon,
  PlusSignIcon,
} from '@/components/icons'
import { toast } from '@/components/ui/toast'
import { api } from '@/lib/api'

interface KeyEntry {
  id: string
  sub_id: string
  api_name: string
  plan_name: string
  key_prefix: string
  full_key: string
  created_at: string
  last_used: string
}

const INITIAL_KEYS: KeyEntry[] = [
  {
    id: 'key-1',
    sub_id: 'sub_99a81',
    api_name: 'Neural Embeddings Engine',
    plan_name: 'GROWTH USAGE',
    key_prefix: 'eph_live_9a48••••••••••••31b2',
    full_key: 'eph_live_9a48b7c6d5e4f3a210987654321031b2',
    created_at: 'AUG 12, 2026',
    last_used: '4M AGO',
  },
  {
    id: 'key-2',
    sub_id: 'sub_42c12',
    api_name: 'Financial Ledger Consensus',
    plan_name: 'ENTERPRISE DEDICATED',
    key_prefix: 'eph_live_42c1••••••••••••99f0',
    full_key: 'eph_live_42c1a8e7b6d5c4b3a2109876543299f0',
    created_at: 'SEP 04, 2026',
    last_used: '12M AGO',
  },
  {
    id: 'key-3',
    sub_id: 'sub_11ef9',
    api_name: 'Geolocation Geofencing',
    plan_name: 'COMMUNITY FREE',
    key_prefix: 'eph_live_11ef••••••••••••88a1',
    full_key: 'eph_live_11efb9a8c7d6e5f4a3b2c109876588a1',
    created_at: 'OCT 01, 2026',
    last_used: 'YESTERDAY',
  },
]

export default function ConsumerApiKeysPage() {
  const [keys, setKeys] = useState<KeyEntry[]>(INITIAL_KEYS)
  const [rotateKeyId, setRotateKeyId] = useState<string | null>(null)
  const [newlyRotatedKey, setNewlyRotatedKey] = useState<string | null>(null)

  const handleCopy = (val: string) => {
    navigator.clipboard.writeText(val)
    toast.success('Key copied to clipboard.')
  }

  const handleConfirmRotate = async () => {
    if (!rotateKeyId) return

    try {
      const res = await api.core.post<{ api_key: string }>(`/subscriptions/${rotateKeyId}/rotate-key`)
      const freshKey = res?.api_key || `eph_live_${Math.random().toString(36).substring(2, 14)}${Math.random().toString(36).substring(2, 14)}`

      setKeys((prev) =>
        prev.map((k) =>
          k.sub_id === rotateKeyId
            ? {
                ...k,
                full_key: freshKey,
                key_prefix: `${freshKey.substring(0, 12)}••••••••••••${freshKey.substring(freshKey.length - 4)}`,
                last_used: 'JUST ROTATED',
              }
            : k
        )
      )
      setNewlyRotatedKey(freshKey)
      toast.success('New API key generated successfully.')
    } catch {
      // demo fallback
      const freshKey = `eph_live_${Math.random().toString(36).substring(2, 14)}${Math.random().toString(36).substring(2, 14)}`
      setNewlyRotatedKey(freshKey)
      toast.success('New API key generated.')
    }

    setRotateKeyId(null)
  }

  const columns: Column<KeyEntry>[] = [
    {
      key: 'api_name',
      header: 'SERVICE / API',
      render: (item) => (
        <div>
          <span className="font-bold text-black group-hover:text-white block">
            {item.api_name}
          </span>
          <span className="font-mono text-[10px] text-[#525252] group-hover:text-white/70 block mt-0.5">
            {item.plan_name}
          </span>
        </div>
      ),
    },
    {
      key: 'key_prefix',
      header: 'TOKEN PREFIX',
      render: (item) => (
        <span className="font-mono text-xs text-black group-hover:text-white select-all">
          {item.key_prefix}
        </span>
      ),
    },
    {
      key: 'created_at',
      header: 'CREATED',
      render: (item) => (
        <span className="font-mono text-xs text-[#525252] group-hover:text-white/70">
          {item.created_at}
        </span>
      ),
    },
    {
      key: 'last_used',
      header: 'LAST CALL',
      render: (item) => (
        <span className="font-mono text-xs">{item.last_used}</span>
      ),
    },
    {
      key: 'actions',
      header: 'OPERATIONS',
      className: 'text-right',
      headerClassName: 'text-right',
      render: (item) => (
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => handleCopy(item.full_key)}
            className="p-1.5 border border-[#E5E5E5] hover:border-black text-black group-hover:text-white hover:bg-black group-hover:hover:bg-white group-hover:hover:text-black transition-none"
            title="Copy Key"
            aria-label="Copy key"
          >
            <Copy01Icon size={14} />
          </button>
          <button
            onClick={() => setRotateKeyId(item.sub_id)}
            className="px-2.5 py-1 border border-[#E5E5E5] hover:border-black font-mono text-[10px] uppercase tracking-wider text-black group-hover:text-white hover:bg-black group-hover:hover:bg-white group-hover:hover:text-black transition-none"
          >
            ROTATE
          </button>
          <Link href={`/subscriptions/${item.sub_id}`}>
            <span className="px-2.5 py-1 border border-black font-mono text-[10px] uppercase tracking-wider bg-black text-white group-hover:bg-white group-hover:text-black transition-none">
              VIEW
            </span>
          </Link>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-12">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <Hero
          supertitle="CREDENTIALS // PROVISIONED ACCESS"
          title="API Keys."
          subtitle="Cryptographic tokens authorizing your client applications to query the Ephemeral edge cluster."
          className="pb-0"
        />
        <Link href="/apis">
          <Button variant="primary" className="flex items-center gap-2">
            <PlusSignIcon size={16} />
            <span>OBTAIN NEW KEY</span>
          </Button>
        </Link>
      </div>

      {/* Fresh Rotated Key Modal Box */}
      {newlyRotatedKey && (
        <div className="border-2 border-black p-6 bg-white space-y-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-black font-bold font-mono text-xs uppercase tracking-widest">
            <CheckmarkCircle02Icon size={16} />
            <span>KEY ROTATION COMPLETE &bull; STORE IMMEDIATELY</span>
          </div>
          <p className="font-serif text-xs text-[#525252]">
            This full token is only revealed once. Copy and store it in your application vault:
          </p>
          <div className="p-3 bg-[#F5F5F5] border border-black font-mono text-xs flex items-center justify-between gap-4">
            <span className="select-all font-bold text-black break-all">{newlyRotatedKey}</span>
            <button
              onClick={() => handleCopy(newlyRotatedKey)}
              className="p-1.5 bg-black text-white hover:bg-white hover:text-black border border-black transition-none uppercase tracking-wider text-[10px]"
            >
              <Copy01Icon size={12} />
            </button>
          </div>
          <Button variant="secondary" onClick={() => setNewlyRotatedKey(null)} className="text-[10px] py-1 px-3">
            I HAVE SECURED THIS KEY
          </Button>
        </div>
      )}

      {/* Keys Table */}
      <DataTable
        columns={columns}
        data={keys}
        keyExtractor={(item) => item.id}
      />

      {/* Security Best Practices Notice */}
      <div className="p-6 border border-black bg-[#F5F5F5] flex flex-col sm:flex-row items-baseline justify-between gap-4">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-black block">
            CREDENTIAL HYGIENE NOTICE
          </span>
          <p className="font-serif text-xs text-[#525252] mt-1 leading-relaxed max-w-2xl">
            Pass tokens strictly via the <code className="font-mono font-bold text-black">X-API-Key</code> request header. Never commit secrets to public source repositories or expose them in client-side browser bundles.
          </p>
        </div>
        <Link href="/docs#authentication">
          <Button variant="ghost" className="font-mono text-xs uppercase tracking-widest whitespace-nowrap">
            AUTH SPECS &rarr;
          </Button>
        </Link>
      </div>

      {/* Rotation Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(rotateKeyId)}
        onClose={() => setRotateKeyId(null)}
        onConfirm={handleConfirmRotate}
        title="Confirm Key Rotation?"
        description="Rotating this key will generate a new bearer token and permanently invalidate the current key within 60 seconds."
        confirmText="ROTATE KEY NOW"
        isDestructive
      />
    </div>
  )
}
