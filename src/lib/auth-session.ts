import { refreshSession as refreshSessionApi } from '@/api/auth-remote'
import {
  clearAuthSession,
  getRefreshToken,
  useAuthStore,
} from '@/stores/authStore'
import { notify } from '@/stores/toastStore'

let refreshInFlight: Promise<boolean> | null = null

export async function tryRefreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return false

  if (refreshInFlight) return refreshInFlight

  refreshInFlight = (async () => {
    try {
      const session = await refreshSessionApi({ refreshToken })
      useAuthStore.getState().setSession(session)
      return true
    } catch {
      return false
    } finally {
      refreshInFlight = null
    }
  })()

  return refreshInFlight
}

export function forceLogout(reason?: string): void {
  clearAuthSession()
  if (reason) {
    notify.error('Session ended', reason)
  }
  const onAuthPage =
    window.location.pathname === '/' ||
    window.location.pathname.startsWith('/verify-email') ||
    window.location.pathname.startsWith('/reset-password')
  if (!onAuthPage) {
    window.location.assign('/')
  }
}

/** Proactive refresh ~1 min before access expiry */
export function scheduleTokenRefresh(): () => void {
  const interval = window.setInterval(
    () => {
      const { accessTokenExpiresAt, refreshToken } = useAuthStore.getState()
      if (!refreshToken) return
      const expiresSoon =
        !accessTokenExpiresAt || accessTokenExpiresAt - Date.now() < 60_000
      if (expiresSoon) {
        void tryRefreshAccessToken()
      }
    },
    4 * 60 * 1000,
  )
  return () => window.clearInterval(interval)
}

export async function bootstrapAuthSession(): Promise<boolean> {
  const { refreshToken, accessToken, accessTokenExpiresAt } = useAuthStore.getState()
  if (!refreshToken) return false

  const accessValid =
    accessToken &&
    accessTokenExpiresAt &&
    accessTokenExpiresAt - Date.now() > 30_000

  if (accessValid) return true

  return tryRefreshAccessToken()
}
