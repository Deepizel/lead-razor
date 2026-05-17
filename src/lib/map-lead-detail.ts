import type { ApiLead, ApiLeadSnapshot, LeadDetailResponse } from '@/types/api-lead'
import type { Lead } from '@/types/lead'

export function mapLeadDetailToUi(
  lead: ApiLead,
  snapshot: ApiLeadSnapshot | null,
): Lead {
  const name = [lead.first_name, lead.last_name].filter(Boolean).join(' ') || lead.email

  return {
    id: lead.id,
    name,
    company: lead.company,
    role: lead.job_title ?? '—',
    email: lead.email,
    score: snapshot?.currentScore ?? lead.score,
    status: lead.tier,
    source: lead.source,
    lastAction: lead.last_event_type ?? 'No recent activity',
    createdAt: lead.created_at,
    reasoning: snapshot?.summary
      ? [snapshot.summary]
      : ['No AI snapshot yet. Use “Refresh snapshot” to generate profiling.'],
    intentSignals: snapshot
      ? [
          `Current intent: ${snapshot.currentIntent}`,
          `Last meaningful event: ${snapshot.lastMeaningfulEvent}`,
          `Model: ${snapshot.llmModel}`,
        ]
      : [],
    riskFlags: snapshot
      ? []
      : ['Snapshot missing — email send and full reasoning unavailable'],
    draftEmail: snapshot?.suggestedEmail
      ? formatDraftEmail(snapshot.suggestedEmail.subject, snapshot.suggestedEmail.body)
      : '',
    emailSubject: snapshot?.suggestedEmail.subject ?? '',
    emailBody: snapshot?.suggestedEmail.body ?? '',
    emailSentAt: snapshot?.suggestedEmail.sentAt ?? null,
    hasSnapshot: Boolean(snapshot),
    emailsSent: lead.emails_sent,
  }
}

export function mapLeadDetailResponse(data: LeadDetailResponse): Lead {
  return mapLeadDetailToUi(data.lead, data.snapshot)
}

function formatDraftEmail(subject: string, body: string): string {
  return `Subject: ${subject}\n\n${body}`
}
