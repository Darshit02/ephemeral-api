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

/* Consumer Portal Additional Icons */

export function Home01Icon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
    </svg>
  )
}

export function Store01Icon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <path d="M3 3h18v4H3zM3 7l2 14h14l2-14" />
      <path d="M9 11v6M15 11v6" />
    </svg>
  )
}

export function Search01Icon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  )
}

export function LockIcon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <rect x="5" y="11" width="14" height="10" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  )
}

export function UnlockIcon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <rect x="5" y="11" width="14" height="10" />
      <path d="M8 11V7a4 4 0 0 1 8 0" />
    </svg>
  )
}

export function PlayIcon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}

export function ShoppingCart01Icon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )
}

export function CreditCardIcon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <rect x="2" y="5" width="20" height="14" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  )
}

export function Logout01Icon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

export function UserCircleIcon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="9" r="3" />
      <path d="M6 19a6 6 0 0 1 12 0" />
    </svg>
  )
}

export function FilterIcon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}

export function SortingIcon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <path d="M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 18V4" />
    </svg>
  )
}

export function ArrowLeft02Icon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <path d="M19 12H5M11 19l-7-7 7-7" />
    </svg>
  )
}

export function RefreshIcon({ size = 20, strokeWidth = 1.5, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <path d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
    </svg>
  )
}

/* Convenient Icons Namespace mapping */
export const Icons = {
  dashboard: DashboardBrowsingIcon,
  api: ApiIcon,
  plans: PricingIcon,
  pricing: PricingIcon,
  analytics: Analytics01Icon,
  usage: Analytics01Icon,
  revenue: MoneyBagIcon,
  settings: Settings01Icon,
  add: PlusSignIcon,
  edit: PencilEdit01Icon,
  delete: Delete01Icon,
  view: EyeIcon,
  docs: Book02Icon,
  file: File01Icon,
  code: SourceCodeIcon,
  users: UserGroupIcon,
  keys: Key01Icon,
  key: Key01Icon,
  chart: BarChartIcon,
  calendar: Calendar03Icon,
  arrowRight: ArrowRight01Icon,
  external: ArrowUpRight01Icon,
  check: CheckmarkCircle02Icon,
  warning: Alert02Icon,
  copy: Copy01Icon,
  menu: Menu01Icon,
  close: Cancel01Icon,
  home: Home01Icon,
  store: Store01Icon,
  marketplace: Store01Icon,
  search: Search01Icon,
  lock: LockIcon,
  unlock: UnlockIcon,
  play: PlayIcon,
  cart: ShoppingCart01Icon,
  card: CreditCardIcon,
  logout: Logout01Icon,
  user: UserCircleIcon,
  filter: FilterIcon,
  sort: SortingIcon,
}
