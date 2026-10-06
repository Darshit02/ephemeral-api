import React from 'react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'

export const metadata = {
  title: 'Ephemeral — The Monochrome API Marketplace',
  description: 'Rent, publish, and consume production APIs through an ultra-low latency cryptographic edge gateway.',
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black antialiased selection:bg-black selection:text-white">
      {/* Top Navigation */}
      <MarketingNav />

      {/* Page Content */}
      <main className="flex-1 w-full">{children}</main>

      {/* Global Footer */}
      <MarketingFooter />
    </div>
  )
}
