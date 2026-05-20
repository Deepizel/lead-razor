import { ApiError, hasApiBaseUrl } from '@/lib/api-client'

export function assertApiConfigured(): void {
  if (!hasApiBaseUrl()) {
    throw new ApiError(
      'VITE_API_BASE_URL is not set. Add your backend URL to .env and restart the dev server.',
      503,
    )
  }
}
