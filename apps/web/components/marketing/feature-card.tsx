import React from 'react'

export interface FeatureCardProps {
  number: string
  title: string
  description: string
  icon: React.ReactNode
}

export function FeatureCard({ number, title, description, icon }: FeatureCardProps) {
  return (
    <div className="group border border-black p-8 md:p-10 bg-white transition-colors duration-100 hover:bg-black hover:text-white flex flex-col justify-between select-none">
      <div>
        <div className="flex items-start justify-between mb-8">
          <span className="font-mono text-xs uppercase tracking-widest text-[#525252] group-hover:text-white/70">
            {number}
          </span>
          <div className="p-2 border border-black group-hover:border-white text-black group-hover:text-white transition-colors duration-100">
            {icon}
          </div>
        </div>

        <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-4 group-hover:text-white">
          {title}
        </h3>

        <p className="font-serif text-sm md:text-base text-[#525252] group-hover:text-white/80 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-8 pt-4 border-t border-[#E5E5E5] group-hover:border-[#333333] flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-[#525252] group-hover:text-white/70">
        <span>EPHEMERAL PROTOCOL</span>
        <span>&bull;</span>
        <span>0-LATENCY OVERHEAD</span>
      </div>
    </div>
  )
}
