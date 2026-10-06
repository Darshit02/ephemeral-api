import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'API Marketplace // Ephemeral Live Services',
  description:
    'Discover, benchmark, and subscribe to high-throughput, production-ready APIs across machine learning, fintech, geospatial intelligence, and security.',
}

export default function MarketplaceApisLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
