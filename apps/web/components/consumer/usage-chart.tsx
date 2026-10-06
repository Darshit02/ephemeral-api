'use client'

import React, { useState } from 'react'

export interface DailyUsagePoint {
  date: string
  requests: number
}

export function ConsumerUsageChart({
  data,
  title = 'Ingress Calls per Day',
  height = 200,
}: {
  data: DailyUsagePoint[]
  title?: string
  height?: number
}) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null)

  if (!data || data.length === 0) {
    return (
      <div className="border border-black p-8 bg-white text-center font-mono text-xs text-[#525252] uppercase">
        No telemetry records recorded for this time window.
      </div>
    )
  }

  const values = data.map((d) => d.requests)
  const maxVal = Math.max(...values, 1)

  const activePoint = activeIdx !== null ? data[activeIdx] : null

  return (
    <div className="border border-black p-6 bg-white space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
        <h3 className="font-display text-lg font-bold tracking-tight text-black">
          {title}
        </h3>
        <div className="font-mono text-xs text-[#525252]">
          {activePoint ? (
            <span>
              <strong className="text-black">{activePoint.date}:</strong> {activePoint.requests.toLocaleString()} calls
            </span>
          ) : (
            <span>PEAK: {maxVal.toLocaleString()} calls</span>
          )}
        </div>
      </div>

      {/* SVG Bar Chart */}
      <div className="w-full pt-4">
        <div className="flex items-end justify-between gap-1.5 h-44 border-b border-black pb-2">
          {data.map((d, i) => {
            const heightPercent = Math.max(Math.round((d.requests / maxVal) * 100), 2)
            const isActive = activeIdx === i

            return (
              <div
                key={i}
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(null)}
                className="flex-1 h-full flex flex-col justify-end items-center group cursor-pointer"
              >
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full transition-none ${
                    isActive ? 'bg-[#525252]' : 'bg-black'
                  }`}
                />
              </div>
            )
          })}
        </div>

        {/* Date labels */}
        <div className="flex justify-between font-mono text-[9px] uppercase tracking-wider text-[#525252] pt-2">
          <span>{data[0]?.date}</span>
          {data.length > 2 && <span>{data[Math.floor(data.length / 2)]?.date}</span>}
          <span>{data[data.length - 1]?.date}</span>
        </div>
      </div>
    </div>
  )
}
