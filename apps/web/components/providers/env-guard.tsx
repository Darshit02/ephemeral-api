'use client'

import React from 'react'
import { validateEnv } from '@/lib/env'

export function EnvGuard({ children }: { children: React.ReactNode }) {
  if (typeof window !== 'undefined' && !(window as any).__EPHEMERAL_ENV_CHECKED__) {
    (window as any).__EPHEMERAL_ENV_CHECKED__ = true
    const { valid, missing } = validateEnv()
    if (!valid) {
      console.warn(
        `[Ephemeral Environment Warning] Missing configuration variables: ${missing.join(
          ', '
        )}. Fallbacks are in effect.`
      )
    }
  }

  return <>{children}</>
}
