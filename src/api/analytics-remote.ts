import { apiPaths } from '@/api/paths'
import { apiRequest } from '@/lib/api-client'
import type { PipelineAnalyticsResponse } from '@/types/api-pipeline'

/** Clamp to backend range 7–365 */
export function clampPipelineDays(days: number): number {
  return Math.min(365, Math.max(7, Math.round(days)))
}

export async function fetchPipelineAnalyticsRemote(
  days = 30,
): Promise<PipelineAnalyticsResponse> {
  const clamped = clampPipelineDays(days)
  const qs = new URLSearchParams({ days: String(clamped) })
  return apiRequest<PipelineAnalyticsResponse>(
    `${apiPaths.analytics.pipeline}?${qs}`,
    { silentError: true },
  )
}
