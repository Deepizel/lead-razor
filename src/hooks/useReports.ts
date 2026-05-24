import { useMutation, useQuery } from '@tanstack/react-query'
import { exportReport, fetchReportTiers } from '@/api/reports'
import { hasApiBaseUrl } from '@/lib/api-client'
import { notify } from '@/stores/toastStore'
import type { ExportReportParams } from '@/types/api-report'

export const reportKeys = {
  all: ['reports'] as const,
  tiers: () => [...reportKeys.all, 'tiers'] as const,
}

export function useReportTiers(enabled = true) {
  return useQuery({
    queryKey: reportKeys.tiers(),
    queryFn: fetchReportTiers,
    enabled: enabled && hasApiBaseUrl(),
  })
}

export function useExportReport() {
  return useMutation({
    mutationFn: (params: ExportReportParams) => exportReport(params),
    onSuccess: () => {
      notify.success('Report ready', 'Your leads report should download shortly.')
    },
  })
}

export function useReportsApiMode() {
  return hasApiBaseUrl()
}
