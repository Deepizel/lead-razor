import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchLeadById,
  fetchLeads,
  fetchPipelineStages,
  fetchROIMetrics,
  refreshLeadById,
  sendLeadEmailById,
} from '@/api/leads'
import { hasApiBaseUrl } from '@/lib/api-client'
import { useUiStore } from '@/stores/uiStore'
import type { SnapshotRefreshMetadata } from '@/types/api-lead'

export const leadKeys = {
  all: ['leads'] as const,
  list: (filters: ReturnType<typeof useUiStore.getState>['filters']) =>
    [...leadKeys.all, 'list', filters] as const,
  detail: (id: string) => [...leadKeys.all, 'detail', id] as const,
  pipeline: ['pipeline'] as const,
  roi: ['roi'] as const,
}

export function useLeads() {
  const filters = useUiStore((s) => s.filters)
  return useQuery({
    queryKey: leadKeys.list(filters),
    queryFn: () => fetchLeads(filters),
  })
}

export function useLead(id: string | undefined) {
  return useQuery({
    queryKey: leadKeys.detail(id ?? ''),
    queryFn: async () => {
      const lead = await fetchLeadById(id!)
      if (!lead) throw new Error('Lead not found')
      return lead
    },
    enabled: Boolean(id),
  })
}

export function useRefreshLeadSnapshot(leadId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (metadata?: SnapshotRefreshMetadata) => {
      if (!leadId) throw new Error('Missing lead id')
      return refreshLeadById(leadId, metadata)
    },
    onSuccess: (lead) => {
      if (leadId) {
        queryClient.setQueryData(leadKeys.detail(leadId), lead)
      }
    },
  })
}

export function useSendLeadEmail(leadId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      if (!leadId) throw new Error('Missing lead id')
      await sendLeadEmailById(leadId)
    },
    onSuccess: () => {
      if (leadId) {
        queryClient.invalidateQueries({ queryKey: leadKeys.detail(leadId) })
      }
    },
  })
}

export function useLeadsApiMode() {
  return hasApiBaseUrl()
}

export function usePipelineStages() {
  return useQuery({
    queryKey: leadKeys.pipeline,
    queryFn: fetchPipelineStages,
  })
}

export function useROIMetrics() {
  return useQuery({
    queryKey: leadKeys.roi,
    queryFn: fetchROIMetrics,
  })
}
