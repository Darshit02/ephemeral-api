'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import {
  Menu01Icon,
  Cancel01Icon,
  Logout01Icon,
  ArrowRight01Icon,
} from '@/components/icons'

export function MarketingNav() {
  const pathname = usePathname()
  const { isAuthenticated, user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { label: 'Marketplace', href: '/apis' },
    { label: 'Documentation', href: '/docs' },
    { label: 'Pricing', href: '/pricing' },
  ]

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b border-black">
        <div className="max-w-7xl mx-auto px-6 md:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/home" className="group flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold tracking-widest uppercase text-black">
              EPHEMERAL
            </span>
            <span className="w-1.5 h-1.5 bg-black" />
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-serif text-sm tracking-wide text-black hover:underline transition-none ${
                    active ? 'font-bold underline' : ''
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Right Action Menu */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-[#525252] truncate max-w-[180px]">
                  {user?.email}
                </span>
                <Link href={user?.role === 'provider' ? '/dashboard' : '/dashboard'}>
                  <Button variant="primary" className="text-xs py-2 px-4">
                    PORTAL
                  </Button>
                </Link>
                <button
                  onClick={logout}
                  aria-label="Sign out"
                  className="p-2 text-black hover:bg-black hover:text-white transition-none border border-transparent hover:border-black"
                >
                  <Logout01Icon size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" className="text-xs">
                    SIGN IN
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" className="text-xs py-2 px-5">
                    GET STARTED
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 border border-black hover:bg-black hover:text-white transition-none"
              aria-label="Toggle navigation drawer"
            >
              {mobileOpen ? <Cancel01Icon size={20} /> : <Menu01Icon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black text-white flex flex-col justify-between p-8 animate-in fade-in duration-100">
          <div className="flex items-center justify-between border-b border-[#333333] pb-6">
            <span className="font-display text-2xl font-bold tracking-widest uppercase">
              EPHEMERAL
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 border border-white text-white hover:bg-white hover:text-black transition-none"
              aria-label="Close menu"
            >
              <Cancel01Icon size={20} />
            </button>
          </div>

          <nav className="flex flex-col gap-6 my-auto">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-display text-5xl sm:text-6xl font-normal hover:italic hover:translate-x-2 transition-transform duration-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-[#333333] pt-6 flex flex-col gap-4">
            {isAuthenticated ? (
              <>
                <p className="font-mono text-xs text-[#A3A3A3] truncate">
                  Logged in as {user?.email}
                </p>
                <div className="flex gap-4">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1"
                  >
                    <Button variant="secondary" className="w-full text-white border-white hover:bg-white hover:text-black">
                      PORTAL &rarr;
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      logout()
                      setMobileOpen(false)
                    }}
                    className="text-white hover:underline"
                  >
                    SIGN OUT
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button variant="secondary" className="w-full text-white border-white hover:bg-white hover:text-black">
                    SIGN IN
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button variant="primary" className="w-full bg-white text-black hover:bg-black hover:text-white border-white">
                    GET STARTED
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
