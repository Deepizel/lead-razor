import { useQuery } from '@tanstack/react-query'
import { fetchPipelineAnalytics } from '@/api/analytics'
import { hasApiBaseUrl } from '@/lib/api-client'

export const pipelineAnalyticsKeys = {
  all: ['pipeline-analytics'] as const,
  detail: (days: number) => [...pipelineAnalyticsKeys.all, days] as const,
}

export function usePipelineAnalytics(days = 30) {
  return useQuery({
    queryKey: pipelineAnalyticsKeys.detail(days),
    queryFn: () => fetchPipelineAnalytics(days),
    enabled: hasApiBaseUrl(),
  })
}

export function usePipelineAnalyticsApiMode() {
  return hasApiBaseUrl()
}
