import { sendLeadEmail } from '@/api/emails'
import {
  createLeadRemote,
  downloadLeadUploadTemplateRemote,
  exportLeadsRemote,
  fetchLeadDetail,
  fetchLeadScoreBreakdownRemote,
  fetchLeadsListRemote,
  refreshLeadSnapshot,
  uploadLeadsFile,
} from '@/api/leads-remote'
import { mapLeadDetailResponse } from '@/lib/map-lead-detail'
import {
  applyLeadFilters,
  mapApiLeadToUi,
  normalizeLeadsListResponse,
} from '@/lib/map-lead-list'
import { CATEGORY_FILTER_ALL } from '@/constants/filters'
import { assertApiConfigured } from '@/lib/require-api'
import type { Lead, LeadFilters } from '@/types/lead'
import type {
  CreateLeadRequest,
  LeadDetailResponse,
  SnapshotRefreshMetadata,
} from '@/types/api-lead'

export async function fetchLeads(filters?: LeadFilters): Promise<Lead[]> {
  assertApiConfigured()

  const tier =
    filters && filters.status !== 'all'
      ? (filters.status as 'hot' | 'warm' | 'cold')
      : undefined

  const categoryId =
    filters && filters.categoryId !== CATEGORY_FILTER_ALL ? filters.categoryId : undefined

  const data = await fetchLeadsListRemote({ tier, sort: 'score', categoryId })
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

export async function fetchLeadScoreBreakdown(id: string) {
  assertApiConfigured()
  return fetchLeadScoreBreakdownRemote(id)
}

export async function refreshLeadById(
  id: string,
  metadata?: SnapshotRefreshMetadata,
): Promise<Lead> {
  assertApiConfigured()
  const data = await refreshLeadSnapshot(id, metadata)
  return mapLeadDetailResponse(data)
}

export type { SendLeadEmailOptions } from '@/api/emails'

export async function sendLeadEmailById(
  id: string,
  options?: import('@/api/emails').SendLeadEmailOptions,
): Promise<void> {
  assertApiConfigured()
  await sendLeadEmail(id, options)
}

export async function createLead(payload: CreateLeadRequest) {
  assertApiConfigured()
  return createLeadRemote(payload)
}

export async function downloadLeadUploadTemplate() {
  assertApiConfigured()
  return downloadLeadUploadTemplateRemote()
}

export async function exportLeadsSpreadsheet() {
  assertApiConfigured()
  return exportLeadsRemote()
}

export { uploadLeadsFile }
export type { CreateLeadRequest, LeadDetailResponse }
