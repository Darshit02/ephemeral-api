import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing // Ephemeral API Platform',
  description:
    'Transparent API monetization and consumer tiers. Fixed monthly retainers, metered burst credits, and zero hidden surcharge fees.',
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
