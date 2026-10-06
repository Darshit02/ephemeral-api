import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface TableSkeletonProps {
  columns?: number
  rows?: number
  className?: string
}

export function TableSkeleton({
  columns = 5,
  rows = 5,
  className = '',
}: TableSkeletonProps) {
  return (
    <div className={`w-full border border-black overflow-x-auto bg-white ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b-2 border-black bg-white">
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="py-3.5 px-4">
                <Skeleton className="h-3 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E5E5]">
          {Array.from({ length: rows }).map((_, rIdx) => (
            <tr key={rIdx}>
              {Array.from({ length: columns }).map((_, cIdx) => (
                <td key={cIdx} className="py-4 px-4">
                  <Skeleton
                    className={`h-4 ${
                      cIdx === 0 ? 'w-32' : cIdx === columns - 1 ? 'w-16' : 'w-24'
                    }`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
