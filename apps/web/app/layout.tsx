import type { Metadata } from 'next'
import { Playfair_Display, Source_Serif_4, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { ToastProvider } from '@/components/providers/toast-provider'
import { ErrorBoundary } from '@/components/providers/error-boundary'
import { EnvGuard } from '@/components/providers/env-guard'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-source-serif',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Ephemeral — Decentralized API Marketplace',
  description: 'Rent, publish, and consume production APIs through an ultra-low latency cryptographic edge gateway.',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${sourceSerif.variable} ${jetbrains.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body className="bg-white text-black font-serif antialiased min-h-screen selection:bg-black selection:text-white">
        <ErrorBoundary>
          <Providers>
            <ToastProvider>
              <EnvGuard>{children}</EnvGuard>
            </ToastProvider>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}
