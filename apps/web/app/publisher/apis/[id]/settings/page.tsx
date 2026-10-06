'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Hero } from '@/components/publisher/hero'
import { SectionRule } from '@/components/publisher/section-rule'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/publisher/confirm-dialog'
import {
  CheckmarkCircle02Icon,
  Alert02Icon,
  Key01Icon,
} from '@/components/icons'

type ApiStatus = 'ACTIVE' | 'DRAFT' | 'MAINTENANCE' | 'DEPRECATED'

export default function ApiSettingsPage() {
  const router = useRouter()

  // Form states
  const [name, setName] = useState('Neural Embeddings Engine')
  const [slug, setSlug] = useState('neural-embeddings')
  const [description, setDescription] = useState(
    'High-dimensional text and multimodal vector embedding generation with sub-15ms p50 latency and cosine similarity search.'
  )
  const [upstreamUrl, setUpstreamUrl] = useState('https://origin.internal-ml.network/v1')
  const [customHeader, setCustomHeader] = useState('X-Origin-Token: sk_live_secure_9011')
  const [healthPath, setHealthPath] = useState('/healthz')
  const [timeoutSec, setTimeoutSec] = useState('30')
  const [status, setStatus] = useState<ApiStatus>('ACTIVE')

  // Status message
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Danger zone modals
  const [showDeprecateModal, setShowDeprecateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleSave = () => {
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2500)
  }

  const handleConfirmDeprecate = () => {
    setStatus('DEPRECATED')
  }

  const handleConfirmDelete = () => {
    router.push('/publisher/apis')
  }

  return (
    <div className="space-y-12 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <Hero
          supertitle="LIFECYCLE // SERVICE ORCHESTRATION"
          title="Settings."
          subtitle="Configure upstream host routing, custom gateway headers, lifecycle status, and service teardown."
          className="pb-0"
        />
        {saveSuccess && (
          <div className="flex items-center gap-2 p-3 border border-black bg-black text-white font-mono text-xs uppercase tracking-widest animate-in fade-in">
            <CheckmarkCircle02Icon size={14} />
            <span>CHANGES PROPAGATED</span>
          </div>
        )}
      </div>

      {/* Section 1: General Info */}
      <section className="space-y-6">
        <div className="border-b-2 border-black pb-3">
          <h2 className="font-display text-xl font-bold tracking-tight text-black">
            01. Identity &amp; Routing
          </h2>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="api-name">SERVICE NAME</Label>
            <Input
              id="api-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 text-base font-medium"
            />
          </div>

          <div>
            <Label htmlFor="api-slug">PUBLIC ROUTING SLUG</Label>
            <div className="mt-2 flex items-baseline">
              <span className="font-mono text-xs text-[#525252] select-none mr-2">
                gateway.ephemeral.network/v1/
              </span>
              <Input
                id="api-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
            <p className="font-mono text-[10px] text-[#525252] mt-1.5 uppercase tracking-wider">
              Warning: Modifying slug updates edge route forwarding. Existing client calls to the previous slug will fail.
            </p>
          </div>

          <div>
            <Label htmlFor="api-desc">EDITORIAL DESCRIPTION</Label>
            <Textarea
              id="api-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 font-serif text-sm leading-relaxed"
            />
          </div>
        </div>
      </section>

      <SectionRule thickness="thin" />

      {/* Section 2: Origin Gateway Target & Injected Headers */}
      <section className="space-y-6">
        <div className="border-b-2 border-black pb-3">
          <h2 className="font-display text-xl font-bold tracking-tight text-black">
            02. Upstream Origin &amp; Security Injection
          </h2>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="upstream-url">UPSTREAM TARGET URL</Label>
            <Input
              id="upstream-url"
              value={upstreamUrl}
              onChange={(e) => setUpstreamUrl(e.target.value)}
              className="mt-2 font-mono text-sm"
            />
          </div>

          <div>
            <Label htmlFor="custom-header">GATEWAY INJECTED UPSTREAM HEADER</Label>
            <Input
              id="custom-header"
              value={customHeader}
              onChange={(e) => setCustomHeader(e.target.value)}
              placeholder="Header-Name: header-value"
              className="mt-2 font-mono text-sm"
            />
            <p className="font-mono text-[10px] text-[#525252] mt-1.5 uppercase tracking-wider">
              Ephemeral edge proxy attaches this secret header when forwarding calls to verify origin authenticity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="health-path">HEALTH PROBE ENDPOINT</Label>
              <Input
                id="health-path"
                value={healthPath}
                onChange={(e) => setHealthPath(e.target.value)}
                className="mt-2 font-mono text-sm"
              />
            </div>
            <div>
              <Label htmlFor="timeout-sec">GATEWAY TIMEOUT (SECONDS)</Label>
              <Input
                id="timeout-sec"
                type="number"
                value={timeoutSec}
                onChange={(e) => setTimeoutSec(e.target.value)}
                className="mt-2 font-mono text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      <SectionRule thickness="thin" />

      {/* Section 3: Status & Lifecycle */}
      <section className="space-y-6">
        <div className="border-b-2 border-black pb-3">
          <h2 className="font-display text-xl font-bold tracking-tight text-black">
            03. Service Lifecycle Status
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              id: 'ACTIVE' as ApiStatus,
              title: 'ACTIVE',
              desc: 'Publicly listed in marketplace. Gateway routes all valid subscriber keys.',
            },
            {
              id: 'DRAFT' as ApiStatus,
              title: 'DRAFT',
              desc: 'Delisted from discovery catalog. Gateway accepts only internal publisher test keys.',
            },
            {
              id: 'MAINTENANCE' as ApiStatus,
              title: 'MAINTENANCE',
              desc: 'Temporary pause. Gateway returns HTTP 503 Service Unavailable with Retry-After header.',
            },
            {
              id: 'DEPRECATED' as ApiStatus,
              title: 'DEPRECATED',
              desc: 'Sunset phase. Gateway returns Sunset warning headers. No new subscriptions allowed.',
            },
          ].map((st) => {
            const isSelected = status === st.id
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setStatus(st.id)}
                className={`p-5 text-left border transition-none flex flex-col justify-between ${
                  isSelected
                    ? 'bg-black text-white border-black font-semibold'
                    : 'bg-white text-black border-black hover:bg-[#F5F5F5]'
                }`}
              >
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest block mb-2 font-bold">
                    {st.title}
                  </span>
                  <p className={`font-serif text-xs leading-relaxed ${isSelected ? 'text-[#D4D4D4]' : 'text-[#525252]'}`}>
                    {st.desc}
                  </p>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest mt-4 block">
                  {isSelected ? '&bull; CURRENT STATUS' : '+ SWITCH STATUS'}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <div className="border-t-2 border-black pt-6 flex justify-end">
        <Button variant="primary" onClick={handleSave}>
          SAVE CONFIGURATION CHANGES
        </Button>
      </div>

      <SectionRule thickness="thick" />

      {/* Section 4: Danger Zone */}
      <section className="border-2 border-black p-8 bg-white space-y-6">
        <div className="flex items-center gap-3 border-b-2 border-black pb-4">
          <div className="p-2 bg-black text-white">
            <Alert02Icon size={18} />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-black">
              Danger Zone
            </h2>
            <p className="font-mono text-xs text-[#525252] uppercase tracking-widest mt-0.5">
              Irreversible lifecycle and data purge operations
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-6">
            <div>
              <h3 className="font-display text-base font-bold text-black">
                Deprecate Service
              </h3>
              <p className="font-serif text-xs text-[#525252] mt-1 leading-relaxed max-w-md">
                Marks the API as deprecated. Signals sunset to all consumers via response headers and halts new subscriber registrations.
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => setShowDeprecateModal(true)}
              className="whitespace-nowrap"
            >
              DEPRECATE API
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-base font-bold text-black">
                Permanently Delete API
              </h3>
              <p className="font-serif text-xs text-[#525252] mt-1 leading-relaxed max-w-md">
                Deletes this API record, cancels all active subscriber agreements, removes proxy routes from the edge cluster, and purges Redis metering keys.
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowDeleteModal(true)}
              className="whitespace-nowrap bg-black text-white hover:bg-white hover:text-black border-2 border-black"
            >
              DELETE SERVICE
            </Button>
          </div>
        </div>
      </section>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={showDeprecateModal}
        onClose={() => setShowDeprecateModal(false)}
        onConfirm={handleConfirmDeprecate}
        title="Confirm Service Deprecation"
        description="Are you certain you want to deprecate this API? It will remain accessible to existing subscribers but will be delisted from the marketplace."
        confirmText="DEPRECATE"
      />

      <ConfirmDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Permanently Delete API?"
        description={`This action is instantaneous and cannot be undone. All active subscriber keys will be immediately revoked. Type "${slug}" below to confirm deletion:`}
        requiredConfirmString={slug}
        confirmText="PERMANENTLY DELETE"
        isDestructive
      />
    </div>
  )
}
