import React from 'react'

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  strokeWidth?: number
}

export function DashboardBrowsingIcon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <rect x="3" y="3" width="8" height="8" />
      <rect x="13" y="3" width="8" height="5" />
      <rect x="13" y="11" width="8" height="10" />
      <rect x="3" y="14" width="8" height="7" />
    </svg>
  )
}

export function ApiIcon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <path d="M4 14l6-6M10 8l4 4M14 12l6-6M4 18h16M4 6h4" />
      <circle cx="10" cy="8" r="2" />
      <circle cx="14" cy="12" r="2" />
    </svg>
  )
}

export function PricingIcon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <path d="M4 4h16v16H4zM8 9h8M8 12h5M8 15h3" />
      <path d="M16 15l2-2-2-2" />
    </svg>
  )
}

export function Analytics01Icon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <path d="M3 20h18M6 16v-4M12 16V8M18 16V4" />
    </svg>
  )
}

export function MoneyBagIcon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <path d="M9 3h6l1 4H8l1-4zM5 10c0-1.5 1-3 3-3h8c2 0 3 1.5 3 3v8c0 2-2 3-4 3H9c-2 0-4-1-4-3v-8z" />
      <path d="M12 11v6M10 13h4M10 15h4" />
    </svg>
  )
}

export function Settings01Icon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

export function PlusSignIcon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function PencilEdit01Icon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  )
}

export function Delete01Icon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <path d="M4 7h16M10 11v6M14 11v6M5 7l1 13h12l1-13M9 7V4h6v3" />
    </svg>
  )
}

export function EyeIcon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export function Book02Icon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z" />
    </svg>
  )
}

export function File01Icon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-7-7z" />
      <path d="M13 2v7h7" />
    </svg>
  )
}

export function SourceCodeIcon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <path d="M8 6L2 12l6 6M16 6l6 6-6 6M14 4l-4 16" />
    </svg>
  )
}

export function UserGroupIcon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <circle cx="9" cy="7" r="4" />
      <path d="M17 11a3 3 0 1 0-2.8-4M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2M16 17a4 4 0 0 1 6 0v2" />
    </svg>
  )
}

export function Key01Icon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <circle cx="8" cy="15" r="5" />
      <path d="M12 11l9-9M17 6l2 2M15 8l2 2" />
    </svg>
  )
}

export function BarChartIcon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <path d="M18 20V10M12 20V4M6 20v-6M3 20h18" />
    </svg>
  )
}

export function Calendar03Icon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <rect x="3" y="4" width="18" height="18" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}

export function ArrowRight01Icon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  )
}

export function ArrowUpRight01Icon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <path d="M7 17L17 7M7 7h10v10" />
    </svg>
  )
}

export function CheckmarkCircle02Icon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l3 3 5-6" />
    </svg>
  )
}

export function Alert02Icon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <path d="M12 4L3 20h18L12 4zM12 9v5M12 17h.01" />
    </svg>
  )
}

export function Copy01Icon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <rect x="8" y="8" width="13" height="13" />
      <path d="M4 16V4h12" />
    </svg>
  )
}

export function Menu01Icon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  )
}

export function Cancel01Icon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}
