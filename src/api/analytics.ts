import { fetchPipelineAnalyticsRemote } from '@/api/analytics-remote'
import { assertApiConfigured } from '@/lib/require-api'
import type { PipelineAnalyticsResponse } from '@/types/api-pipeline'

export async function fetchPipelineAnalytics(
  days = 30,
): Promise<PipelineAnalyticsResponse> {
  assertApiConfigured()
  return fetchPipelineAnalyticsRemote(days)
}
