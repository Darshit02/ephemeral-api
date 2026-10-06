'use client'

import React, { useState } from 'react'
import { Copy01Icon, CheckmarkCircle02Icon } from '@/components/icons'
import { cn } from '@/lib/utils'

export interface CodeBlockProps {
  code: string
  language?: string
  title?: string
  className?: string
}

export function CodeBlock({
  code,
  language = 'bash',
  title,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('border border-black bg-white select-text', className)}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-black bg-[#F5F5F5] select-none">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#525252]">
          {title || language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 text-black hover:bg-black hover:text-white transition-none font-mono text-[10px] uppercase tracking-wider"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <CheckmarkCircle02Icon size={12} />
              <span>COPIED</span>
            </>
          ) : (
            <>
              <Copy01Icon size={12} />
              <span>COPY</span>
            </>
          )}
        </button>
      </div>

      <pre className="p-4 overflow-x-auto font-mono text-xs leading-relaxed text-black bg-white">
        <code>{code}</code>
      </pre>
    </div>
  )
}
