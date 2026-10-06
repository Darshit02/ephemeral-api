'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Hero } from '@/components/publisher/hero'
import { SectionRule } from '@/components/publisher/section-rule'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { StatusBadge } from '@/components/publisher/status-badge'
import {
  File01Icon,
  CheckmarkCircle02Icon,
  Alert02Icon,
  ArrowRight01Icon,
} from '@/components/icons'

const CATEGORIES = [
  'MACHINE LEARNING',
  'FINTECH',
  'GEOSPATIAL',
  'SECURITY',
  'DEVELOPER TOOLS',
  'DATA & ANALYTICS',
]

export default function NewApiPage() {
  const router = useRouter()

  // Form State
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState('MACHINE LEARNING')
  const [description, setDescription] = useState('')
  const [upstreamUrl, setUpstreamUrl] = useState('')
  const [healthPath, setHealthPath] = useState('/healthz')
  const [timeoutSec, setTimeoutSec] = useState('30')
  const [openApiSpec, setOpenApiSpec] = useState('')
  const [pricingModel, setPricingModel] = useState<'FREE' | 'PAYG' | 'MONTHLY'>('PAYG')

  // Upstream ping status
  const [pingStatus, setPingStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNameChange = (val: string) => {
    setName(val)
    if (!slug || slug === val.slice(0, -1).toLowerCase().replace(/[^a-z0-9]/g, '-')) {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      )
    }
  }

  const handleTestConnection = () => {
    if (!upstreamUrl) return
    setPingStatus('testing')
    setTimeout(() => {
      if (upstreamUrl.startsWith('https://') || upstreamUrl.startsWith('http://')) {
        setPingStatus('success')
      } else {
        setPingStatus('failed')
      }
    }, 600)
  }

  const handlePublish = (asDraft: boolean) => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      router.push('/apis')
    }, 500)
  }

  return (
    <div className="space-y-12">
      {/* Editorial Header */}
      <Hero
        supertitle="REGISTRATION // SERVICE INTAKE"
        title="Publish."
        subtitle="Declare your origin gateway route, contract schema, and initial monetization tier."
        className="pb-0"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Main 2-Column Form */}
        <div className="lg:col-span-2 space-y-12">
          {/* Section 1: General Details */}
          <section className="space-y-6">
            <div className="border-b-2 border-black pb-3">
              <h2 className="font-display text-xl font-bold tracking-tight text-black">
                01. General Identity
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="api-name">SERVICE NAME</Label>
                <Input
                  id="api-name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Neural Embeddings Engine"
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
                    placeholder="neural-embeddings"
                    className="font-mono text-sm"
                  />
                </div>
              </div>

              <div>
                <Label>PRIMARY TAXONOMY / CATEGORY</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                  {CATEGORIES.map((cat) => {
                    const isSelected = category === cat
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`py-2.5 px-3 text-left font-mono text-[11px] uppercase tracking-wider border transition-none ${
                          isSelected
                            ? 'bg-black text-white border-black font-semibold'
                            : 'bg-white text-black border-[#E5E5E5] hover:border-black'
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <Label htmlFor="api-desc">EDITORIAL DESCRIPTION &amp; VALUE PROPOSITION</Label>
                <Textarea
                  id="api-desc"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe precision, capabilities, latency guarantees, and targeted use cases..."
                  className="mt-2 font-serif text-sm leading-relaxed"
                />
              </div>
            </div>
          </section>

          <SectionRule thickness="thin" />

          {/* Section 2: Upstream Gateway Origin */}
          <section className="space-y-6">
            <div className="border-b-2 border-black pb-3">
              <h2 className="font-display text-xl font-bold tracking-tight text-black">
                02. Upstream Origin Proxy
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="upstream-url">UPSTREAM TARGET URL (ORIGIN HOST)</Label>
                  {pingStatus === 'success' && (
                    <span className="font-mono text-[10px] uppercase tracking-widest text-black font-bold flex items-center gap-1">
                      <CheckmarkCircle02Icon size={14} /> 200 OK (24MS)
                    </span>
                  )}
                  {pingStatus === 'failed' && (
                    <span className="font-mono text-[10px] uppercase tracking-widest text-black underline flex items-center gap-1">
                      <Alert02Icon size={14} /> UNREACHABLE
                    </span>
                  )}
                </div>
                <div className="mt-2 flex gap-3">
                  <Input
                    id="upstream-url"
                    value={upstreamUrl}
                    onChange={(e) => setUpstreamUrl(e.target.value)}
                    placeholder="https://api.internal-provider.io/v1"
                    className="font-mono text-sm flex-1"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleTestConnection}
                    disabled={!upstreamUrl || pingStatus === 'testing'}
                    className="whitespace-nowrap text-xs"
                  >
                    {pingStatus === 'testing' ? 'TESTING...' : 'PING HOST'}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="health-path">HEALTH CHECK PROBE PATH</Label>
                  <Input
                    id="health-path"
                    value={healthPath}
                    onChange={(e) => setHealthPath(e.target.value)}
                    placeholder="/healthz"
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
                    placeholder="30"
                    className="mt-2 font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </section>

          <SectionRule thickness="thin" />

          {/* Section 3: OpenAPI 3.x Contract */}
          <section className="space-y-6">
            <div className="border-b-2 border-black pb-3">
              <h2 className="font-display text-xl font-bold tracking-tight text-black">
                03. Contract Schema (OpenAPI 3.x)
              </h2>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-black p-8 text-center bg-white hover:bg-[#F5F5F5] cursor-pointer transition-none">
                <File01Icon size={28} className="mx-auto mb-3" />
                <p className="font-display text-base font-bold text-black">
                  Drag &amp; Drop OpenAPI 3.0 / Swagger YAML or JSON
                </p>
                <p className="font-mono text-xs text-[#525252] mt-1 uppercase tracking-wider">
                  Or paste specification below to generate interactive consumer docs
                </p>
              </div>

              <div>
                <Label htmlFor="openapi-spec">RAW SPECIFICATION DEFINITION</Label>
                <Textarea
                  id="openapi-spec"
                  rows={6}
                  value={openApiSpec}
                  onChange={(e) => setOpenApiSpec(e.target.value)}
                  placeholder={`openapi: 3.0.3\ninfo:\n  title: Service Interface\n  version: 1.0.0\npaths:\n  /v1/predict:\n    post:\n      summary: Execute prediction`}
                  className="mt-2 font-mono text-xs leading-relaxed"
                />
              </div>
            </div>
          </section>

          <SectionRule thickness="thin" />

          {/* Section 4: Initial Pricing Strategy */}
          <section className="space-y-6">
            <div className="border-b-2 border-black pb-3">
              <h2 className="font-display text-xl font-bold tracking-tight text-black">
                04. Default Monetization Architecture
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  id: 'FREE',
                  title: 'FREE COMMUNITY',
                  desc: 'Zero-cost public tier with tight burst rate limiting.',
                },
                {
                  id: 'PAYG',
                  title: 'PAY-AS-YOU-GO',
                  desc: 'Metered per request with automated Stripe usage settlement.',
                },
                {
                  id: 'MONTHLY',
                  title: 'RECURRING MONTHLY',
                  desc: 'Fixed monthly fee with a high-capacity base quota.',
                },
              ].map((model) => {
                const isSelected = pricingModel === model.id
                return (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => setPricingModel(model.id as 'FREE' | 'PAYG' | 'MONTHLY')}
                    className={`p-5 text-left border transition-none flex flex-col justify-between ${
                      isSelected
                        ? 'bg-black text-white border-black font-semibold'
                        : 'bg-white text-black border-black hover:bg-[#F5F5F5]'
                    }`}
                  >
                    <div>
                      <span className="font-mono text-xs uppercase tracking-widest block mb-2 font-bold">
                        {model.title}
                      </span>
                      <p className={`font-serif text-xs leading-relaxed ${isSelected ? 'text-[#D4D4D4]' : 'text-[#525252]'}`}>
                        {model.desc}
                      </p>
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-widest mt-4 block">
                      {isSelected ? '&bull; SELECTED' : '+ CHOOSE'}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

          {/* Form Submit Footer */}
          <div className="border-t-2 border-black pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Link href="/apis">
              <Button variant="ghost" className="font-mono text-xs uppercase tracking-widest">
                &larr; CANCEL &amp; RETURN
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                disabled={isSubmitting}
                onClick={() => handlePublish(true)}
              >
                SAVE AS DRAFT
              </Button>
              <Button
                variant="primary"
                disabled={isSubmitting || !name || !slug}
                onClick={() => handlePublish(false)}
                className="flex items-center gap-2"
              >
                <span>PUBLISH TO GATEWAY</span>
                <ArrowRight01Icon size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Sticky Live Consumer Preview Card (Right Column) */}
        <div className="lg:col-span-1 sticky top-8 space-y-6">
          <div className="border-b border-black pb-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#525252]">
              LIVE CONSUMER PREVIEW
            </span>
          </div>

          <div className="border-2 border-black bg-white p-6 relative">
            <div className="flex items-start justify-between gap-3 mb-3">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#525252]">
                {category}
              </span>
              <StatusBadge status="ACTIVE" />
            </div>

            <h3 className="font-display text-xl font-bold tracking-tight text-black">
              {name || 'Service Title Preview'}
            </h3>
            <span className="font-mono text-xs text-[#525252] block mt-1">
              /{slug || 'service-slug'}
            </span>

            <p className="font-serif text-xs text-[#525252] mt-4 leading-relaxed line-clamp-3">
              {description || 'Comprehensive API description and capabilities will appear here in high-contrast editorial serif typography.'}
            </p>

            <div className="border-t border-[#E5E5E5] mt-6 pt-4 space-y-2">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-[#525252]">MONETIZATION:</span>
                <span className="font-bold text-black">{pricingModel}</span>
              </div>
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-[#525252]">PROXIED ROUTE:</span>
                <span className="font-bold text-black truncate max-w-[140px]" title={upstreamUrl || 'None'}>
                  {upstreamUrl || 'Not configured'}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-black bg-[#F5F5F5] -mx-6 -mb-6 p-4">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#525252] block mb-1">
                EDGE ROUTE:
              </span>
              <code className="font-mono text-[10px] text-black break-all block">
                https://gateway.ephemeral.network/v1/{slug || '...'}
              </code>
            </div>
          </div>

          <div className="border border-black p-4 bg-black text-white">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#A3A3A3] block mb-1">
              GATEWAY PROVISIONING
            </span>
            <p className="font-serif text-xs leading-relaxed text-[#D4D4D4]">
              Upon publication, the Edge Gateway immediately provisions Redis rate limit keys and route forwarding tables with zero downtime.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
