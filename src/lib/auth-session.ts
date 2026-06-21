import { fetchMe, refreshSession as refreshSessionApi } from '@/api/auth-remote'
import {
  clearAuthSession,
  getRefreshToken,
  useAuthStore,
} from '@/stores/authStore'
import { notify } from '@/stores/toastStore'

let refreshInFlight: Promise<boolean> | null = null
let bootstrapInFlight: Promise<boolean> | null = null
let meSyncInFlight: Promise<void> | null = null
let lastMeSyncAt = 0

/** Avoid hammering GET /api/auth/me (rate limits, e.g. Render 429) */
const ME_SYNC_MIN_INTERVAL_MS = 60_000

/** Call after login already loaded /api/auth/me */
export function markUserProfileSynced(): void {
  lastMeSyncAt = Date.now()
}

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
  lastMeSyncAt = 0
  if (reason) {
    notify.error('Session ended', reason)
  }
  const onAuthPage =
    window.location.pathname === '/' ||
    window.location.pathname.startsWith('/waitlist') ||
    window.location.pathname.startsWith('/login') ||
    window.location.pathname.startsWith('/verify-email') ||
    window.location.pathname.startsWith('/reset-password') ||
    window.location.pathname.startsWith('/waitlist/set-password')
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

/**
 * Refreshes role/status from GET /api/auth/me (not from JWT decode).
 * Throttled and deduped — safe to call from multiple bootstraps.
 */
export async function syncCurrentUser(options?: { force?: boolean }): Promise<void> {
  const force = options?.force ?? false
  const { accessToken, user } = useAuthStore.getState()
  if (!accessToken) return

  const syncedRecently = Date.now() - lastMeSyncAt < ME_SYNC_MIN_INTERVAL_MS
  if (!force && syncedRecently && user?.role != null) {
    return
  }

  if (meSyncInFlight) {
    await meSyncInFlight
    return
  }

  meSyncInFlight = (async () => {
    try {
      const profile = await fetchMe()
      useAuthStore.getState().updateUser(profile)
      lastMeSyncAt = Date.now()
    } catch {
      /* non-fatal — keep persisted user */
    } finally {
      meSyncInFlight = null
    }
  })()

  await meSyncInFlight
}

/**
 * Ensures access token is valid and user profile is loaded (role, status).
 * Called when entering protected routes — deduped if already running.
 */
export async function bootstrapAuthSession(): Promise<boolean> {
  if (bootstrapInFlight) return bootstrapInFlight

  bootstrapInFlight = (async () => {
    const { refreshToken, accessToken, accessTokenExpiresAt } = useAuthStore.getState()
    if (!refreshToken) return false

    const accessValid =
      accessToken &&
      accessTokenExpiresAt &&
      accessTokenExpiresAt - Date.now() > 30_000

    if (accessValid) {
      await syncCurrentUser()
      return true
    }

    const refreshed = await tryRefreshAccessToken()
    if (refreshed) await syncCurrentUser({ force: true })
    return refreshed
  })().finally(() => {
    bootstrapInFlight = null
  })

  return bootstrapInFlight
}
