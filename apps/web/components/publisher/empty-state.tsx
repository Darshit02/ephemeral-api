'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  actionHref?: string
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'border border-black p-12 md:p-16 text-center bg-white flex flex-col items-center justify-center',
        className
      )}
    >
      {icon && (
        <div className="mb-6 p-4 border border-black inline-flex items-center justify-center bg-white">
          {icon}
        </div>
      )}
      <h3 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-black max-w-xl">
        {title}
      </h3>
      <p className="font-serif text-base text-[#525252] max-w-md mt-4 leading-relaxed">
        {description}
      </p>
      {(actionLabel && (onAction || actionHref)) && (
        <div className="mt-8">
          {actionHref ? (
            <a href={actionHref}>
              <Button variant="primary">{actionLabel}</Button>
            </a>
          ) : (
            <Button variant="primary" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
