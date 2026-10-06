'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert02Icon, Cancel01Icon } from '@/components/icons'
import { cn } from '@/lib/utils'

export interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  requiredConfirmString?: string
  isDestructive?: boolean
  className?: string
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'CONFIRM ACTION',
  cancelText = 'CANCEL',
  requiredConfirmString,
  isDestructive = false,
  className,
}: ConfirmDialogProps) {
  const [inputVal, setInputVal] = useState('')

  useEffect(() => {
    if (!isOpen) {
      setInputVal('')
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const isConfirmedDisabled =
    Boolean(requiredConfirmString) && inputVal.trim() !== requiredConfirmString

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-none"
    >
      <div
        className={cn(
          'w-full max-w-lg bg-white border-2 border-black p-8 relative animate-in fade-in zoom-in-95 duration-100',
          className
        )}
      >
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-6 right-6 p-2 text-black hover:bg-black hover:text-white transition-none"
        >
          <Cancel01Icon size={20} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          {isDestructive && (
            <div className="p-2 border border-black bg-black text-white">
              <Alert02Icon size={20} />
            </div>
          )}
          <h2 className="font-display text-2xl font-bold tracking-tight text-black">
            {title}
          </h2>
        </div>

        <p className="font-serif text-sm text-[#525252] leading-relaxed mb-6">
          {description}
        </p>

        {requiredConfirmString && (
          <div className="mb-6 border-t border-[#E5E5E5] pt-4">
            <label className="block font-mono text-xs uppercase tracking-widest text-black font-semibold mb-2">
              Type <span className="font-bold underline">{requiredConfirmString}</span> to confirm:
            </label>
            <Input
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={requiredConfirmString}
              className="font-mono text-sm"
            />
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-black pt-6">
          <Button variant="secondary" onClick={onClose}>
            {cancelText}
          </Button>
          <Button
            variant="primary"
            disabled={isConfirmedDisabled}
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={cn(
              isDestructive && 'bg-black text-white hover:bg-white hover:text-black border-2 border-black'
            )}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}
