/** GET /api/reports/tiers — tier definition for report filters */
export interface ReportTierDefinition {
  id: string
  label: string
  min_score: number
  max_score: number | null
}

export type ReportTiersResponse =
  | ReportTierDefinition[]
  | { tiers: ReportTierDefinition[] }

/** GET /api/reports/export query params */
export interface ExportReportParams {
  categoryId?: string | null
  tierId?: string | null
  dateFrom: string
  dateTo: string
  /** Row cap: 10, 20, 50, 100, or "all" */
  limit: string
}

export const REPORT_LIMIT_OPTIONS = [
  { label: '10', value: '10' },
  { label: '20', value: '20' },
  { label: '50', value: '50' },
  { label: '100', value: '100' },
  { label: 'All', value: 'all' },
] as const

export type ReportLimitValue = (typeof REPORT_LIMIT_OPTIONS)[number]['value']
