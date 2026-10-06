import React from 'react'

export function MarketingStatsSection() {
  const stats = [
    {
      label: 'APIS LISTED',
      value: '240+',
      detail: 'Curated origin services',
    },
    {
      label: 'REQUESTS ROUTED',
      value: '1.8B',
      detail: 'Through edge proxies',
    },
    {
      label: 'ACTIVE PUBLISHERS',
      value: '1,420',
      detail: 'Monetized developers',
    },
    {
      label: 'AVERAGE UPTIME',
      value: '99.98%',
      detail: 'Global edge reliability',
    },
  ]

  return (
    <section className="w-full bg-black text-white py-20 md:py-28 relative overflow-hidden texture-inverted-lines border-b-2 border-black">
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#333333]">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className={`space-y-3 ${idx !== 0 ? 'sm:pl-8' : ''} ${idx !== 0 ? 'pt-8 sm:pt-0' : ''}`}
            >
              <span className="font-mono text-xs uppercase tracking-widest text-[#A3A3A3] block">
                {stat.label}
              </span>
              <div className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-none text-white">
                {stat.value}
              </div>
              <p className="font-serif text-xs text-[#737373] mt-2">
                {stat.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
