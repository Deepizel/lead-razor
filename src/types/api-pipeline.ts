/** Tier counts keyed by hot | warm | cold */
export type TierCounts = Record<'hot' | 'warm' | 'cold', number>

export interface PipelineAnalyticsPeriod {
  days: number
  from: string
  to: string
}

export interface PipelineTierMovementPeriod {
  periodStart: string
  transitions: Record<string, number>
  netHotDelta: number
}

export interface PipelineEngagement {
  totalLeads: number
  leadsEmailed: number
  openRate: number
  replyRate: number
  clickRate: number
  bookingRate: number
}

export interface PipelineCategoryRow {
  categoryId: string
  categoryName: string
  hot: number
  warm: number
  cold: number
  total: number
}

export interface PipelineUploadRow {
  id: string
  externalUploadId?: string | null
  createdAt: string
  rowCount: number
  createdCount: number
  updatedCount: number
  errorCount: number
  sourceLabel?: string | null
  leadSources: string[]
  tierCounts: TierCounts
}

export interface PipelineHotLeadsWeekOverWeek {
  currentWeek: number
  previousWeek: number
}

export interface PipelineAnalyticsResponse {
  period: PipelineAnalyticsPeriod
  tierDistribution: TierCounts
  tierMovement: PipelineTierMovementPeriod[]
  engagement: PipelineEngagement
  byCategory: PipelineCategoryRow[]
  uploads: PipelineUploadRow[]
  hotLeadsWeekOverWeek: PipelineHotLeadsWeekOverWeek
}
