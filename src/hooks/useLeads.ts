import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createLead,
  downloadLeadUploadTemplate,
  exportLeadsSpreadsheet,
  fetchLeadById,
  fetchLeadScoreBreakdown,
  fetchLeads,
  refreshLeadById,
  sendLeadEmailById,
  uploadLeadsFile,
} from '@/api/leads'
import type { CreateLeadRequest } from '@/api/leads'
import { hasApiBaseUrl } from '@/lib/api-client'
import { useUiStore } from '@/stores/uiStore'
import { notify } from '@/stores/toastStore'
import type { SendLeadEmailOptions } from '@/api/emails'
import type { SnapshotRefreshMetadata } from '@/types/api-lead'
import { emailKeys } from '@/hooks/useEmails'

export const leadKeys = {
  all: ['leads'] as const,
  list: (filters: ReturnType<typeof useUiStore.getState>['filters']) =>
    [...leadKeys.all, 'list', filters] as const,
  detail: (id: string) => [...leadKeys.all, 'detail', id] as const,
  score: (id: string) => [...leadKeys.all, 'score', id] as const,
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

export function useLeadScoreBreakdown(leadId: string | undefined) {
  return useQuery({
    queryKey: leadKeys.score(leadId ?? ''),
    queryFn: () => fetchLeadScoreBreakdown(leadId!),
    enabled: Boolean(leadId) && hasApiBaseUrl(),
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
        queryClient.invalidateQueries({ queryKey: leadKeys.score(leadId) })
      }
    },
  })
}

export function useSendLeadEmail(leadId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (options?: SendLeadEmailOptions) => {
      if (!leadId) throw new Error('Missing lead id')
      await sendLeadEmailById(leadId, options)
    },
    onSuccess: () => {
      if (leadId) {
        queryClient.invalidateQueries({ queryKey: leadKeys.detail(leadId) })
        queryClient.invalidateQueries({ queryKey: leadKeys.all })
        queryClient.invalidateQueries({ queryKey: emailKeys.all })
        queryClient.invalidateQueries({ queryKey: emailKeys.leadTimeline(leadId) })
      }
      notify.success('Email sent', 'Outreach message sent to this lead.')
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

export function useCreateLead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateLeadRequest) => createLead(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadKeys.all })
      notify.success('Lead created', 'The lead was added and scored.')
    },
  })
}

export function useDownloadLeadTemplate() {
  return useMutation({
    mutationFn: () => downloadLeadUploadTemplate(),
    onSuccess: () => {
      notify.success('Template downloaded', 'Fill the spreadsheet and upload when ready.')
    },
  })
}

export function useExportLeads() {
  return useMutation({
    mutationFn: () => exportLeadsSpreadsheet(),
    onSuccess: () => {
      notify.success('Export started', 'Your leads spreadsheet should download shortly.')
    },
  })
}

export function useLeadsApiMode() {
  return hasApiBaseUrl()
}
