import type { ApiErrorBody } from '@/types/api-lead'
import { getAccessToken, useAuthStore } from '@/stores/authStore'
import { forceLogout, tryRefreshAccessToken } from '@/lib/auth-session'
import { notify } from '@/stores/toastStore'

/** Server root, e.g. https://lead-razor-backend.onrender.com */
function resolveBaseUrl(): string {
  const raw =
    import.meta.env.VITE_API_BASE_URL ??
    import.meta.env.VITE_API_URL ??
    ''
  return raw.replace(/\/$/, '')
}

export const apiBaseUrl = resolveBaseUrl()

export function hasApiBaseUrl(): boolean {
  return Boolean(apiBaseUrl)
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export interface ApiRequestOptions extends RequestInit {
  timeoutMs?: number
  /** Public routes (login, signup, refresh) */
  skipAuth?: boolean
  /** Do not toast errors (caller handles) */
  silentError?: boolean
  /** Internal: retry after refresh */
  _retry?: boolean
}

function buildHeaders(init: RequestInit, skipAuth: boolean): Headers {
  const headers = new Headers(init.headers)
  const isFormData = init.body instanceof FormData
  if (init.body && !isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (!skipAuth) {
    const token = getAccessToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }
  return headers
}

function shouldForceLogout(status: number, hadAuth: boolean): boolean {
  if (!hadAuth) return false
  // Only session/auth failures — not validation errors (400) from business logic
  return status === 401
}

async function parseErrorMessage(response: Response): Promise<string> {
  let message = response.statusText
  try {
    const body = (await response.json()) as ApiErrorBody
    if (body.error) message = body.error
  } catch {
    /* ignore */
  }
  return message
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  if (!apiBaseUrl) {
    throw new Error('VITE_API_BASE_URL is not configured')
  }

  const { timeoutMs = 30_000, skipAuth = false, silentError = false, _retry = false, ...init } =
    options

  const headers = buildHeaders(init, skipAuth)
  const hadAuth = headers.has('Authorization')

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      ...init,
      headers,
      signal: controller.signal,
    })

    if (!response.ok) {
      const message = await parseErrorMessage(response)

      if (shouldForceLogout(response.status, hadAuth) && !_retry && !skipAuth) {
        if (response.status === 401) {
          const refreshed = await tryRefreshAccessToken()
          if (refreshed) {
            return apiRequest<T>(path, { ...options, _retry: true })
          }
        }
        forceLogout(message)
        throw new ApiError(message, response.status)
      }

      if (response.status === 403 && hadAuth) {
        const lower = message.toLowerCase()
        if (lower.includes('verif') || lower.includes('confirm')) {
          forceLogout(message)
        }
      }

      if (!silentError) {
        notify.error(message)
      }
      throw new ApiError(message, response.status)
    }

    if (response.status === 204) {
      return undefined as T
    }

    const contentType = response.headers.get('content-type') ?? ''
    const text = await response.text()

    if (!text.trim()) {
      return undefined as T
    }

    if (!contentType.includes('application/json')) {
      return text as T
    }

    try {
      return JSON.parse(text) as T
    } catch {
      return text as T
    }
  } catch (err) {
    if (err instanceof ApiError) throw err
    if (err instanceof Error && err.name === 'AbortError') {
      const timeoutErr = new ApiError('Request timed out', 408)
      if (!silentError) notify.error(timeoutErr.message)
      throw timeoutErr
    }
    if (err instanceof Error && !silentError) {
      notify.error(err.message)
    }
    throw err
  } finally {
    clearTimeout(timeout)
  }
}

export async function checkApiHealth(): Promise<boolean> {
  if (!apiBaseUrl) return false
  try {
    const res = await fetch(apiBaseUrl, { method: 'GET' })
    return res.ok
  } catch {
    return false
  }
}

export function isAuthenticated(): boolean {
  return useAuthStore.getState().isAuthenticated()
}
