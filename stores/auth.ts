'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'
import { setAccessToken } from '@/lib/api/client'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  setAuth: (user: User, accessToken: string, refreshToken: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setAuth: (user, accessToken) => {
        setAccessToken(accessToken)
        set({ user, isAuthenticated: true })
      },

      clearAuth: () => {
        setAccessToken(null)
        set({ user: null, isAuthenticated: false })
      },
    }),
    {
      name: 'coreinventory-auth',
    }
  )
)
