import React from "react"
import { cn } from "@/lib/utils"

export interface SectionRuleProps {
  variant?: "thin" | "medium" | "thick" | "ultra"
  thickness?: "thin" | "medium" | "thick" | "ultra"
  className?: string
}

export function SectionRule({
  variant,
  thickness,
  className,
}: SectionRuleProps) {
  const chosen = thickness ?? variant ?? "thick"

  const heightClasses = {
    thin: "h-px bg-black",
    medium: "h-0.5 bg-black",
    thick: "h-1 bg-black",
    ultra: "h-2 bg-black",
  }

  return (
    <div
      role="separator"
      className={cn(
        "w-full my-16 md:my-24 shrink-0 select-none",
        heightClasses[chosen],
        className
      )}
    />
  )
}
