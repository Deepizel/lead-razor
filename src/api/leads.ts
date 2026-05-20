import {
  fetchLeadDetail,
  fetchLeadsListRemote,
  refreshLeadSnapshot,
  sendLeadEmail,
  uploadLeadsFile,
} from '@/api/leads-remote'
// import { ApiError } from '@/lib/api-client'
import { mapLeadDetailResponse } from '@/lib/map-lead-detail'
import {
  applyLeadFilters,
  mapApiLeadToUi,
  normalizeLeadsListResponse,
} from '@/lib/map-lead-list'
import { assertApiConfigured } from '@/lib/require-api'
import type { Lead, LeadFilters } from '@/types/lead'
import type { LeadDetailResponse, SnapshotRefreshMetadata } from '@/types/api-lead'

export async function fetchLeads(filters?: LeadFilters): Promise<Lead[]> {
  assertApiConfigured()

  const tier =
    filters && filters.status !== 'all'
      ? (filters.status as 'hot' | 'warm' | 'cold')
      : undefined

  const data = await fetchLeadsListRemote({ tier, sort: 'score' })
  const apiLeads = normalizeLeadsListResponse(data)
  let leads = apiLeads.map(mapApiLeadToUi)

  if (filters) {
    leads = applyLeadFilters(leads, filters)
  }

  return leads
}

export async function fetchLeadById(id: string): Promise<Lead> {
  assertApiConfigured()
  const data = await fetchLeadDetail(id)
  return mapLeadDetailResponse(data)
}

export async function refreshLeadById(
  id: string,
  metadata?: SnapshotRefreshMetadata,
): Promise<Lead> {
  assertApiConfigured()
  const data = await refreshLeadSnapshot(id, metadata)
  return mapLeadDetailResponse(data)
}

export async function sendLeadEmailById(id: string): Promise<void> {
  assertApiConfigured()
  await sendLeadEmail(id)
}

export { uploadLeadsFile }
export type { LeadDetailResponse }
