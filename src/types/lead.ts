export type LeadStatus = 'hot' | 'warm' | 'cold'

export interface Lead {
  id: string
  name: string
  company: string
  role: string
  email: string
  score: number
  status: LeadStatus
  reasoning: string[]
  intentSignals: string[]
  riskFlags: string[]
  draftEmail: string
  source: string
  lastAction: string
  createdAt: string
  /** Populated from API snapshot when available */
  emailSubject?: string
  emailBody?: string
  emailSentAt?: string | null
  hasSnapshot?: boolean
  emailsSent?: number
}

export type UploadedDatePreset = 'all' | '7d' | '30d' | '90d' | 'custom'

export interface LeadFilters {
  status: LeadStatus | 'all'
  minScore: number
  maxScore: number
  source: string
  uploadedPreset: UploadedDatePreset
  /** Inclusive start date (YYYY-MM-DD), upload / created date */
  uploadedFrom: string
  /** Inclusive end date (YYYY-MM-DD), upload / created date */
  uploadedTo: string
}

export interface PipelineStage {
  stage: string
  count: number
}

export interface ROIMetric {
  month: string
  revenue: number
  conversionRate: number
  emailToMeeting: number
  avgScore: number
}
