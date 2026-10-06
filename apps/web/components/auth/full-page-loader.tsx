'use client'

import React from 'react'

export function FullPageLoader() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-8 select-none antialiased">
      <div className="space-y-4 text-center animate-pulse">
        <h2 className="font-display text-4xl md:text-5xl font-bold tracking-widest uppercase text-black leading-none">
          EPHEMERAL
        </h2>
        <div className="flex items-center justify-center gap-3">
          <div className="w-6 h-[1.5px] bg-black" />
          <div className="w-2 h-2 border border-black bg-white" />
          <div className="w-6 h-[1.5px] bg-black" />
        </div>
        <p className="font-mono text-xs uppercase tracking-widest text-[#525252]">
          VERIFYING ACCESS ENTITLEMENTS…
        </p>
      </div>
    </div>
  )
}
