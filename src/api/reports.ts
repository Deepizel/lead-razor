import { exportReportRemote, fetchReportTiersRemote } from '@/api/reports-remote'
import { assertApiConfigured } from '@/lib/require-api'
import type { ExportReportParams, ReportTierDefinition } from '@/types/api-report'

export async function fetchReportTiers(): Promise<ReportTierDefinition[]> {
  assertApiConfigured()
  return fetchReportTiersRemote()
}

/** Loads tier definitions first, then downloads the filtered report */
export async function exportReport(params: ExportReportParams) {
  assertApiConfigured()
  await fetchReportTiersRemote()
  return exportReportRemote(params)
}
