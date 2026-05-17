import { apiRequest } from '@/lib/api-client'
import type {
  LeadDetailResponse,
  SendEmailResponse,
  SnapshotRefreshMetadata,
} from '@/types/api-lead'

export async function fetchLeadDetail(id: string): Promise<LeadDetailResponse> {
  return apiRequest<LeadDetailResponse>(`/api/leads/${id}`)
}

export async function refreshLeadSnapshot(
  id: string,
  metadata?: SnapshotRefreshMetadata,
): Promise<LeadDetailResponse> {
  return apiRequest<LeadDetailResponse>(`/api/leads/${id}/snapshot`, {
    method: 'PATCH',
    body: JSON.stringify(metadata ? { metadata } : {}),
    timeoutMs: 90_000,
  })
}

export async function sendLeadEmail(id: string): Promise<SendEmailResponse> {
  return apiRequest<SendEmailResponse>(`/api/leads/${id}/email/send`, {
    method: 'POST',
    timeoutMs: 60_000,
  })
}
