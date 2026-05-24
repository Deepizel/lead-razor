import { useMutation } from '@tanstack/react-query'
import { exportReport } from '@/api/reports'
import { hasApiBaseUrl } from '@/lib/api-client'
import { notify } from '@/stores/toastStore'
import type { ExportReportParams } from '@/types/api-report'

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
