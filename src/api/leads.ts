import { fetchLeadDetail, refreshLeadSnapshot, sendLeadEmail } from '@/api/leads-remote'
import { hasApiBaseUrl } from '@/lib/api-client'
import { mapLeadDetailResponse } from '@/lib/map-lead-detail'
import { mockLeads, pipelineStages, roiMetrics } from '@/data/mockLeads'
import { getUploadedDateRange, isWithinUploadedRange } from '@/lib/lead-utils'
import type { Lead, LeadFilters } from '@/types/lead'
import type { LeadDetailResponse, SnapshotRefreshMetadata } from '@/types/api-lead'

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))

export async function fetchLeads(filters?: LeadFilters): Promise<Lead[]> {
  await delay()
  let leads = [...mockLeads]

  if (!filters) return leads

  if (filters.status !== 'all') {
    leads = leads.filter((lead) => lead.status === filters.status)
  }

  if (filters.source !== 'All') {
    leads = leads.filter((lead) => lead.source === filters.source)
  }

  leads = leads.filter(
    (lead) => lead.score >= filters.minScore && lead.score <= filters.maxScore,
  )

  const { from, to } = getUploadedDateRange(
    filters.uploadedPreset,
    filters.uploadedFrom,
    filters.uploadedTo,
  )
  if (from || to) {
    leads = leads.filter((lead) => isWithinUploadedRange(lead.createdAt, from, to))
  }

  return leads.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export async function fetchLeadById(id: string): Promise<Lead | undefined> {
  if (hasApiBaseUrl()) {
    try {
      const data = await fetchLeadDetail(id)
      return mapLeadDetailResponse(data)
    } catch {
      return undefined
    }
  }

  await delay(300)
  return mockLeads.find((lead) => lead.id === id)
}

export async function refreshLeadById(
  id: string,
  metadata?: SnapshotRefreshMetadata,
): Promise<Lead> {
  if (!hasApiBaseUrl()) {
    throw new Error('Snapshot refresh requires VITE_API_BASE_URL')
  }
  const data = await refreshLeadSnapshot(id, metadata)
  return mapLeadDetailResponse(data)
}

export async function sendLeadEmailById(id: string): Promise<void> {
  if (!hasApiBaseUrl()) {
    throw new Error('Email send requires VITE_API_BASE_URL')
  }
  await sendLeadEmail(id)
}

export type { LeadDetailResponse }

export async function fetchPipelineStages() {
  await delay(300)
  return pipelineStages
}

export async function fetchROIMetrics() {
  await delay(300)
  return roiMetrics
}
