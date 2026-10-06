import React from "react"
import { cn } from "@/lib/utils"

export interface StatCardProps {
  label: string
  value: string | number
  delta?: string
  subtext?: string
  inverted?: boolean
  className?: string
}

export function StatCard({
  label,
  value,
  delta,
  subtext,
  inverted = false,
  className,
}: StatCardProps) {
  if (inverted) {
    return (
      <article
        className={cn(
          "bg-black text-white p-8 rounded-none relative overflow-hidden texture-inverted-lines",
          className
        )}
      >
        <div className="relative z-10">
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4 select-none">
            {label}
          </p>
          <p className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-none">
            {value}
          </p>
          {(delta || subtext) && (
            <div className="mt-4 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs font-mono">
              {delta && <span className="text-white">{delta}</span>}
              {subtext && <span className="text-neutral-400">{subtext}</span>}
            </div>
          )}
        </div>
      </article>
    )
  }

  return (
    <article
      className={cn(
        "bg-white text-black border border-black p-8 rounded-none",
        className
      )}
    >
      <p className="font-mono text-xs uppercase tracking-widest text-[#525252] mb-4 select-none">
        {label}
      </p>
      <p className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-black leading-none">
        {value}
      </p>
      {(delta || subtext) && (
        <div className="mt-4 pt-4 border-t border-[#E5E5E5] flex items-center justify-between text-xs font-mono">
          {delta && <span className="text-black font-medium">{delta}</span>}
          {subtext && <span className="text-[#525252]">{subtext}</span>}
        </div>
      )}
    </article>
  )
}
