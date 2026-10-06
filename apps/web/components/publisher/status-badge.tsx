import React from "react"
import { cn } from "@/lib/utils"

export type StatusType =
  | "live"
  | "draft"
  | "maintenance"
  | "deprecated"
  | "active"
  | "past_due"
  | "canceled"

export interface StatusBadgeProps {
  status: StatusType | string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toLowerCase()

  const getStyles = () => {
    switch (normalized) {
      case "live":
      case "active":
        return "border-black text-black bg-white"
      case "draft":
        return "border-[#E5E5E5] text-[#525252] bg-white"
      case "maintenance":
      case "past_due":
      case "canceled":
      case "deprecated":
        return "border-black bg-black text-white"
      default:
        return "border-black text-black bg-white"
    }
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 font-mono text-xs uppercase tracking-widest font-medium border rounded-none select-none transition-none",
        getStyles(),
        className
      )}
    >
      {status}
    </span>
  )
}
