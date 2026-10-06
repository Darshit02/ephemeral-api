import React from "react"
import { cn } from "@/lib/utils"

export interface HeroProps {
  eyebrow?: string
  title: string
  description?: string
  size?: "5xl" | "6xl" | "7xl" | "8xl" | "9xl"
  decoration?: boolean
  className?: string
  action?: React.ReactNode
}

export function Hero({
  eyebrow,
  title,
  description,
  size = "8xl",
  decoration = true,
  className,
  action,
}: HeroProps) {
  const sizeClasses = {
    "5xl": "text-4xl sm:text-5xl",
    "6xl": "text-4xl sm:text-5xl md:text-6xl",
    "7xl": "text-5xl sm:text-6xl md:text-7xl",
    "8xl": "text-5xl sm:text-6xl md:text-7xl lg:text-8xl",
    "9xl": "text-6xl sm:text-7xl md:text-8xl lg:text-9xl",
  }

  return (
    <header className={cn("pt-6 pb-12 md:pb-16", className)}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          {eyebrow && (
            <p className="font-mono text-xs uppercase tracking-widest text-[#525252] mb-4 select-none">
              {eyebrow}
            </p>
          )}

          <h1
            className={cn(
              "font-serif font-normal tracking-tighter leading-none text-black",
              sizeClasses[size]
            )}
          >
            {title}
          </h1>

          {description && (
            <p className="mt-4 text-base md:text-lg text-[#525252] max-w-2xl font-serif leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {action && <div className="shrink-0">{action}</div>}
      </div>

      {decoration && (
        <div className="flex items-center gap-3 mt-8">
          <div className="h-1 w-6 bg-black" />
          <div className="h-2 w-2 border border-black bg-white" />
        </div>
      )}
    </header>
  )
}
