'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { CheckmarkCircle02Icon, Alert02Icon, Cancel01Icon } from '@/components/icons'

export interface ToastItem {
  id: string
  title?: string
  message: string
  type?: 'success' | 'error' | 'info'
}

interface ToastContextType {
  toasts: ToastItem[]
  addToast: (toast: Omit<ToastItem, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

let globalAddToast: ((t: Omit<ToastItem, 'id'>) => void) | null = null

export const toast = {
  success: (message: string, title?: string) => {
    if (globalAddToast) globalAddToast({ message, title, type: 'success' })
    else console.log('[Toast Success]', message)
  },
  error: (message: string, title?: string) => {
    if (globalAddToast) globalAddToast({ message, title, type: 'error' })
    else console.error('[Toast Error]', message)
  },
  info: (message: string, title?: string) => {
    if (globalAddToast) globalAddToast({ message, title, type: 'info' })
    else console.log('[Toast Info]', message)
  },
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback((toastData: Omit<ToastItem, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    setToasts((prev) => [...prev, { ...toastData, id }])
    setTimeout(() => {
      removeToast(id)
    }, 4000)
  }, [removeToast])

  useEffect(() => {
    globalAddToast = addToast
    return () => {
      globalAddToast = null
    }
  }, [addToast])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto p-4 border-2 border-black bg-white flex items-start gap-3 shadow-none animate-in slide-in-from-bottom-5 duration-100',
              t.type === 'error' && 'bg-black text-white border-black'
            )}
          >
            <div className="mt-0.5 flex-shrink-0">
              {t.type === 'error' ? (
                <Alert02Icon size={18} />
              ) : (
                <CheckmarkCircle02Icon size={18} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              {t.title && (
                <p className="font-mono text-xs uppercase tracking-widest font-bold mb-0.5">
                  {t.title}
                </p>
              )}
              <p className="font-serif text-xs leading-relaxed break-words">
                {t.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="p-1 hover:opacity-70 transition-opacity"
              aria-label="Dismiss toast"
            >
              <Cancel01Icon size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    return toast
  }
  return {
    ...toast,
    addToast: context.addToast,
    removeToast: context.removeToast,
  }
}
