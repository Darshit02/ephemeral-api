'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Ephemeral ErrorBoundary caught]:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white text-black flex flex-col justify-between p-8 sm:p-16 select-none antialiased">
          <div className="flex items-center justify-between border-b border-black pb-4">
            <span className="font-display text-xl font-bold tracking-widest uppercase">
              EPHEMERAL
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-[#525252]">
              FAULT RECOVERY PROTOCOL
            </span>
          </div>

          <div className="my-auto max-w-3xl space-y-6">
            <span className="font-mono text-xs uppercase tracking-widest text-[#525252] block font-semibold">
              UNHANDLED SYSTEM EXCEPTION
            </span>

            <h1 className="font-display text-7xl sm:text-8xl md:text-9xl font-bold tracking-tighter text-black leading-none uppercase">
              ERROR.
            </h1>

            {/* Decorative 4px black rule + bordered square */}
            <div className="flex items-center gap-3 my-6">
              <div className="w-10 h-1 bg-black" />
              <div className="w-2.5 h-2.5 border-2 border-black bg-white" />
              <div className="w-24 h-[1px] bg-[#E5E5E5]" />
            </div>

            <p className="font-serif text-xl sm:text-2xl text-black">
              Something went wrong.
            </p>

            {this.state.error?.message && (
              <div className="border border-black p-4 bg-[#F5F5F5] font-mono text-xs text-black break-words leading-relaxed select-all">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Button
                variant="primary"
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto text-xs py-4 px-8"
              >
                RELOAD SYSTEM
              </Button>
              <Link href="/home" className="w-full sm:w-auto">
                <Button variant="ghost" className="w-full sm:w-auto text-xs font-mono uppercase tracking-widest">
                  GO HOME &rarr;
                </Button>
              </Link>
            </div>
          </div>

          <div className="border-t border-[#E5E5E5] pt-4 font-mono text-[10px] text-[#525252] uppercase flex items-center justify-between">
            <span>CORE RECOVERY</span>
            <span>STATUS: HALTED</span>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
