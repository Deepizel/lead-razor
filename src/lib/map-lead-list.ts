import type { ApiLead } from '@/types/api-lead'
import type { Lead } from '@/types/lead'
import { getUploadedDateRange, isWithinUploadedRange } from '@/lib/lead-utils'
import type { LeadFilters } from '@/types/lead'

export function mapApiLeadToUi(lead: ApiLead): Lead {
  const name = [lead.first_name, lead.last_name].filter(Boolean).join(' ') || lead.email

  return {
    id: lead.id,
    name,
    company: lead.company,
    role: lead.job_title ?? '—',
    email: lead.email,
    score: lead.score,
    status: lead.tier,
    source: lead.source,
    lastAction: lead.last_event_type ?? 'No recent activity',
    createdAt: lead.created_at,
    reasoning: lead.initial_message ? [lead.initial_message] : [],
    intentSignals: [],
    riskFlags: [],
    draftEmail: '',
    emailsSent: lead.emails_sent,
  }
}

export function normalizeLeadsListResponse(data: ApiLead[] | { leads: ApiLead[] }): ApiLead[] {
  return Array.isArray(data) ? data : data.leads
}

/** Client-side filters not yet on GET /api/leads query string */
export function applyLeadFilters(leads: Lead[], filters: LeadFilters): Lead[] {
  let result = [...leads]

  if (filters.status !== 'all') {
    result = result.filter((lead) => lead.status === filters.status)
  }

  if (filters.source !== 'All') {
    result = result.filter((lead) => lead.source === filters.source)
  }

  result = result.filter(
    (lead) => lead.score >= filters.minScore && lead.score <= filters.maxScore,
  )

  const { from, to } = getUploadedDateRange(
    filters.uploadedPreset,
    filters.uploadedFrom,
    filters.uploadedTo,
  )
  if (from || to) {
    result = result.filter((lead) => isWithinUploadedRange(lead.createdAt, from, to))
  }

  return result.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}
