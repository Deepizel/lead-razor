import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  draftEmail,
  fetchEmailDetail,
  fetchEmailsList,
  fetchLeadEmailsTimeline,
  previewRecipients,
  sendEmail,
} from '@/api/emails'
import { hasApiBaseUrl } from '@/lib/api-client'
import { leadKeys } from '@/hooks/useLeads'
import { notify } from '@/stores/toastStore'
import type {
  FetchEmailsListParams,
  RecipientsPreviewRequest,
  SendEmailRequest,
} from '@/types/api-email'
import { isBulkSendRequest } from '@/types/api-email'

export const emailKeys = {
  all: ['emails'] as const,
  list: (params: FetchEmailsListParams) => [...emailKeys.all, 'list', params] as const,
  detail: (id: string) => [...emailKeys.all, 'detail', id] as const,
  leadTimeline: (leadId: string) => [...emailKeys.all, 'lead', leadId] as const,
}

export function useEmailsList(params: FetchEmailsListParams = {}) {
  return useQuery({
    queryKey: emailKeys.list(params),
    queryFn: () => fetchEmailsList(params),
    enabled: hasApiBaseUrl(),
  })
}

export function useEmailDetail(id: string | undefined) {
  return useQuery({
    queryKey: emailKeys.detail(id ?? ''),
    queryFn: () => fetchEmailDetail(id!),
    enabled: Boolean(id) && hasApiBaseUrl(),
  })
}

export function useLeadEmailTimeline(leadId: string | undefined) {
  return useQuery({
    queryKey: emailKeys.leadTimeline(leadId ?? ''),
    queryFn: () => fetchLeadEmailsTimeline(leadId!),
    enabled: Boolean(leadId) && hasApiBaseUrl(),
  })
}

export function useDraftEmail() {
  return useMutation({
    mutationFn: draftEmail,
  })
}

export function usePreviewRecipients() {
  return useMutation({
    mutationFn: (payload: RecipientsPreviewRequest) => previewRecipients(payload),
  })
}

export function useRecipientsPreviewQuery(
  params: RecipientsPreviewRequest | null,
  enabled: boolean,
) {
  return useQuery({
    queryKey: [...emailKeys.all, 'recipients-preview', params] as const,
    queryFn: () => previewRecipients(params!),
    enabled: enabled && Boolean(params) && hasApiBaseUrl(),
  })
}

export function useSendEmail() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: SendEmailRequest) => sendEmail(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: emailKeys.all })
      queryClient.invalidateQueries({ queryKey: leadKeys.all })
      if (!isBulkSendRequest(variables)) {
        queryClient.invalidateQueries({
          queryKey: emailKeys.leadTimeline(variables.leadId),
        })
        queryClient.invalidateQueries({
          queryKey: leadKeys.detail(variables.leadId),
        })
      }
      notify.success('Email sent', 'Message queued for delivery.')
    },
  })
}

/** @deprecated Use `useSendEmail` */
export const useSendOutreachEmail = useSendEmail

export function useEmailsApiMode() {
  return hasApiBaseUrl()
}
