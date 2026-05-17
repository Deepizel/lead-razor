import type { ApiErrorBody } from '@/types/api-lead'

/** Server root, e.g. http://localhost:5000 — paths include /api/... */
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
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  if (!apiBaseUrl) {
    throw new Error('VITE_API_BASE_URL is not configured')
  }

  const { timeoutMs = 30_000, ...init } = options
  const headers = new Headers(init.headers)
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      ...init,
      headers,
      signal: controller.signal,
    })

    if (!response.ok) {
      let message = response.statusText
      try {
        const body = (await response.json()) as ApiErrorBody
        if (body.error) message = body.error
      } catch {
        /* ignore */
      }
      throw new ApiError(message, response.status)
    }

    if (response.status === 204) {
      return undefined as T
    }

    return response.json() as Promise<T>
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new ApiError('Request timed out', 408)
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
