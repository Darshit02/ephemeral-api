'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { FullPageLoader } from '@/components/auth/full-page-loader'

type Props = {
  allowed: Array<'consumer' | 'provider' | 'admin'>
  children: React.ReactNode
}

export function RoleGuard({ allowed, children }: Props) {
  const { user, token, isHydrated } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !isHydrated) return

    if (!token || !user) {
      router.replace('/login')
      return
    }

    if (!allowed.includes(user.role as any)) {
      // Redirect to their correct dashboard based on role
      router.replace(user.role === 'consumer' ? '/dashboard' : '/publisher/dashboard')
    }
  }, [mounted, isHydrated, token, user, allowed, router])

  if (!mounted || !isHydrated || !token || !user || !allowed.includes(user.role as any)) {
    return <FullPageLoader />
  }

  return <>{children}</>
}
