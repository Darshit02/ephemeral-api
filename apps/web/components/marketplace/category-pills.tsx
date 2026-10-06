'use client'

import React from 'react'

export interface CategoryPillsProps {
  categories: string[]
  selected: string
  onSelect: (category: string) => void
}

export function CategoryPills({
  categories,
  selected,
  onSelect,
}: CategoryPillsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {categories.map((cat) => {
        const isSelected = selected.toUpperCase() === cat.toUpperCase()
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-widest border transition-none whitespace-nowrap select-none ${
              isSelected
                ? 'bg-black text-white border-black font-bold'
                : 'bg-white text-black border-[#E5E5E5] hover:border-black'
            }`}
          >
            {cat}
          </button>
        )
      })}
    </div>
  )
}
