import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchLeadById,
  fetchLeads,
  refreshLeadById,
  sendLeadEmailById,
  uploadLeadsFile,
} from '@/api/leads'
import { hasApiBaseUrl } from '@/lib/api-client'
import { useUiStore } from '@/stores/uiStore'
import type { SnapshotRefreshMetadata } from '@/types/api-lead'

export const leadKeys = {
  all: ['leads'] as const,
  list: (filters: ReturnType<typeof useUiStore.getState>['filters']) =>
    [...leadKeys.all, 'list', filters] as const,
  detail: (id: string) => [...leadKeys.all, 'detail', id] as const,
}

export function useLeads() {
  const filters = useUiStore((s) => s.filters)
  return useQuery({
    queryKey: leadKeys.list(filters),
    queryFn: () => fetchLeads(filters),
    enabled: hasApiBaseUrl(),
  })
}

export function useLead(id: string | undefined) {
  return useQuery({
    queryKey: leadKeys.detail(id ?? ''),
    queryFn: () => fetchLeadById(id!),
    enabled: Boolean(id) && hasApiBaseUrl(),
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
        queryClient.invalidateQueries({ queryKey: leadKeys.all })
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
        queryClient.invalidateQueries({ queryKey: leadKeys.all })
      }
    },
  })
}

export function useUploadLeads() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { file: File; categoryId: string }) => uploadLeadsFile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadKeys.all })
    },
  })
}

export function useLeadsApiMode() {
  return hasApiBaseUrl()
}
