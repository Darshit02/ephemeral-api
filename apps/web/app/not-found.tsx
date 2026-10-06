import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft02Icon, ArrowRight01Icon } from '@/components/icons'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-between p-8 md:p-16 selection:bg-black selection:text-white">
      {/* Top brand header */}
      <div className="flex items-center justify-between border-b border-black pb-6">
        <Link href="/" className="font-display text-2xl font-bold tracking-tight hover:opacity-75">
          EPHEMERAL
        </Link>
        <span className="font-mono text-xs uppercase tracking-widest text-[#525252]">
          SYSTEM // 404_PAGE_NOT_FOUND
        </span>
      </div>

      {/* Main 404 Statement */}
      <div className="max-w-4xl py-20">
        <div className="font-mono text-xs uppercase tracking-widest text-[#525252] mb-4">
          INDEXING EXCEPTION &bull; ROUTE DESYNCHRONIZED
        </div>

        <h1 className="font-display text-7xl sm:text-9xl md:text-[14rem] font-bold tracking-tighter leading-none select-none">
          404
        </h1>

        {/* Rule with square marker */}
        <div className="w-full h-px bg-black relative my-8">
          <div className="absolute right-0 -top-1 w-2 h-2 bg-black" />
        </div>

        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Page not found.
        </h2>

        <p className="font-serif text-lg md:text-xl text-[#525252] max-w-2xl leading-relaxed mb-10">
          The requested endpoint, manifest record, or administrative console does not exist or has been relocated to another URI.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Link href="/home">
            <Button variant="primary" className="flex items-center gap-2">
              <ArrowLeft02Icon size={16} />
              <span>RETURN HOME</span>
            </Button>
          </Link>
          <Link href="/apis">
            <Button variant="secondary" className="flex items-center gap-2">
              <span>EXPLORE MARKETPLACE</span>
              <ArrowRight01Icon size={16} />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer attribution */}
      <div className="border-t border-[#E5E5E5] pt-6 flex flex-col sm:flex-row items-baseline justify-between gap-4 font-mono text-xs text-[#525252]">
        <span>EPHEMERAL API MARKETPLACE &bull; ALL RIGHTS RESERVED</span>
        <span className="uppercase tracking-widest">STATUS: NOMINAL</span>
      </div>
    </div>
  )
}
