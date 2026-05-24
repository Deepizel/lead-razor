import { apiPaths } from '@/api/paths'
import { apiRequest } from '@/lib/api-client'
import { downloadApiFile } from '@/lib/download-api-file'
import { normalizeReportTiers } from '@/lib/map-report-tiers'
import { toDateInputValue } from '@/lib/lead-utils'
import type { ExportReportParams, ReportTierDefinition, ReportTiersResponse } from '@/types/api-report'

export async function fetchReportTiersRemote(): Promise<ReportTierDefinition[]> {
  const data = await apiRequest<ReportTiersResponse>(apiPaths.reports.tiers)
  return normalizeReportTiers(data)
}

export async function exportReportRemote(params: ExportReportParams): Promise<void> {
  const today = toDateInputValue(new Date())
  return downloadApiFile(apiPaths.reports.export, `leads_report_${today}.xlsx`, {
    categoryId: params.categoryId ?? undefined,
    tierId: params.tierId ?? undefined,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    limit: params.limit,
  })
}
