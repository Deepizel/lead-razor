import { apiPaths } from '@/api/paths'
import { apiBaseUrl, apiRequest } from '@/lib/api-client'

export interface HealthConfigResponse {
  outreachEmail?: boolean
  emailProvider?: string
}

export async function fetchHealthConfigRemote(): Promise<HealthConfigResponse> {
  return apiRequest<HealthConfigResponse>(apiPaths.health.config, {
    silentError: true,
  })
}

export async function checkApiHealthRemote(): Promise<boolean> {
  if (!apiBaseUrl) return false
  try {
    const res = await fetch(`${apiBaseUrl}${apiPaths.health.root}`, { method: 'GET' })
    return res.ok
  } catch {
    return false
  }
}
