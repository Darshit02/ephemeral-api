import React from 'react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'

export const metadata = {
  title: 'Ephemeral Marketplace — Live APIs for Rent',
  description: 'Browse, evaluate, and subscribe to verified high-performance APIs.',
}

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black antialiased selection:bg-black selection:text-white">
      {/* Authed-aware top navigation */}
      <MarketingNav />

      {/* Main Content Viewport */}
      <main className="flex-1 w-full">{children}</main>

      {/* Shared Monochrome Footer */}
      <MarketingFooter />
    </div>
  )
}
