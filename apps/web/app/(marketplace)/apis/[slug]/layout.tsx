import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
  children: React.ReactNode
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const formattedTitle = params.slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return {
    title: `${formattedTitle} // Ephemeral API Directory`,
    description: `Inspect live telemetry, rate tiers, pricing manifests, and playground endpoints for ${formattedTitle} on Ephemeral.`,
  }
}

export default function ApiDetailLayout({ children }: Props) {
  return <>{children}</>
}
