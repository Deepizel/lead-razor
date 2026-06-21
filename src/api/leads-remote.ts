import { apiPaths } from '@/api/paths'
import { apiRequest } from '@/lib/api-client'
import { normalizeLeadScoreBreakdown } from '@/lib/map-lead-score'
import { mapCreateLeadRequest } from '@/lib/map-create-lead'
import { downloadApiFile } from '@/lib/download-api-file'
import type {
  CreateLeadRequest,
  CreateLeadResponse,
  LeadDetailResponse,
  LeadScoreBreakdownResponse,
  LeadsListResponse,
  SnapshotRefreshMetadata,
} from '@/types/api-lead'

export interface FetchLeadsListParams {
  tier?: 'hot' | 'warm' | 'cold'
  sort?: 'score' | 'created_at'
  categoryId?: string
}

export async function fetchLeadsListRemote(
  params: FetchLeadsListParams = {},
): Promise<LeadsListResponse> {
  const qs = new URLSearchParams()
  if (params.tier) qs.set('tier', params.tier)
  if (params.categoryId) {
    qs.set('categoryId', params.categoryId)
    qs.set('category_id', params.categoryId)
  }
  qs.set('sort', params.sort ?? 'score')
  const query = qs.toString()
  const path = query ? `${apiPaths.leads.list}?${query}` : apiPaths.leads.list
  return apiRequest<LeadsListResponse>(path)
}

export async function fetchLeadDetail(id: string): Promise<LeadDetailResponse> {
  return apiRequest<LeadDetailResponse>(apiPaths.leads.detail(id))
}

export async function fetchLeadScoreBreakdownRemote(id: string) {
  const raw = await apiRequest<LeadScoreBreakdownResponse>(apiPaths.leads.score(id), {
    silentError: true,
  })
  return normalizeLeadScoreBreakdown(raw)
}

export async function refreshLeadSnapshot(
  id: string,
  metadata?: SnapshotRefreshMetadata,
): Promise<LeadDetailResponse> {
  return apiRequest<LeadDetailResponse>(apiPaths.leads.snapshot(id), {
    method: 'PATCH',
    body: JSON.stringify(metadata ? { metadata } : {}),
    timeoutMs: 90_000,
  })
}

export async function createLeadRemote(
  payload: CreateLeadRequest,
): Promise<CreateLeadResponse> {
  return apiRequest<CreateLeadResponse>(apiPaths.leads.create, {
    method: 'POST',
    body: JSON.stringify(mapCreateLeadRequest(payload)),
  })
}

export async function downloadLeadUploadTemplateRemote(): Promise<void> {
  return downloadApiFile(apiPaths.leads.uploadTemplate, 'lead-upload-template.xlsx')
}

export async function exportLeadsRemote(): Promise<void> {
  return downloadApiFile(apiPaths.leads.export, 'leads-export.xlsx')
}

export interface UploadLeadsPayload {
  file: File
  categoryId: string
}

export interface UploadLeadsResponse {
  uploadId?: string
  id?: string
  message?: string
  leadsCreated?: number
  count?: number
}

/** Multipart upload: Excel file + category for DB ingest */
export async function uploadLeadsFile({
  file,
  categoryId,
}: UploadLeadsPayload): Promise<UploadLeadsResponse> {
  const form = new FormData()
  form.append('file', file, file.name)
  form.append('category_id', categoryId)
  form.append('categoryId', categoryId)

  return apiRequest<UploadLeadsResponse>(apiPaths.leads.upload, {
    method: 'POST',
    body: form,
    timeoutMs: 120_000,
  })
}
