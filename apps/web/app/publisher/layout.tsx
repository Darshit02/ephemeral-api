'use client'

import React from 'react'
import { Sidebar } from '@/components/publisher/sidebar'
import { RoleGuard } from '@/components/auth/role-guard'

export default function PublisherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RoleGuard allowed={['provider', 'admin']}>
      <div className="min-h-screen bg-white text-black flex flex-col md:flex-row antialiased selection:bg-black selection:text-white">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Content Viewport */}
        <main className="flex-1 md:pl-64 flex flex-col min-h-screen overflow-x-hidden">
          <div className="flex-1 w-full max-w-6xl mx-auto px-6 md:px-8 lg:px-12 py-10 md:py-16">
            {children}
          </div>

          {/* Global Publisher Footer */}
          <footer className="w-full border-t border-black bg-white py-8 px-6 md:px-12 mt-auto">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-baseline justify-between gap-4">
              <div>
                <p className="font-display text-sm font-bold text-black tracking-wider uppercase">
                  EPHEMERAL PROTOCOL
                </p>
                <p className="font-mono text-[10px] text-[#525252] uppercase tracking-widest mt-1">
                  AUSTERE INFRASTRUCTURE &bull; NO ACCENTS &bull; PURE MONOCHROME
                </p>
              </div>
              <div className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-widest text-[#525252]">
                <a href="/publisher/dashboard" className="hover:text-black hover:underline">
                  STATUS: 99.98%
                </a>
                <a href="/publisher/settings" className="hover:text-black hover:underline">
                  ENCRYPTION: AES-256
                </a>
                <a href="/apis" className="hover:text-black hover:underline">
                  MARKETPLACE &rarr;
                </a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </RoleGuard>
  )
}
