import { apiPaths } from '@/api/paths'
import { apiRequest } from '@/lib/api-client'
import type {
  LeadDetailResponse,
  LeadsListResponse,
  SendEmailResponse,
  SnapshotRefreshMetadata,
} from '@/types/api-lead'

export interface FetchLeadsListParams {
  tier?: 'hot' | 'warm' | 'cold'
  sort?: 'score' | 'created_at'
}

export async function fetchLeadsListRemote(
  params: FetchLeadsListParams = {},
): Promise<LeadsListResponse> {
  const qs = new URLSearchParams()
  if (params.tier) qs.set('tier', params.tier)
  qs.set('sort', params.sort ?? 'score')
  const query = qs.toString()
  const path = query ? `${apiPaths.leads.list}?${query}` : apiPaths.leads.list
  return apiRequest<LeadsListResponse>(path)
}

export async function fetchLeadDetail(id: string): Promise<LeadDetailResponse> {
  return apiRequest<LeadDetailResponse>(apiPaths.leads.detail(id))
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

export async function sendLeadEmail(id: string): Promise<SendEmailResponse> {
  return apiRequest<SendEmailResponse>(apiPaths.leads.sendEmail(id), {
    method: 'POST',
    timeoutMs: 60_000,
  })
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
