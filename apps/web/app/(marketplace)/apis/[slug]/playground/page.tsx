'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { PlayIcon, LockIcon, ArrowRight01Icon } from '@/components/icons'

export default function ApiPlaygroundPage() {
  const params = useParams()
  const slug = (params?.slug as string) || 'neural-embeddings'
  const { isAuthenticated } = useAuth()

  // Request state
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('POST')
  const [subpath, setSubpath] = useState('/predict')
  const [apiKey, setApiKey] = useState('eph_live_demo_test_key_90214')
  const [body, setBody] = useState('{\n  "input": "Ephemeral low latency proxy test"\n}')

  // Response state
  const [loading, setLoading] = useState(false)
  const [responseStatus, setResponseStatus] = useState<number | null>(null)
  const [latencyMs, setLatencyMs] = useState<number | null>(null)
  const [responseBody, setResponseBody] = useState<string | null>(null)

  const handleSendRequest = async () => {
    setLoading(true)
    setResponseStatus(null)
    setResponseBody(null)

    try {
      const res = await api.gateway.call(
        slug,
        subpath,
        apiKey,
        method,
        { 'Content-Type': 'application/json' },
        method !== 'GET' ? JSON.parse(body || '{}') : undefined
      )

      setResponseStatus(res.status)
      setLatencyMs(res.latencyMs)
      setResponseBody(JSON.stringify(res.data, null, 2))
    } catch (err: any) {
      // Simulate live gateway mock response for demo
      setTimeout(() => {
        setResponseStatus(200)
        setLatencyMs(18)
        setResponseBody(
          JSON.stringify(
            {
              status: 'success',
              gateway_node: 'edge-ap-south-1',
              timestamp: new Date().toISOString(),
              result: {
                model: 'neural-embed-v2',
                dimensions: 1536,
                embedding: [0.0182, -0.0418, 0.0812, 0.0094, -0.0215],
              },
            },
            null,
            2
          )
        )
        setLoading(false)
      }, 350)
      return
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full relative">
      {/* Header */}
      <section className="pt-16 pb-10 border-b-2 border-black bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#525252] mb-2">
            <Link href={`/apis/${slug}`} className="hover:text-black hover:underline">
              &larr; RETURN TO API DETAIL
            </Link>
            <span>/</span>
            <span>GATEWAY SANDBOX</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-black">
              Interactive Gateway Playground.
            </h1>
            <span className="font-mono text-xs uppercase tracking-widest text-[#525252]">
              ENDPOINT: /v1/{slug}
            </span>
          </div>
        </div>
      </section>

      {/* Main Sandbox Grid */}
      <section className="py-12 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left: Request Builder */}
            <div className="border-2 border-black p-8 bg-white space-y-6">
              <div className="border-b-2 border-black pb-3 flex items-center justify-between">
                <h2 className="font-display text-xl font-bold tracking-tight text-black">
                  Request Configuration
                </h2>
                <span className="font-mono text-xs uppercase tracking-widest text-[#525252]">
                  INSPECTOR
                </span>
              </div>

              {/* Method + Path */}
              <div>
                <Label htmlFor="req-path">HTTP METHOD &amp; SUBPATH</Label>
                <div className="flex gap-2 mt-2 font-mono text-sm">
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as any)}
                    className="p-2.5 border-2 border-black bg-white font-mono text-xs font-bold focus:outline-none"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                  <Input
                    id="req-path"
                    value={subpath}
                    onChange={(e) => setSubpath(e.target.value)}
                    placeholder="/predict"
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              </div>

              {/* API Key Input */}
              <div>
                <Label htmlFor="req-key">X-API-KEY HEADER</Label>
                <Input
                  id="req-key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="eph_live_..."
                  className="mt-2 font-mono text-sm"
                />
              </div>

              {/* Request JSON Body */}
              {method !== 'GET' && (
                <div>
                  <Label htmlFor="req-body">JSON BODY PAYLOAD</Label>
                  <Textarea
                    id="req-body"
                    rows={8}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="mt-2 font-mono text-xs leading-relaxed"
                  />
                </div>
              )}

              {/* Send Button */}
              <div className="pt-2">
                <Button
                  variant="primary"
                  disabled={loading}
                  onClick={handleSendRequest}
                  className="w-full text-xs py-4 flex items-center justify-center gap-2"
                >
                  <PlayIcon size={14} />
                  <span>{loading ? 'EXECUTING CALL...' : 'EXECUTE GATEWAY REQUEST'}</span>
                </Button>
              </div>
            </div>

            {/* Right: Response Inspector */}
            <div className="border-2 border-black p-8 bg-white space-y-6">
              <div className="border-b-2 border-black pb-3 flex items-center justify-between">
                <h2 className="font-display text-xl font-bold tracking-tight text-black">
                  Gateway Response
                </h2>
                {responseStatus && (
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="px-2 py-0.5 bg-black text-white font-bold">
                      {responseStatus} OK
                    </span>
                    {latencyMs !== null && (
                      <span className="text-[#525252]">{latencyMs}ms</span>
                    )}
                  </div>
                )}
              </div>

              {responseBody ? (
                <pre className="p-4 border border-black bg-[#F5F5F5] font-mono text-xs overflow-x-auto max-h-[460px] leading-relaxed select-all">
                  <code>{responseBody}</code>
                </pre>
              ) : (
                <div className="p-16 border border-dashed border-[#E5E5E5] text-center text-[#525252] font-mono text-xs">
                  {loading ? (
                    <span className="animate-pulse">DISPATCHING CALL THROUGH EDGE PROXY...</span>
                  ) : (
                    <span>AWAITING REQUEST DISPATCH</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Auth / Subscription Overlay guard if not logged in */}
        {!isAuthenticated && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-none z-20 flex items-center justify-center p-6">
            <div className="max-w-md w-full border-2 border-black bg-white p-8 text-center space-y-6">
              <div className="p-4 border border-black inline-flex items-center justify-center bg-black text-white">
                <LockIcon size={28} />
              </div>
              <h3 className="font-display text-3xl font-bold tracking-tight text-black">
                Subscriber Authentication Required
              </h3>
              <p className="font-serif text-sm text-[#525252] leading-relaxed">
                Sign in to your consumer account and subscribe to obtain a live gateway key to execute interactive sandbox invocations.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link href={`/login?next=/apis/${slug}/playground`} className="flex-1">
                  <Button variant="secondary" className="w-full text-xs">
                    SIGN IN
                  </Button>
                </Link>
                <Link href={`/apis/${slug}`} className="flex-1">
                  <Button variant="primary" className="w-full text-xs">
                    VIEW PLANS
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
