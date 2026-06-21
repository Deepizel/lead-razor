import type { ApiLeadTier } from '@/types/api-lead'

/** POST /api/emails/draft */
export interface EmailDraftRequest {
  leadId: string
}

export interface EmailDraftResponse {
  leadId: string
  subject: string
  body: string
}

/** POST /api/emails/recipients/preview */
export interface RecipientsPreviewRequest {
  tier?: ApiLeadTier
  categoryId?: string
}

export interface RecipientPreviewLead {
  id: string
  name: string
  email: string
  tier: ApiLeadTier
  company?: string
}

export interface RecipientsPreviewResponse {
  leads: RecipientPreviewLead[]
  count: number
}

/** POST /api/emails/send — single lead */
export interface SendEmailSingleRequest {
  leadId: string
  subject?: string
  body?: string
  useSnapshot?: boolean
  emailIdentityId?: string
}

/** POST /api/emails/send — bulk */
export interface SendEmailBulkRequest {
  leadIds: string[]
  subject: string
  body: string
  emailIdentityId?: string
}

export type SendEmailRequest = SendEmailSingleRequest | SendEmailBulkRequest

export function isBulkSendRequest(
  payload: SendEmailRequest,
): payload is SendEmailBulkRequest {
  return 'leadIds' in payload && Array.isArray(payload.leadIds)
}

export interface SendEmailResult {
  status?: string
  message?: string
  emailId?: string
  sent?: number
  failed?: number
}

/** GET /api/emails list row */
export interface SentEmailRow {
  id: string
  leadId: string
  leadName: string
  leadEmail?: string
  subject: string
  sentAt: string
  opened: boolean
  openedAt: string | null
  clicked: boolean
  clickedAt: string | null
  replied: boolean
  repliedAt: string | null
}

export interface EmailsListResponse {
  emails: SentEmailRow[]
  total: number
}

export interface FetchEmailsListParams {
  tier?: ApiLeadTier
  opened?: boolean
  replied?: boolean
  limit?: number
  offset?: number
}

/** GET /api/emails/:id */
export interface EmailClickEvent {
  linkIndex: number
  url?: string
  clickedAt: string
}

export interface SentEmailDetail extends SentEmailRow {
  body?: string
  to?: string
  clicks?: EmailClickEvent[]
  events?: LeadEmailTimelineItem[]
}

/** GET /api/leads/:id/emails — lead-specific timeline */
export type LeadEmailEventType =
  | 'email_sent'
  | 'email_opened'
  | 'link_clicked'
  | 'email_replied'
  | 'tier_change'
  | 'lead_created'
  | string

export interface LeadEmailTimelineItem {
  id: string
  type: LeadEmailEventType
  occurredAt: string
  label: string
  subject?: string | null
  bodyPreview?: string | null
  emailId?: string | null
  metadata?: Record<string, unknown>
}

export interface LeadEmailsTimelineResponse {
  events: LeadEmailTimelineItem[]
  emails?: SentEmailRow[]
}

/** POST /api/leads/:id/email/send shortcut */
export interface LeadSendEmailShortcutRequest {
  leadId?: string
  useSnapshot?: boolean
  subject?: string
  body?: string
  emailIdentityId?: string
}
