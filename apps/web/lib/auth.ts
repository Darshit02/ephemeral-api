'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  name: string
  role: 'consumer' | 'provider' | string
}

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  isHydrated: boolean
  setAuth: (token: string, user: User) => void
  logout: () => void
  setHydrated: (val: boolean) => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isHydrated: false,
      setAuth: (token: string, user: User) => {
        if (typeof document !== 'undefined') {
          document.cookie = `ephemeral-token=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Lax`
        }
        set({
          token,
          user,
          isAuthenticated: Boolean(token),
        })
      },
      logout: () => {
        if (typeof document !== 'undefined') {
          document.cookie = 'ephemeral-token=; path=/; max-age=0; SameSite=Lax'
        }
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        })
      },
      setHydrated: (val: boolean) => set({ isHydrated: val }),
    }),
    {
      name: 'ephemeral-auth-session',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token && typeof document !== 'undefined') {
          document.cookie = `ephemeral-token=${encodeURIComponent(state.token)}; path=/; max-age=604800; SameSite=Lax`
        }
        state?.setHydrated(true)
      },
    }
  )
)
