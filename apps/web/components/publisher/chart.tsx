'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

export interface ChartDataPoint {
  label: string
  value: number
  secondaryValue?: number
}

export interface MetricChartProps {
  title: string
  subtitle?: string
  data: ChartDataPoint[]
  type?: 'line' | 'bar' | 'area'
  height?: number
  valueFormatter?: (val: number) => string
  className?: string
}

export function MetricChart({
  title,
  subtitle,
  data,
  type = 'line',
  height = 240,
  valueFormatter = (v) => v.toLocaleString(),
  className,
}: MetricChartProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null)

  if (!data || data.length === 0) {
    return (
      <div className={cn('border border-black p-6 bg-white', className)}>
        <p className="font-mono text-xs uppercase tracking-widest text-[#525252]">
          {title} — NO DATA RECORDED
        </p>
      </div>
    )
  }

  const values = data.map((d) => d.value)
  const maxVal = Math.max(...values, 1)
  const minVal = Math.min(...values, 0)
  const range = maxVal - minVal || 1

  // SVG dimensions
  const svgWidth = 600
  const svgHeight = height
  const paddingLeft = 50
  const paddingRight = 20
  const paddingTop = 20
  const paddingBottom = 35

  const plotWidth = svgWidth - paddingLeft - paddingRight
  const plotHeight = svgHeight - paddingTop - paddingBottom

  const getX = (index: number) => {
    if (data.length <= 1) return paddingLeft + plotWidth / 2
    return paddingLeft + (index / (data.length - 1)) * plotWidth
  }

  const getY = (val: number) => {
    const norm = (val - minVal) / range
    return paddingTop + plotHeight - norm * plotHeight
  }

  // Generate SVG path for line/area
  const points = data.map((d, i) => `${getX(i)},${getY(d.value)}`).join(' ')
  const linePath = `M ${points}`
  const areaPath = `M ${getX(0)},${paddingTop + plotHeight} L ${points} L ${getX(data.length - 1)},${paddingTop + plotHeight} Z`

  // 4 Y-axis ticks
  const yTicks = [0, 0.33, 0.66, 1].map((ratio) => {
    const val = minVal + ratio * range
    const yPos = paddingTop + plotHeight - ratio * plotHeight
    return { val, yPos }
  })

  const activePoint = activeIdx !== null ? data[activeIdx] : null

  return (
    <div className={cn('border border-black bg-white p-6', className)}>
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-4 pb-3 border-b border-[#E5E5E5] gap-2">
        <div>
          <h3 className="font-display text-lg font-bold text-black tracking-tight">{title}</h3>
          {subtitle && (
            <p className="font-mono text-xs text-[#525252] uppercase tracking-wider mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        {activePoint ? (
          <div className="text-left sm:text-right font-mono">
            <span className="text-xs uppercase tracking-widest text-[#525252] mr-2">
              {activePoint.label}:
            </span>
            <span className="text-sm font-bold text-black">
              {valueFormatter(activePoint.value)}
            </span>
          </div>
        ) : (
          <div className="text-left sm:text-right font-mono text-xs text-[#525252] uppercase tracking-widest">
            Peak: {valueFormatter(maxVal)}
          </div>
        )}
      </div>

      {/* SVG Plot */}
      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible select-none"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          {yTicks.map((t, idx) => (
            <g key={idx}>
              <line
                x1={paddingLeft}
                y1={t.yPos}
                x2={svgWidth - paddingRight}
                y2={t.yPos}
                stroke="#E5E5E5"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <text
                x={paddingLeft - 8}
                y={t.yPos + 3}
                textAnchor="end"
                className="font-mono text-[9px] fill-[#525252]"
              >
                {valueFormatter(Math.round(t.val))}
              </text>
            </g>
          ))}

          {/* Bar Chart Type */}
          {type === 'bar' && (
            <g>
              {data.map((d, i) => {
                const barWidth = Math.max(plotWidth / data.length - 6, 4)
                const x = getX(i) - barWidth / 2
                const y = getY(d.value)
                const barH = paddingTop + plotHeight - y
                const isActive = activeIdx === i

                return (
                  <rect
                    key={i}
                    x={x}
                    y={y}
                    width={barWidth}
                    height={Math.max(barH, 1)}
                    fill={isActive ? '#000000' : '#000000'}
                    opacity={isActive ? 1 : 0.85}
                    className="cursor-pointer transition-none"
                    onMouseEnter={() => setActiveIdx(i)}
                    onMouseLeave={() => setActiveIdx(null)}
                  />
                )
              })}
            </g>
          )}

          {/* Area Chart Type */}
          {type === 'area' && (
            <>
              <path d={areaPath} fill="#000000" opacity="0.06" />
              <path
                d={linePath}
                fill="none"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="square"
              />
            </>
          )}

          {/* Line Chart Type */}
          {type === 'line' && (
            <path
              d={linePath}
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="square"
            />
          )}

          {/* Hover points & triggers for line/area */}
          {type !== 'bar' &&
            data.map((d, i) => {
              const cx = getX(i)
              const cy = getY(d.value)
              const isActive = activeIdx === i

              return (
                <g key={i}>
                  {/* Invisible target area */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={12}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setActiveIdx(i)}
                    onMouseLeave={() => setActiveIdx(null)}
                  />
                  {/* Visual Node */}
                  {isActive && (
                    <>
                      <circle cx={cx} cy={cy} r={5} fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
                      <line
                        x1={cx}
                        y1={paddingTop}
                        x2={cx}
                        y2={paddingTop + plotHeight}
                        stroke="#000000"
                        strokeWidth="1"
                        strokeDasharray="3 3"
                      />
                    </>
                  )}
                </g>
              )
            })}

          {/* X Axis Labels */}
          {data.map((d, i) => {
            // Show select labels to avoid crowding
            const shouldShow =
              data.length <= 8 ||
              i === 0 ||
              i === data.length - 1 ||
              i === Math.floor(data.length / 2)

            if (!shouldShow) return null

            return (
              <text
                key={i}
                x={getX(i)}
                y={paddingTop + plotHeight + 18}
                textAnchor={i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle'}
                className="font-mono text-[9px] uppercase tracking-wider fill-[#525252]"
              >
                {d.label}
              </text>
            )
          })}
        </svg>
      </div>

      {/* Accessible Text Alternative (for Screen Readers & Table Fallback) */}
      <details className="mt-4 border-t border-[#E5E5E5] pt-2">
        <summary className="font-mono text-[10px] uppercase tracking-widest text-[#525252] cursor-pointer hover:text-black">
          View Tabular Data (Screen Reader Accessible)
        </summary>
        <div className="mt-2 max-h-36 overflow-y-auto border border-[#E5E5E5]">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-black bg-[#F5F5F5]">
                <th className="py-1 px-3">Interval</th>
                <th className="py-1 px-3 text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={i} className="border-b border-[#E5E5E5]">
                  <td className="py-1 px-3">{d.label}</td>
                  <td className="py-1 px-3 text-right font-bold">{valueFormatter(d.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}
