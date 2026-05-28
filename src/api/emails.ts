import {
  draftEmailRemote,
  fetchEmailDetailRemote,
  fetchEmailsListRemote,
  fetchLeadEmailsTimelineRemote,
  previewRecipientsRemote,
  sendLeadEmailShortcutRemote,
  sendOutreachEmailRemote,
} from '@/api/emails-remote'
import { assertApiConfigured } from '@/lib/require-api'
import type {
  EmailDraftRequest,
  FetchEmailsListParams,
  SendEmailRequest,
  SendEmailSingleRequest,
} from '@/types/api-email'
import { isBulkSendRequest } from '@/types/api-email'

export async function draftEmail(payload: EmailDraftRequest) {
  assertApiConfigured()
  return draftEmailRemote(payload)
}

export async function previewRecipients(payload: import('@/types/api-email').RecipientsPreviewRequest) {
  assertApiConfigured()
  return previewRecipientsRemote(payload)
}

/**
 * Routes send to the correct endpoint per EMAIL_OUTREACH.md:
 * - Bulk → POST /api/emails/send { leadIds, subject, body }
 * - Single snapshot → POST /api/leads/:id/email/send { useSnapshot: true }
 * - Single custom → POST /api/emails/send { leadId, subject, body }
 */
export async function sendEmail(payload: SendEmailRequest) {
  assertApiConfigured()

  if (isBulkSendRequest(payload)) {
    return sendOutreachEmailRemote(payload)
  }

  const single = payload as SendEmailSingleRequest
  const useSnapshot = single.useSnapshot ?? false
  const hasCustomCopy =
    Boolean(single.subject?.trim()) || Boolean(single.body?.trim())

  if (useSnapshot && !hasCustomCopy) {
    return sendLeadEmailShortcutRemote(single.leadId, {
      useSnapshot: true,
      emailIdentityId: single.emailIdentityId,
    })
  }

  return sendOutreachEmailRemote({
    leadId: single.leadId,
    subject: single.subject?.trim(),
    body: single.body?.trim(),
    emailIdentityId: single.emailIdentityId,
    useSnapshot: useSnapshot && !hasCustomCopy ? true : undefined,
  })
}

/** @deprecated Use `sendEmail` */
export const sendOutreachEmail = sendEmail

export async function fetchEmailsList(params?: FetchEmailsListParams) {
  assertApiConfigured()
  return fetchEmailsListRemote(params)
}

export async function fetchEmailDetail(id: string) {
  assertApiConfigured()
  return fetchEmailDetailRemote(id)
}

export async function fetchLeadEmailsTimeline(leadId: string) {
  assertApiConfigured()
  return fetchLeadEmailsTimelineRemote(leadId)
}

export interface SendLeadEmailOptions {
  useSnapshot?: boolean
  subject?: string
  body?: string
  emailIdentityId?: string
}

/** Lead detail shortcut — delegates to `sendEmail` */
export async function sendLeadEmail(
  leadId: string,
  options: SendLeadEmailOptions = {},
) {
  const { useSnapshot = true, subject, body, emailIdentityId } = options
  return sendEmail({
    leadId,
    useSnapshot,
    subject,
    body,
    emailIdentityId,
  })
}
