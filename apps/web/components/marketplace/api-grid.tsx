import React from 'react'
import { cn } from '@/lib/utils'

export function ApiGrid({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch',
        className
      )}
    >
      {children}
    </div>
  )
}
