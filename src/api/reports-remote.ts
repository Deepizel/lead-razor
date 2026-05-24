import { apiPaths } from '@/api/paths'
import { downloadApiFile } from '@/lib/download-api-file'
import { toDateInputValue } from '@/lib/lead-utils'
import type { ExportReportParams } from '@/types/api-report'

export async function exportReportRemote(params: ExportReportParams): Promise<void> {
  const today = toDateInputValue(new Date())
  return downloadApiFile(apiPaths.reports.export, `leads_report_${today}.xlsx`, {
    categoryId: params.categoryId ?? undefined,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    limit: params.limit,
  })
}
