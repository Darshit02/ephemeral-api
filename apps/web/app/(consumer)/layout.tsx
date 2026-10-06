'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { ConsumerSidebar } from '@/components/consumer/sidebar'

export default function ConsumerPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, isHydrated, user } = useAuth()

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isHydrated, router])

  return (
    <div className="min-h-screen bg-white text-black flex flex-col md:flex-row antialiased selection:bg-black selection:text-white">
      {/* Sidebar Navigation */}
      <ConsumerSidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:pl-64 flex flex-col min-h-screen overflow-x-hidden">
        <div className="flex-1 w-full max-w-6xl mx-auto px-6 md:px-8 lg:px-12 py-10 md:py-16">
          {children}
        </div>

        {/* Global Consumer Footer */}
        <footer className="w-full border-t border-black bg-white py-8 px-6 md:px-12 mt-auto">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-baseline justify-between gap-4">
            <div>
              <p className="font-display text-sm font-bold text-black tracking-wider uppercase">
                EPHEMERAL CONSUMER SUITE
              </p>
              <p className="font-mono text-[10px] text-[#525252] uppercase tracking-widest mt-1">
                TOKEN-BUCKET METERING &bull; ZERO PARALLAX &bull; PURE MONOCHROME
              </p>
            </div>
            <div className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-widest text-[#525252]">
              <a href="/apis" className="hover:text-black hover:underline">
                BROWSE APIS &rarr;
              </a>
              <a href="/docs" className="hover:text-black hover:underline">
                GATEWAY SPECS
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
