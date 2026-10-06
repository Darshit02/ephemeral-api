'use client'

import React from 'react'

export function EnvGuard({ children }: { children: React.ReactNode }) {
  // Client-side environment check fallback
  if (typeof window !== 'undefined' && !(window as any).__EPHEMERAL_ENV_CHECKED__) {
    (window as any).__EPHEMERAL_ENV_CHECKED__ = true
    if (!process.env.NEXT_PUBLIC_CORE_API) {
      console.warn('[Ephemeral Env] NEXT_PUBLIC_CORE_API is not set; falling back to default http://localhost:8081')
    }
  }

  return <>{children}</>
}
