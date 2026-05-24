import type {
  EmailDraftResponse,
  EmailsListResponse,
  LeadEmailTimelineItem,
  LeadEmailsTimelineResponse,
  RecipientPreviewLead,
  RecipientsPreviewResponse,
  SentEmailDetail,
  SentEmailRow,
} from '@/types/api-email'
import type { ApiLeadTier } from '@/types/api-lead'

const EVENT_LABELS: Record<string, string> = {
  email_sent: 'Email sent',
  email_opened: 'Email opened',
  link_clicked: 'Link clicked',
  email_replied: 'Reply received',
  tier_change: 'Tier changed',
  lead_created: 'Lead created',
}

function pickString(obj: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const v = obj[key]
    if (typeof v === 'string' && v.length > 0) return v
  }
  return ''
}

function pickBool(obj: Record<string, unknown>, ...keys: string[]): boolean {
  for (const key of keys) {
    const v = obj[key]
    if (typeof v === 'boolean') return v
  }
  return false
}

function pickNullableString(
  obj: Record<string, unknown>,
  ...keys: string[]
): string | null {
  for (const key of keys) {
    const v = obj[key]
    if (v === null) return null
    if (typeof v === 'string') return v
  }
  return null
}

export function mapSentEmailRow(raw: unknown): SentEmailRow {
  const o = (raw ?? {}) as Record<string, unknown>
  const lead = (o.lead ?? {}) as Record<string, unknown>
  const openedAt = pickNullableString(o, 'openedAt', 'opened_at')
  const clickedAt = pickNullableString(o, 'clickedAt', 'clicked_at')
  const repliedAt = pickNullableString(o, 'repliedAt', 'replied_at')

  return {
    id: pickString(o, 'id', 'emailId', 'email_id'),
    leadId: pickString(o, 'leadId', 'lead_id'),
    leadName:
      pickString(o, 'leadName', 'lead_name') ||
      [pickString(lead, 'first_name'), pickString(lead, 'last_name')]
        .filter(Boolean)
        .join(' ') ||
      pickString(lead, 'name', 'email'),
    leadEmail: pickString(o, 'leadEmail', 'lead_email', 'to') || pickString(lead, 'email'),
    subject: pickString(o, 'subject'),
    sentAt:
      pickString(o, 'sentAt', 'sent_at', 'createdAt', 'created_at') ||
      new Date().toISOString(),
    opened: pickBool(o, 'opened') || Boolean(openedAt),
    openedAt,
    clicked: pickBool(o, 'clicked') || Boolean(clickedAt),
    clickedAt,
    replied: pickBool(o, 'replied') || Boolean(repliedAt),
    repliedAt,
  }
}

export function normalizeEmailsList(raw: unknown): EmailsListResponse {
  if (Array.isArray(raw)) {
    const emails = raw.map(mapSentEmailRow)
    return { emails, total: emails.length }
  }
  const o = (raw ?? {}) as Record<string, unknown>
  const list = o.emails ?? o.items ?? o.data ?? []
  const emails = Array.isArray(list) ? list.map(mapSentEmailRow) : []
  const total =
    typeof o.total === 'number'
      ? o.total
      : typeof o.count === 'number'
        ? o.count
        : emails.length
  return { emails, total }
}

export function mapEmailDetail(raw: unknown): SentEmailDetail {
  const o = (raw ?? {}) as Record<string, unknown>
  const email = (o.email ?? o) as Record<string, unknown>
  const base = mapSentEmailRow(email)
  const clicksRaw = email.clicks ?? o.clicks
  const clicks = Array.isArray(clicksRaw)
    ? clicksRaw.map((c, i) => {
        const click = c as Record<string, unknown>
        return {
          linkIndex:
            typeof click.linkIndex === 'number'
              ? click.linkIndex
              : typeof click.link_index === 'number'
                ? click.link_index
                : i,
          url: pickString(click, 'url'),
          clickedAt:
            pickString(click, 'clickedAt', 'clicked_at') || new Date().toISOString(),
        }
      })
    : undefined

  const eventsRaw = email.events ?? o.events ?? email.timeline
  const events = Array.isArray(eventsRaw)
    ? eventsRaw.map(mapTimelineItem)
    : undefined

  return {
    ...base,
    body: pickString(email, 'body') || undefined,
    to: pickString(email, 'to') || base.leadEmail,
    clicks,
    events,
  }
}

