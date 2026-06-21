import { apiPaths } from '@/api/paths'
import { apiRequest } from '@/lib/api-client'
import {
  mapDraftResponse,
  mapEmailDetail,
  mapRecipientsPreview,
  normalizeEmailsList,
  normalizeLeadEmailsTimeline,
} from '@/lib/map-email'
import type {
  EmailDraftRequest,
  EmailDraftResponse,
  EmailsListResponse,
  FetchEmailsListParams,
  LeadEmailsTimelineResponse,
  LeadSendEmailShortcutRequest,
  RecipientsPreviewRequest,
  RecipientsPreviewResponse,
  SendEmailRequest,
  SendEmailResult,
  SentEmailDetail,
} from '@/types/api-email'
import type { SendEmailResponse } from '@/types/api-lead'

export async function draftEmailRemote(
  payload: EmailDraftRequest,
): Promise<EmailDraftResponse> {
  const raw = await apiRequest<unknown>(apiPaths.emails.draft, {
    method: 'POST',
    body: JSON.stringify(payload),
    timeoutMs: 90_000,
  })
  return mapDraftResponse(raw)
}

export async function previewRecipientsRemote(
  payload: RecipientsPreviewRequest,
): Promise<RecipientsPreviewResponse> {
  const raw = await apiRequest<unknown>(apiPaths.emails.recipientsPreview, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return mapRecipientsPreview(raw)
}

/** POST /api/emails/send — spec: single or bulk payload shapes */
export async function sendOutreachEmailRemote(
  payload: SendEmailRequest,
): Promise<SendEmailResult> {
  return apiRequest<SendEmailResult>(apiPaths.emails.send, {
    method: 'POST',
    body: JSON.stringify(payload),
    timeoutMs: 120_000,
  })
}

export async function fetchEmailsListRemote(
  params: FetchEmailsListParams = {},
): Promise<EmailsListResponse> {
  const qs = new URLSearchParams()
  if (params.tier) qs.set('tier', params.tier)
  if (params.opened != null) qs.set('opened', String(params.opened))
  if (params.replied != null) qs.set('replied', String(params.replied))
  if (params.limit != null) qs.set('limit', String(params.limit))
  if (params.offset != null) qs.set('offset', String(params.offset))
  const query = qs.toString()
  const path = query ? `${apiPaths.emails.list}?${query}` : apiPaths.emails.list
  const raw = await apiRequest<unknown>(path, { silentError: true })
  return normalizeEmailsList(raw)
}

export async function fetchEmailDetailRemote(id: string): Promise<SentEmailDetail> {
  const raw = await apiRequest<unknown>(apiPaths.emails.detail(id), {
    silentError: true,
  })
  return mapEmailDetail(raw)
}

export async function fetchLeadEmailsTimelineRemote(
  leadId: string,
): Promise<LeadEmailsTimelineResponse> {
  const raw = await apiRequest<unknown>(apiPaths.leads.emails(leadId), {
    silentError: true,
  })
  return normalizeLeadEmailsTimeline(raw)
}

/**
 * POST /api/leads/:id/email/send
 * Spec shortcut: `{ useSnapshot: true }` when sending snapshot without overrides.
 */
export async function sendLeadEmailShortcutRemote(
  leadId: string,
  body: LeadSendEmailShortcutRequest = { useSnapshot: true },
): Promise<SendEmailResponse> {
  const payload = {
    leadId,
    ...body,
  }
  return apiRequest<SendEmailResponse>(apiPaths.leads.sendEmail(leadId), {
    method: 'POST',
    body: JSON.stringify(payload),
    timeoutMs: 60_000,
  })
}
