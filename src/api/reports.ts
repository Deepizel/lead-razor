import { exportReportRemote } from '@/api/reports-remote'
import { assertApiConfigured } from '@/lib/require-api'
import type { ExportReportParams } from '@/types/api-report'

export async function exportReport(params: ExportReportParams) {
  assertApiConfigured()
  return exportReportRemote(params)
}