export function mapTimelineItem(raw: unknown): LeadEmailTimelineItem {
  const o = (raw ?? {}) as Record<string, unknown>
  const type = pickString(o, 'type', 'eventType', 'event_type') || 'unknown'
  const label =
    pickString(o, 'label') ||
    EVENT_LABELS[type] ||
    type.replace(/_/g, ' ')

  return {
    id: pickString(o, 'id') || `${type}-${pickString(o, 'occurredAt', 'occurred_at', 'createdAt', 'created_at')}`,
    type,
    occurredAt:
      pickString(o, 'occurredAt', 'occurred_at', 'createdAt', 'created_at') ||
      new Date().toISOString(),
    label,
    subject: pickNullableString(o, 'subject'),
    bodyPreview:
      pickNullableString(o, 'bodyPreview', 'body_preview', 'snippet') ?? undefined,
    emailId: pickNullableString(o, 'emailId', 'email_id') ?? undefined,
    metadata:
      o.metadata && typeof o.metadata === 'object'
        ? (o.metadata as Record<string, unknown>)
        : undefined,
  }
}

export function normalizeLeadEmailsTimeline(raw: unknown): LeadEmailsTimelineResponse {
  if (Array.isArray(raw)) {
    return { events: raw.map(mapTimelineItem) }
  }
  const o = (raw ?? {}) as Record<string, unknown>
  const eventsRaw = o.events ?? o.timeline ?? o.history ?? []
  const emailsRaw = o.emails
  const events = Array.isArray(eventsRaw) ? eventsRaw.map(mapTimelineItem) : []
  const emails = Array.isArray(emailsRaw) ? emailsRaw.map(mapSentEmailRow) : undefined

  if (events.length === 0 && emails?.length) {
    const fromEmails: LeadEmailTimelineItem[] = emails.flatMap((email) => {
      const items: LeadEmailTimelineItem[] = [
        {
          id: `${email.id}-sent`,
          type: 'email_sent',
          occurredAt: email.sentAt,
          label: EVENT_LABELS.email_sent,
          subject: email.subject,
          emailId: email.id,
        },
      ]
      if (email.openedAt) {
        items.push({
          id: `${email.id}-opened`,
          type: 'email_opened',
          occurredAt: email.openedAt,
          label: EVENT_LABELS.email_opened,
          subject: email.subject,
          emailId: email.id,
        })
      }
      if (email.clickedAt) {
        items.push({
          id: `${email.id}-clicked`,
          type: 'link_clicked',
          occurredAt: email.clickedAt,
          label: EVENT_LABELS.link_clicked,
          subject: email.subject,
          emailId: email.id,
        })
      }
      if (email.repliedAt) {
        items.push({
          id: `${email.id}-replied`,
          type: 'email_replied',
          occurredAt: email.repliedAt,
          label: EVENT_LABELS.email_replied,
          subject: email.subject,
          emailId: email.id,
        })
      }
      return items
    })
    return {
      events: fromEmails.sort(
        (a, b) =>
          new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
      ),
      emails,
    }
  }

  return {
    events: events.sort(
      (a, b) =>
        new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
    ),
    emails,
  }
}

export function mapDraftResponse(raw: unknown): EmailDraftResponse {
  const o = (raw ?? {}) as Record<string, unknown>
  const draft = (o.draft ?? o) as Record<string, unknown>
  return {
    leadId: pickString(o, 'leadId', 'lead_id') || pickString(draft, 'leadId', 'lead_id'),
    subject: pickString(o, 'subject') || pickString(draft, 'subject'),
    body: pickString(o, 'body') || pickString(draft, 'body'),
  }
}

export function mapRecipientsPreview(raw: unknown): RecipientsPreviewResponse {
  const o = (raw ?? {}) as Record<string, unknown>
  const list = o.leads ?? o.recipients ?? []
  const leads: RecipientPreviewLead[] = Array.isArray(list)
    ? list.map((item) => {
        const r = item as Record<string, unknown>
        return {
          id: pickString(r, 'id', 'leadId', 'lead_id'),
          name:
            pickString(r, 'name') ||
            [pickString(r, 'first_name'), pickString(r, 'last_name')]
              .filter(Boolean)
              .join(' '),
          email: pickString(r, 'email'),
          tier: (pickString(r, 'tier', 'status') || 'cold') as ApiLeadTier,
          company: pickString(r, 'company') || undefined,
        }
      })
    : []
  return {
    leads,
    count: typeof o.count === 'number' ? o.count : leads.length,
  }
}

export function formatTrackingYesNo(
  value: boolean,
  at: string | null,
): string {
  if (!value) return 'No'
  return at ? `Yes · ${new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(at))}` : 'Yes'
}
