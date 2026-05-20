import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthSession, AuthUser } from '@/types/auth'

const REFRESH_KEY = 'leadrazor-auth'
const ACCESS_TTL_MS = 5 * 60 * 1000

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  accessTokenExpiresAt: number | null
  user: AuthUser | null
  setSession: (session: AuthSession) => void
  patchTokens: (accessToken: string, refreshToken: string, expiresAt?: number) => void
  clearSession: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      accessTokenExpiresAt: null,
      user: null,

      setSession: (session) =>
        set({
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
          accessTokenExpiresAt: session.accessTokenExpiresAt,
          user: session.user,
        }),

      patchTokens: (accessToken, refreshToken, expiresAt) =>
        set({
          accessToken,
          refreshToken,
          accessTokenExpiresAt: expiresAt ?? Date.now() + ACCESS_TTL_MS,
        }),

      clearSession: () =>
        set({
          accessToken: null,
          refreshToken: null,
          accessTokenExpiresAt: null,
          user: null,
        }),

      isAuthenticated: () => Boolean(get().refreshToken || get().accessToken),
    }),
    {
      name: REFRESH_KEY,
      partialize: (state) => ({
        refreshToken: state.refreshToken,
        accessToken: state.accessToken,
        accessTokenExpiresAt: state.accessTokenExpiresAt,
        user: state.user,
      }),
    },
  ),
)

export function getAccessToken(): string | null {
  return useAuthStore.getState().accessToken
}

export function getRefreshToken(): string | null {
  return useAuthStore.getState().refreshToken
}

export function clearAuthSession(): void {
  useAuthStore.getState().clearSession()
}
