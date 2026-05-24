export type ApiLeadTier = 'hot' | 'warm' | 'cold'
export type ApiIntent = 'high' | 'medium' | 'low'

export interface ApiLead {
  id: string
  category_id: string
  first_name: string
  last_name: string
  email: string
  company: string
  job_title: string | null
  phone: string | null
  source: string
  initial_message: string | null
  score: number
  tier: ApiLeadTier
  emails_sent: number
  emails_opened: number
  links_clicked: number
  replies_received: number
  booking_clicks: number
  last_event_at: string | null
  last_event_type: string | null
  created_at: string
  updated_at: string
}

export interface ApiSuggestedEmail {
  subject: string
  body: string
  sentAt: string | null
}

export interface ApiLeadSnapshot {
  leadId: string
  currentScore: number
  summary: string
  currentIntent: ApiIntent
  lastMeaningfulEvent: string
  suggestedEmail: ApiSuggestedEmail
  llmModel: string
  updatedAt: string
}

export interface LeadDetailResponse {
  lead: ApiLead
  snapshot: ApiLeadSnapshot | null
}

export interface SnapshotRefreshMetadata {
  eventType?: string
  emailSubject?: string
  replySnippet?: string
}

export interface SendEmailResponse {
  status: string
  leadId: string
  to: string
  resendMessageId: string
  subject: string
}

export interface ScoreBreakdownItem {
  signal: string
  points: number
  met: boolean
}

export interface LeadScoreBreakdown {
  total: number
  tier: ApiLeadTier
  breakdown: ScoreBreakdownItem[]
}

/** GET /api/leads/:id/score */
export type LeadScoreBreakdownResponse =
  | LeadScoreBreakdown
  | { scoreBreakdown: LeadScoreBreakdown }

export interface ApiErrorBody {
  error: string
}

/** GET /api/leads — array or wrapped list depending on backend version */
export type LeadsListResponse = ApiLead[] | { leads: ApiLead[] }

/** POST /api/leads — JSON body (snake_case, matches spreadsheet columns) */
export interface CreateLeadApiBody {
  category_id: string
  first_name: string
  last_name?: string
  email: string
  company?: string
  job_title?: string
  phone?: string
  source?: string
  initial_message?: string
}

/** UI / hook input — mapped to {@link CreateLeadApiBody} before POST */
export interface CreateLeadRequest {
  categoryId: string
  firstName: string
  lastName?: string
  email: string
  company?: string
  jobTitle?: string
  phone?: string
  source?: string
  initialMessage?: string
}

export type CreateLeadResponse = LeadDetailResponse | { lead: ApiLead }
