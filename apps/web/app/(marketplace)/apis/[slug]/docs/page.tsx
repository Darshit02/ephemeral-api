'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { CodeBlock } from '@/components/marketplace/code-block'
import { Button } from '@/components/ui/button'
import { PlayIcon, ArrowRight01Icon } from '@/components/icons'

interface EndpointSpec {
  id: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  summary: string
  description: string
  parameters: { name: string; in: string; required: boolean; type: string; desc: string }[]
  requestBodyExample?: string
  responseExample: string
}

const SAMPLE_ENDPOINTS: EndpointSpec[] = [
  {
    id: 'ep-1',
    method: 'POST',
    path: '/predict',
    summary: 'Generate Semantic Embeddings',
    description:
      'Generates normalized 1536-dimensional vector embeddings for submitted text strings using transformer architectures.',
    parameters: [
      {
        name: 'X-API-Key',
        in: 'header',
        required: true,
        type: 'string',
        desc: 'Subscriber bearer token issued upon plan enrollment.',
      },
    ],
    requestBodyExample: '{\n  "model": "neural-embed-v2",\n  "input": "Ephemeral decentralized API exchange",\n  "dimensions": 1536\n}',
    responseExample: '{\n  "object": "list",\n  "data": [\n    {\n      "index": 0,\n      "embedding": [0.01824, -0.00941, 0.04128, -0.01529],\n      "tokens": 6\n    }\n  ],\n  "usage": {\n    "prompt_tokens": 6,\n    "total_tokens": 6\n  }\n}',
  },
  {
    id: 'ep-2',
    method: 'POST',
    path: '/similarity',
    summary: 'Cosine Distance Matcher',
    description:
      'Calculates cosine similarity distance matrix between a reference query vector and target vector corpus.',
    parameters: [
      {
        name: 'X-API-Key',
        in: 'header',
        required: true,
        type: 'string',
        desc: 'Subscriber bearer token.',
      },
    ],
    requestBodyExample: '{\n  "query_vector": [0.018, -0.009, 0.041],\n  "corpus": [\n    [0.017, -0.010, 0.039],\n    [0.912, 0.114, -0.218]\n  ]\n}',
    responseExample: '{\n  "matches": [\n    { "index": 0, "score": 0.9842 },\n    { "index": 1, "score": 0.1240 }\n  ]\n}',
  },
  {
    id: 'ep-3',
    method: 'GET',
    path: '/healthz',
    summary: 'Origin Health Probe',
    description:
      'Returns current operational health status and memory buffer telemetry for the upstream engine.',
    parameters: [],
    responseExample: '{\n  "status": "healthy",\n  "version": "2.4.0",\n  "uptime_seconds": 1824900\n}',
  },
]

export default function ApiDocsPage() {
  const params = useParams()
  const slug = (params?.slug as string) || 'neural-embeddings'
  const [activeEndpointId, setActiveEndpointId] = useState(SAMPLE_ENDPOINTS[0].id)

  const activeEp = SAMPLE_ENDPOINTS.find((e) => e.id === activeEndpointId) || SAMPLE_ENDPOINTS[0]

  return (
    <div className="w-full">
      {/* Header */}
      <section className="pt-16 pb-10 border-b-2 border-black bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#525252] mb-2">
                <Link href={`/apis/${slug}`} className="hover:text-black hover:underline">
                  &larr; RETURN TO API DETAIL
                </Link>
                <span>/</span>
                <span>OPENAPI 3.0 CONTRACT</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-black">
                Interactive API Docs.
              </h1>
            </div>

            <Link href={`/apis/${slug}/playground`}>
              <Button variant="primary" className="flex items-center gap-2 text-xs py-2.5 px-4">
                <PlayIcon size={14} />
                <span>OPEN IN PLAYGROUND</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Docs Body (Sidebar + Content) */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
            {/* Left Sidebar: Endpoints List */}
            <div className="lg:col-span-1 border-2 border-black p-4 bg-white sticky top-28 space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#525252] block px-2 pb-2 border-b border-[#E5E5E5]">
                ROUTED ENDPOINTS
              </span>

              {SAMPLE_ENDPOINTS.map((ep) => {
                const isActive = activeEndpointId === ep.id
                return (
                  <button
                    key={ep.id}
                    onClick={() => setActiveEndpointId(ep.id)}
                    className={`w-full text-left p-3 font-mono text-xs flex items-center gap-2.5 transition-none border ${
                      isActive
                        ? 'bg-black text-white border-black font-semibold'
                        : 'bg-white text-black border-transparent hover:border-black hover:bg-[#F5F5F5]'
                    }`}
                  >
                    <span
                      className={`text-[9px] px-1.5 py-0.5 font-bold ${
                        isActive ? 'bg-white text-black' : 'bg-black text-white'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="truncate">{ep.path}</span>
                  </button>
                )
              })}
            </div>

            {/* Main Content: Endpoint Specification */}
            <div className="lg:col-span-3 space-y-10 border border-black p-8 md:p-12 bg-white">
              {/* Endpoint Headline */}
              <div className="border-b-2 border-black pb-6 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 bg-black text-white font-mono text-xs font-bold">
                    {activeEp.method}
                  </span>
                  <span className="font-mono text-base font-bold text-black select-all">
                    /v1/{slug}{activeEp.path}
                  </span>
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-black pt-2">
                  {activeEp.summary}
                </h2>
                <p className="font-serif text-sm text-[#525252] leading-relaxed">
                  {activeEp.description}
                </p>
              </div>

              {/* Parameters Table */}
              <div className="space-y-4">
                <h3 className="font-mono text-xs uppercase tracking-widest text-black font-bold">
                  REQUEST PARAMETERS &amp; HEADERS
                </h3>
                {activeEp.parameters.length === 0 ? (
                  <p className="font-serif text-xs italic text-[#525252]">
                    No custom headers or query parameters required.
                  </p>
                ) : (
                  <div className="border border-black overflow-x-auto">
                    <table className="w-full text-left border-collapse font-mono text-xs">
                      <thead>
                        <tr className="border-b-2 border-black bg-[#F5F5F5]">
                          <th className="py-2.5 px-4 font-semibold">PARAMETER</th>
                          <th className="py-2.5 px-4 font-semibold">LOCATION</th>
                          <th className="py-2.5 px-4 font-semibold">TYPE</th>
                          <th className="py-2.5 px-4 font-semibold">DESCRIPTION</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E5E5]">
                        {activeEp.parameters.map((param) => (
                          <tr key={param.name}>
                            <td className="py-3 px-4 font-bold">{param.name}</td>
                            <td className="py-3 px-4 uppercase text-[#525252]">{param.in}</td>
                            <td className="py-3 px-4 text-[#525252]">{param.type}</td>
                            <td className="py-3 px-4 font-serif text-xs">{param.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Request Body Example */}
              {activeEp.requestBodyExample && (
                <div className="space-y-3">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-black font-bold">
                    REQUEST BODY SCHEMA (APPLICATION/JSON)
                  </h3>
                  <CodeBlock
                    code={activeEp.requestBodyExample}
                    language="json"
                    title="Payload"
                  />
                </div>
              )}

              {/* Response Body Example */}
              <div className="space-y-3">
                <h3 className="font-mono text-xs uppercase tracking-widest text-black font-bold">
                  RESPONSE PAYLOAD (HTTP 200 OK)
                </h3>
                <CodeBlock
                  code={activeEp.responseExample}
                  language="json"
                  title="Response (200 OK)"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
