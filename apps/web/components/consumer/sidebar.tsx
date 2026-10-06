'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'
import {
  DashboardBrowsingIcon,
  Calendar03Icon,
  Key01Icon,
  Analytics01Icon,
  Settings01Icon,
  ArrowUpRight01Icon,
  Logout01Icon,
  Menu01Icon,
  Cancel01Icon,
} from '@/components/icons'

const NAV_ITEMS = [
  { name: 'DASHBOARD', href: '/dashboard', icon: DashboardBrowsingIcon },
  { name: 'SUBSCRIPTIONS', href: '/subscriptions', icon: Calendar03Icon },
  { name: 'API KEYS', href: '/api-keys', icon: Key01Icon },
  { name: 'USAGE', href: '/usage', icon: Analytics01Icon },
  { name: 'SETTINGS', href: '/settings', icon: Settings01Icon },
]

export function ConsumerSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isNavActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const renderNavContent = () => (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-black">
        <Link href="/" className="block" onClick={() => setMobileOpen(false)}>
          <span className="font-display text-2xl font-bold tracking-tight text-black block leading-none">
            EPHEMERAL
          </span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#525252] mt-1.5 block">
            CONSUMER PORTAL
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
        <Link
          href="/apis"
          className="flex items-center justify-between px-4 py-3 border border-[#E5E5E5] hover:border-black font-mono text-[10px] uppercase tracking-widest text-[#525252] hover:text-black hover:bg-[#F5F5F5] transition-none"
        >
          <span>Marketplace</span>
          <ArrowUpRight01Icon size={14} />
        </Link>
      </div>

      {/* User Session Footer */}
      <div className="p-5 border-t border-black bg-white flex flex-col justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-black inline-block" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-black font-bold">
              CONSUMER AUTHED
            </span>
          </div>
          <p className="font-mono text-xs text-[#525252] truncate" title={user?.email || 'consumer@ephemeral.network'}>
            {user?.email || 'consumer@ephemeral.network'}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full py-2 border border-[#E5E5E5] hover:border-black hover:bg-black hover:text-white font-mono text-[10px] uppercase tracking-widest text-[#525252] transition-none"
        >
          <Logout01Icon size={14} />
          <span>SIGN OUT</span>
        </button>
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
            CONSUMER PORTAL
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close Menu' : 'Open Menu'}
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
