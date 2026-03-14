import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { setAccessToken } from '@/lib/api/client';

interface AuthState {
  user: User | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken, refreshToken) => {
        setAccessToken(accessToken);
        set({ user, refreshToken, isAuthenticated: true });
      },

      clearAuth: () => {
        setAccessToken(null);
        set({ user: null, refreshToken: null, isAuthenticated: false });
      },
    }),
    {
      name: 'coreinventory-auth',
      partialState: (state: AuthState) => ({ refreshToken: state.refreshToken }),
    }
  )
);
