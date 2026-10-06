'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  DashboardBrowsingIcon,
  ApiIcon,
  MoneyBagIcon,
  Settings01Icon,
  ArrowUpRight01Icon,
  Menu01Icon,
  Cancel01Icon,
} from '@/components/icons'

const NAV_ITEMS = [
  {
    name: 'DASHBOARD',
    href: '/dashboard',
    icon: DashboardBrowsingIcon,
  },
  {
    name: 'APIS',
    href: '/apis',
    icon: ApiIcon,
  },
  {
    name: 'REVENUE',
    href: '/revenue',
    icon: MoneyBagIcon,
  },
  {
    name: 'SETTINGS',
    href: '/settings',
    icon: Settings01Icon,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isNavActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/'
    }
    return pathname.startsWith(href)
  }

  const renderNavContent = () => (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-black">
        <Link href="/dashboard" className="block" onClick={() => setMobileOpen(false)}>
          <span className="font-display text-2xl font-bold tracking-tight text-black block leading-none">
            EPHEMERAL
          </span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#525252] mt-1.5 block">
            PUBLISHER PLATFORM
          </span>
        </Link>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = isNavActive(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3.5 font-mono text-xs uppercase tracking-widest border transition-none',
                active
                  ? 'bg-black text-white border-black font-semibold'
                  : 'bg-white text-black border-transparent hover:border-black hover:bg-[#F5F5F5]'
              )}
            >
              <Icon size={18} strokeWidth={active ? 2 : 1.5} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Public Marketplace Quick Link */}
      <div className="px-3 pb-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-4 py-3 border border-[#E5E5E5] hover:border-black font-mono text-[10px] uppercase tracking-widest text-[#525252] hover:text-black hover:bg-[#F5F5F5] transition-none"
        >
          <span>Marketplace</span>
          <ArrowUpRight01Icon size={14} />
        </a>
      </div>

      {/* User Status Footer */}
      <div className="p-5 border-t border-black bg-white">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 bg-black inline-block animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-black font-bold">
            NODE RUNNING
          </span>
        </div>
        <p className="font-mono text-xs text-[#525252] truncate" title="publisher@ephemeral.network">
          publisher@ephemeral.network
        </p>
        <p className="font-mono text-[9px] uppercase tracking-widest text-[#525252] mt-1">
          REGION: AP-SOUTH-1
        </p>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 left-0 z-30 border-r border-black bg-white">
        {renderNavContent()}
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between px-5 py-4 bg-white border-b border-black">
        <Link href="/dashboard" className="leading-none">
          <span className="font-display text-xl font-bold tracking-tight text-black">
            EPHEMERAL
          </span>
          <span className="block font-mono text-[8px] uppercase tracking-widest text-[#525252]">
            PUBLISHER
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          className="p-2 border border-black hover:bg-black hover:text-white transition-none"
        >
          {mobileOpen ? <Cancel01Icon size={20} /> : <Menu01Icon size={20} />}
        </button>
      </header>

      {/* Mobile Overlay Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80">
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-white border-r-2 border-black flex flex-col">
            <div className="flex justify-end p-4 border-b border-black">
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 hover:bg-black hover:text-white"
                aria-label="Close"
              >
                <Cancel01Icon size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {renderNavContent()}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
