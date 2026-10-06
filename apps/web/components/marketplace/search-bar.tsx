'use client'

import React from 'react'
import { Search01Icon } from '@/components/icons'
import { cn } from '@/lib/utils'

export interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search APIs by title, slug, or capability…',
  className,
}: SearchBarProps) {
  return (
    <div className={cn('relative flex items-center border-b-2 border-black bg-white', className)}>
      <div className="pl-1 pr-3 text-black">
        <Search01Icon size={20} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full py-3 bg-transparent font-serif text-sm md:text-base text-black placeholder:font-mono placeholder:text-xs placeholder:uppercase placeholder:tracking-wider placeholder:text-[#525252] focus:outline-none"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="px-2 font-mono text-xs uppercase text-[#525252] hover:text-black"
          aria-label="Clear search query"
        >
          CLEAR
        </button>
      )}
    </div>
  )
}
