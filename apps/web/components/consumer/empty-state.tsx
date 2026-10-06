import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export interface ConsumerEmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
}

export function ConsumerEmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: ConsumerEmptyStateProps) {
  return (
    <div className="border border-black p-12 md:p-16 text-center bg-white flex flex-col items-center justify-center select-none">
      {icon && (
        <div className="mb-6 p-4 border border-black inline-flex items-center justify-center bg-white text-black">
          {icon}
        </div>
      )}
      <h3 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-black max-w-xl">
        {title}
      </h3>
      <p className="font-serif text-base text-[#525252] max-w-md mt-4 leading-relaxed">
        {description}
      </p>

      {actionLabel && (
        <div className="mt-8">
          {actionHref ? (
            <Link href={actionHref}>
              <Button variant="primary">{actionLabel}</Button>
            </Link>
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
