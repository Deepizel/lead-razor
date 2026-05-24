import { useQuery } from '@tanstack/react-query'
import { fetchHealthConfigRemote } from '@/api/health-remote'
import { apiBaseUrl, checkApiHealth, hasApiBaseUrl } from '@/lib/api-client'

export const apiHealthKeys = {
  all: ['api-health'] as const,
  config: ['api-health', 'config'] as const,
}

export function useApiHealth() {
  return useQuery({
    queryKey: apiHealthKeys.all,
    queryFn: checkApiHealth,
    enabled: hasApiBaseUrl(),
    staleTime: 60_000,
    retry: 1,
  })
}

export function useApiConfig() {
  return {
    isConfigured: hasApiBaseUrl(),
    baseUrl: apiBaseUrl,
  }
}

export function useHealthConfig() {
  return useQuery({
    queryKey: apiHealthKeys.config,
    queryFn: fetchHealthConfigRemote,
    enabled: hasApiBaseUrl(),
    staleTime: 120_000,
  })
}
