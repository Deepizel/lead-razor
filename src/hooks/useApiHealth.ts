import { useQuery } from '@tanstack/react-query'
import { apiBaseUrl, checkApiHealth, hasApiBaseUrl } from '@/lib/api-client'

export const apiHealthKeys = {
  all: ['api-health'] as const,
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
