'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { Icons } from '@/components/icons'
import { cn } from '@/lib/utils'

export interface ToastItem {
  id: string
  title?: string
  message: string
  kind?: 'default' | 'success' | 'error'
}

interface ToastContextValue {
  toasts: ToastItem[]
  toast: {
    (message: string, title?: string): void
    success: (message: string, title?: string) => void
    error: (message: string, title?: string) => void
    default: (message: string, title?: string) => void
  }
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

let globalToastFn: ((item: Omit<ToastItem, 'id'>) => void) | null = null

export const toast = {
  default: (message: string, title?: string) => {
    if (globalToastFn) globalToastFn({ message, title, kind: 'default' })
    else console.log('[Toast]', title, message)
  },
  success: (message: string, title?: string) => {
    if (globalToastFn) globalToastFn({ message, title, kind: 'success' })
    else console.log('[Toast Success]', title, message)
  },
  error: (message: string, title?: string) => {
    if (globalToastFn) globalToastFn({ message, title, kind: 'error' })
    else console.error('[Toast Error]', title, message)
  },
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback((item: Omit<ToastItem, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    setToasts((prev) => [...prev, { ...item, id }])
    setTimeout(() => {
      removeToast(id)
    }, 4000)
  }, [removeToast])

  useEffect(() => {
    globalToastFn = addToast
    return () => {
      globalToastFn = null
    }
  }, [addToast])

  const contextValue: ToastContextValue = {
    toasts,
    toast: {
      default: (m, t) => addToast({ message: m, title: t, kind: 'default' }),
      success: (m, t) => addToast({ message: m, title: t, kind: 'success' }),
      error: (m, t) => addToast({ message: m, title: t, kind: 'error' }),
    } as any,
    removeToast,
  }

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {/* Toast Stack (Bottom-Right) */}
      <div
        aria-live="polite"
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto border-2 border-black p-4 bg-black text-white select-none transition-all duration-100 flex items-start gap-3',
              t.kind === 'error' && 'border-white'
            )}
          >
            <div className="mt-0.5 flex-shrink-0">
              {t.kind === 'error' ? (
                <Icons.warning size={18} />
              ) : t.kind === 'success' ? (
                <Icons.check size={18} />
              ) : (
                <div className="w-2.5 h-2.5 border border-white mt-1" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              {t.title && (
                <p className="font-mono text-[10px] uppercase tracking-widest font-bold text-[#A3A3A3] mb-0.5">
                  {t.title}
                </p>
              )}
              <p className="font-serif text-xs text-white leading-relaxed break-words">
                {t.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="p-1 hover:text-[#A3A3A3] transition-colors"
              aria-label="Close notification"
            >
              <Icons.close size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) return toast
  return ctx.toast
}
