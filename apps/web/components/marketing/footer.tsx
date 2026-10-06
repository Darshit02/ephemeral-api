import React from 'react'
import Link from 'next/link'

export function MarketingFooter() {
  const sections = [
    {
      title: 'PRODUCT',
      links: [
        { label: 'Marketplace', href: '/apis' },
        { label: 'Pricing Plans', href: '/pricing' },
        { label: 'Edge Gateway', href: '/docs#gateway' },
        { label: 'Latency Map', href: '/docs#telemetry' },
      ],
    },
    {
      title: 'DEVELOPERS',
      links: [
        { label: 'Documentation', href: '/docs' },
        { label: 'API Reference', href: '/docs#reference' },
        { label: 'SDK Downloads', href: '/docs#sdks' },
        { label: 'Interactive Sandbox', href: '/apis' },
      ],
    },
    {
      title: 'COMPANY',
      links: [
        { label: 'About Ephemeral', href: '/docs' },
        { label: 'Publisher Portal', href: '/dashboard' },
        { label: 'Protocol Manifesto', href: '/docs' },
        { label: 'Contact Core Team', href: 'mailto:core@ephemeral.network' },
      ],
    },
    {
      title: 'LEGAL',
      links: [
        { label: 'Terms of Protocol', href: '/docs#terms' },
        { label: 'Privacy Standards', href: '/docs#privacy' },
        { label: 'Security & SLAs', href: '/docs#sla' },
        { label: 'Compliance Ledger', href: '/docs#compliance' },
      ],
    },
  ]

  return (
    <footer className="w-full bg-white border-t-4 border-black pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pb-16 border-b border-[#E5E5E5]">
          {sections.map((sec) => (
            <div key={sec.title} className="space-y-4">
              <h4 className="font-mono text-xs uppercase tracking-widest text-black font-semibold">
                {sec.title}
              </h4>
              <ul className="space-y-2.5">
                {sec.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-serif text-sm text-[#525252] hover:text-black hover:underline transition-none"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Metadata */}
        <div className="pt-8 flex flex-col sm:flex-row items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-4">
            <span className="font-display text-lg font-bold tracking-widest uppercase text-black">
              EPHEMERAL
            </span>
            <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
              AUSTERE MONOCHROME API EXCHANGE
            </span>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs text-[#525252]">
            <span>STATUS: OPERATIONAL (99.98%)</span>
            <span>&bull;</span>
            <span>&copy; {new Date().getFullYear()} EPHEMERAL LABS</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
