'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

export default function RootPage() {
  const router = useRouter()
  const { isAuthenticated, isHydrated, user } = useAuth()

  useEffect(() => {
    if (!isHydrated) return

    if (!isAuthenticated || !user) {
      router.replace('/home')
      return
    }

    if (user.role === 'provider' || user.role === 'admin') {
      router.replace('/publisher/dashboard')
    } else {
      router.replace('/dashboard')
    }
  }, [isAuthenticated, isHydrated, user, router])

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-8 select-none antialiased">
      <div className="space-y-4 text-center">
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-widest uppercase text-black animate-pulse leading-none">
          EPHEMERAL
        </h1>
        <div className="flex items-center justify-center gap-3">
          <div className="w-8 h-[2px] bg-black" />
          <div className="w-2 h-2 border border-black bg-white" />
          <div className="w-8 h-[2px] bg-black" />
        </div>
        <p className="font-mono text-xs uppercase tracking-widest text-[#525252]">
          INITIALIZING GATEWAY SESSION…
        </p>
      </div>
    </div>
  )
}
