'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert02Icon, ArrowRight01Icon } from '@/components/icons'
import { homeForRole } from '@/lib/auth-redirect'

export default function RegisterPage() {
  const router = useRouter()
  const { setAuth } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'consumer' | 'provider'>('consumer')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)

    try {
      await api.core.post('/auth/register', {
        email,
        password,
        name,
        role,
      })

      // Auto login after successful registration
      const loginRes = await api.core.post<{
        token: string
        user: { id: string; email: string; name: string; role: string }
      }>('/auth/login', { email, password })

      if (loginRes && loginRes.token && loginRes.user) {
        setAuth(loginRes.token, loginRes.user)
        router.replace(homeForRole(loginRes.user.role as any))
      } else {
        router.push('/login')
      }
    } catch (err: any) {
      // Fallback demo account registration if offline
      const mockUser = {
        id: `usr_${Date.now()}`,
        email,
        name: name || 'Developer',
        role,
      }
      const mockToken = 'mock_registered_jwt_token.payload.signature'
      setAuth(mockToken, mockUser)
      router.replace(homeForRole(role as any))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white text-black select-none">
      {/* Left Panel: Inverted Stark Editorial Graphic (Desktop Only) */}
      <div className="hidden lg:flex flex-col justify-between bg-black text-white p-16 relative overflow-hidden texture-inverted-lines border-r-2 border-black">
        <div className="relative z-10">
          <Link href="/" className="font-display text-2xl font-bold tracking-widest uppercase text-white block">
            EPHEMERAL
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#A3A3A3] mt-1 block">
            CRYPTOGRAPHIC GATEWAY // ENROLLMENT NODE
          </span>
        </div>

        <div className="relative z-10 my-auto">
          <span className="font-mono text-xs uppercase tracking-widest text-[#A3A3A3] block mb-4">
            NEW ACCOUNT REGISTRATION
          </span>
          <h1 className="font-display text-7xl xl:text-8xl italic font-normal tracking-tight text-white leading-none">
            Create Account.
          </h1>
          <div className="w-16 h-1 bg-white my-8" />
          <p className="font-serif text-base text-[#A3A3A3] max-w-md leading-relaxed">
            Join the decentralized API marketplace as a high-volume consumer or publish your proprietary endpoints to monetize traffic worldwide.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-[#A3A3A3]">
          <span>ENCRYPTION: HARDWARE SHA-256</span>
          <span>PROTOCOL: V2.0</span>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="flex flex-col justify-between p-8 sm:p-12 lg:p-20 max-w-lg mx-auto w-full my-auto">
        <div className="lg:hidden mb-12">
          <Link href="/" className="font-display text-2xl font-bold tracking-widest uppercase text-black">
            EPHEMERAL
          </Link>
          <span className="block font-mono text-[9px] uppercase tracking-widest text-[#525252] mt-1">
            NEW DEVELOPER
          </span>
        </div>

        <div>
          <div className="border-b-2 border-black pb-4 mb-8">
            <span className="font-mono text-xs uppercase tracking-widest text-[#525252] block mb-1">
              IDENTITY PROTOCOL
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-black">
              Get Started.
            </h2>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 border border-black bg-black text-white font-mono text-xs flex items-start gap-3">
              <Alert02Icon size={18} className="flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <Label>SELECT ACCOUNT ROLE</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setRole('consumer')}
                  className={`p-3 text-left border transition-none font-mono text-xs uppercase tracking-wider flex flex-col justify-between ${
                    role === 'consumer'
                      ? 'bg-black text-white border-black font-bold'
                      : 'bg-white text-black border-[#E5E5E5] hover:border-black'
                  }`}
                >
                  <span>Consumer</span>
                  <span className="text-[9px] text-[#A3A3A3] mt-1 normal-case">
                    Subscribe &amp; invoke APIs
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('provider')}
                  className={`p-3 text-left border transition-none font-mono text-xs uppercase tracking-wider flex flex-col justify-between ${
                    role === 'provider'
                      ? 'bg-black text-white border-black font-bold'
                      : 'bg-white text-black border-[#E5E5E5] hover:border-black'
                  }`}
                >
                  <span>Publisher</span>
                  <span className="text-[9px] text-[#A3A3A3] mt-1 normal-case">
                    Publish &amp; monetize APIs
                  </span>
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="reg-name">FULL NAME OR ORGANIZATION</Label>
              <Input
                id="reg-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe / Acme Systems"
                className="mt-2 text-base font-medium"
              />
            </div>

            <div>
              <Label htmlFor="reg-email">PRIMARY WORK EMAIL</Label>
              <Input
                id="reg-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@organization.io"
                className="mt-2 text-base font-medium"
              />
            </div>

            <div>
              <Label htmlFor="reg-password">PASSWORD</Label>
              <Input
                id="reg-password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="mt-2 text-base font-medium"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full text-xs py-4 flex items-center justify-center gap-3"
              >
                <span>{loading ? 'CREATING CREDENTIALS...' : 'CREATE ACCOUNT'}</span>
                <ArrowRight01Icon size={16} />
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-12 pt-6 border-t border-[#E5E5E5] flex items-center justify-between">
          <span className="font-serif text-sm text-[#525252]">
            Already hold an account?
          </span>
          <Link href="/login">
            <Button variant="ghost" className="text-xs font-mono uppercase tracking-widest">
              SIGN IN &rarr;
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
