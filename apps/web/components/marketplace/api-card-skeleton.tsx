import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export function ApiCardSkeleton() {
  return (
    <div className="border border-black p-8 bg-white flex flex-col justify-between h-[280px]">
      <div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-4" />
        </div>
        <Skeleton className="h-7 w-3/4 mt-4" />
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-[#E5E5E5] flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  )
}
