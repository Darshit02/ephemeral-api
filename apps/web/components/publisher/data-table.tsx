'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export interface Column<T> {
  key: string
  header: string
  className?: string
  headerClassName?: string
  render?: (item: T, index: number) => React.ReactNode
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T, index: number) => string
  onRowClick?: (item: T) => void
  emptyMessage?: string
  className?: string
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = 'No records found in this view.',
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn('w-full border border-black overflow-x-auto', className)}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b-2 border-black bg-white">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'py-3.5 px-4 font-mono text-xs uppercase tracking-widest text-black font-semibold select-none',
                  col.headerClassName
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E5E5]">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-12 px-4 text-center font-serif text-sm italic text-[#525252]"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, idx) => {
              const key = keyExtractor(item, idx)
              const isClickable = Boolean(onRowClick)
              return (
                <tr
                  key={key}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={cn(
                    'bg-white group transition-none',
                    isClickable && 'cursor-pointer hover:bg-black hover:text-white'
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'py-4 px-4 font-serif text-sm text-black group-hover:text-white align-middle',
                        col.className
                      )}
                    >
                      {col.render ? col.render(item, idx) : (item as Record<string, unknown>)[col.key] as React.ReactNode}
                    </td>
                  ))}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
