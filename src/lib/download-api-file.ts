import { apiBaseUrl, ApiError } from '@/lib/api-client'
import { getAccessToken } from '@/stores/authStore'

function filenameFromDisposition(header: string | null, fallback: string): string {
  if (!header) return fallback
  const utf8 = /filename\*=UTF-8''([^;\n]+)/i.exec(header)
  if (utf8?.[1]) return decodeURIComponent(utf8[1].trim())
  const quoted = /filename="([^"]+)"/i.exec(header)
  if (quoted?.[1]) return quoted[1]
  const plain = /filename=([^;\n]+)/i.exec(header)
  if (plain?.[1]) return plain[1].trim().replace(/"/g, '')
  return fallback
}

async function parseDownloadError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string }
    if (body.error) return body.error
  } catch {
    /* binary or empty */
  }
  return response.statusText || 'Download failed'
}

/** Authenticated GET that saves a file (e.g. .xlsx) in the browser */
export async function downloadApiFile(
  path: string,
  fallbackFilename: string,
  query?: Record<string, string | null | undefined>,
): Promise<void> {
  if (!apiBaseUrl) {
    throw new Error('VITE_API_BASE_URL is not configured')
  }

  const qs = new URLSearchParams()
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value != null && value !== '') qs.set(key, value)
    }
  }
  const queryString = qs.toString()
  const requestUrl = `${apiBaseUrl}${path}${queryString ? `?${queryString}` : ''}`

  const headers = new Headers()
  const token = getAccessToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(requestUrl, { method: 'GET', headers })

  if (!response.ok) {
    const message = await parseDownloadError(response)
    throw new ApiError(message, response.status)
  }

  const blob = await response.blob()
  const filename = filenameFromDisposition(
    response.headers.get('content-disposition'),
    fallbackFilename,
  )

  const blobUrl = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = blobUrl
  anchor.download = filename
  anchor.rel = 'noopener'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(blobUrl)
}
