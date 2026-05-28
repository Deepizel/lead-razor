import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createEmailIdentity,
  deleteEmailIdentity,
  fetchEmailIdentities,
  setDefaultEmailIdentity,
  testEmailIdentity,
  updateEmailIdentity,
} from '@/api/settings'
import { hasApiBaseUrl } from '@/lib/api-client'
import { notify } from '@/stores/toastStore'
import type { SaveEmailIdentityPayload } from '@/types/api-settings'

export const settingsKeys = {
  all: ['settings'] as const,
  emailIdentities: () => [...settingsKeys.all, 'email-identities'] as const,
}

export function useEmailIdentities() {
  return useQuery({
    queryKey: settingsKeys.emailIdentities(),
    queryFn: fetchEmailIdentities,
    enabled: hasApiBaseUrl(),
  })
}

export function useCreateEmailIdentity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: SaveEmailIdentityPayload) => createEmailIdentity(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.emailIdentities() })
      notify.success('Identity added')
    },
  })
}

export function useUpdateEmailIdentity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: SaveEmailIdentityPayload }) =>
      updateEmailIdentity(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.emailIdentities() })
      notify.success('Identity updated')
    },
  })
}

export function useDeleteEmailIdentity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteEmailIdentity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.emailIdentities() })
      notify.success('Identity deleted')
    },
  })
}

export function useSetDefaultEmailIdentity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => setDefaultEmailIdentity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.emailIdentities() })
      notify.success('Default sender updated')
    },
  })
}

export function useTestEmailIdentity() {
  return useMutation({
    mutationFn: ({ id, to }: { id: string; to?: string }) => testEmailIdentity(id, to),
  })
}

export function useSettingsApiMode() {
  return hasApiBaseUrl()
}
