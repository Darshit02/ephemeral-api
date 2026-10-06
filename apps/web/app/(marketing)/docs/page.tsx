import React from 'react'
import Link from 'next/link'
import { Hero } from '@/components/publisher/hero'
import {
  Book02Icon,
  Key01Icon,
  SourceCodeIcon,
  Analytics01Icon,
  File01Icon,
  ArrowRight01Icon,
  ArrowUpRight01Icon,
} from '@/components/icons'

export default function MarketingDocsPage() {
  const docSections = [
    {
      title: '01. Quickstart Guide',
      subtitle: 'Provision your first subscriber key and invoke an API endpoint in under 60 seconds.',
      icon: <Book02Icon size={20} />,
      snippet: 'curl https://gateway.ephemeral.network/v1/neural-embeddings/embeddings \\\n  -H "X-API-Key: eph_live_9a48f2c..."',
    },
    {
      title: '02. Cryptographic Authentication',
      subtitle: 'Pass bearer keys via the HTTP header X-API-Key. Keys are cached securely in distributed memory.',
      icon: <Key01Icon size={20} />,
      snippet: 'Headers:\n  X-API-Key: <your_consumer_key>\n  Accept: application/json',
    },
    {
      title: '03. Rate Limiting & Quotas',
      subtitle: 'Token-bucket algorithms calculate consumption. Gateways return standard IETF rate-limit response headers.',
      icon: <Analytics01Icon size={20} />,
      snippet: 'X-RateLimit-Limit: 100\nX-RateLimit-Remaining: 84\nX-RateLimit-Reset: 1728219000',
    },
    {
      title: '04. Gateway Route Addressing',
      subtitle: 'All traffic enters via gateway.ephemeral.network/v1/:slug/* with automatic SSL verification.',
      icon: <File01Icon size={20} />,
      snippet: 'https://gateway.ephemeral.network/v1/:slug/:endpoint_path',
    },
    {
      title: '05. SDK Clients',
      subtitle: 'Native SDK libraries for Go, Node/TypeScript, and Python with automated exponential backoff.',
      icon: <SourceCodeIcon size={20} />,
      snippet: 'npm install @ephemeral/sdk\n# or: go get github.com/ephemeral-api/sdk-go',
    },
    {
      title: '06. Webhook Signatures',
      subtitle: 'Verify inbound webhook dispatches using HMAC-SHA256 signatures passed in Ephemeral-Signature headers.',
      icon: <Key01Icon size={20} />,
      snippet: 'Ephemeral-Signature: t=1728219000,v1=9a8b7c6d5e4f...',
    },
  ]

  return (
    <div className="w-full">
      {/* Hero Header */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-20 border-b-2 border-black bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <Hero
            supertitle="DEVELOPER SPECIFICATION // PROTOCOL GUIDE"
            title="Documentation."
            subtitle="Architectural contracts, gateway authentication headers, SDK examples, and edge routing specifications."
            className="pb-0"
          />
        </div>
      </section>

      {/* Docs Grid */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {docSections.map((sec) => (
              <div
                key={sec.title}
                className="border border-black p-8 bg-white hover:border-2 transition-none flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs uppercase tracking-widest text-[#525252] font-semibold">
                      {sec.title.split('.')[0]} // SECTION
                    </span>
                    <div className="p-2 border border-black bg-white group-hover:bg-black group-hover:text-white transition-colors duration-100">
                      {sec.icon}
                    </div>
                  </div>

                  <h3 className="font-display text-2xl font-bold tracking-tight text-black mb-3">
                    {sec.title.split('. ')[1]}
                  </h3>

                  <p className="font-serif text-sm text-[#525252] leading-relaxed mb-6">
                    {sec.subtitle}
                  </p>

                  <div className="border border-black bg-[#F5F5F5] p-3 font-mono text-xs text-black whitespace-pre overflow-x-auto mb-6">
                    <code>{sec.snippet}</code>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-between font-mono text-xs text-black font-semibold">
                  <span>READ PROTOCOL</span>
                  <ArrowRight01Icon size={14} className="group-hover:translate-x-1 transition-transform duration-100" />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Support Banner */}
          <div className="mt-16 p-8 border-2 border-black bg-black text-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#A3A3A3] block mb-1">
                NEED CUSTOM ARCHITECTURE ASSISTANCE?
              </span>
              <p className="font-display text-xl font-bold text-white">
                Our protocol core engineers are available 24/7 for dedicated upstream peering.
              </p>
            </div>
            <a
              href="mailto:support@ephemeral.network"
              className="px-6 py-3 bg-white text-black font-mono text-xs uppercase tracking-widest font-semibold hover:bg-black hover:text-white hover:border hover:border-white transition-none whitespace-nowrap"
            >
              CONTACT CORE TEAM &rarr;
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
