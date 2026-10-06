import React from 'react'

export interface PullQuoteProps {
  quote?: string
  author?: string
  role?: string
}

export function PullQuote({
  quote = 'Ephemeral strips away the bloat of traditional API portals. It turns software endpoints into liquid, monetizable commodities with true mechanical precision.',
  author = 'DR. ELENA VANCE',
  role = 'HEAD OF INFRASTRUCTURE, CIPHER SYSTEMS',
}: PullQuoteProps) {
  return (
    <section className="w-full py-28 md:py-36 border-b-2 border-black bg-white relative overflow-hidden select-none">
      <div className="max-w-5xl mx-auto px-6 md:px-8 text-center relative z-10">
        {/* Giant decorative quotation mark */}
        <div className="font-display text-8xl md:text-9xl text-black opacity-15 leading-none select-none -mb-10">
          &ldquo;
        </div>

        {/* Quote body */}
        <blockquote className="font-display italic text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal tracking-tight text-black leading-tight max-w-4xl mx-auto mb-10">
          {quote}
        </blockquote>

        {/* Attribution */}
        <div className="flex flex-col items-center gap-1 font-mono">
          <span className="text-xs uppercase tracking-widest text-black font-bold">
            {author}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-[#525252]">
            {role}
          </span>
        </div>
      </div>
    </section>
  )
}
