import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { approveUser, deactivateUser, fetchAdminUsers, updateUserRole } from '@/api/admin'
import { ApiError, hasApiBaseUrl } from '@/lib/api-client'
import { waitlistKeys } from '@/hooks/useWaitlist'
import { notify } from '@/stores/toastStore'
import type { UserRole } from '@/types/waitlist'

export const adminKeys = {
  all: ['admin'] as const,
  users: () => [...adminKeys.all, 'users'] as const,
}

export function useAdminUsers() {
  return useQuery({
    queryKey: adminKeys.users(),
    queryFn: fetchAdminUsers,
    enabled: hasApiBaseUrl(),
  })
}

export function useApproveUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: approveUser,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() })
      notify.success('User approved', res.message ?? 'Account is now active.')
    },
  })
}

export function useDeactivateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deactivateUser,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.users() })
      void queryClient.invalidateQueries({ queryKey: waitlistKeys.adminList() })
      notify.success('User deactivated', 'They can no longer sign in.')
    },
    onError: (err) => {
      notify.error(err instanceof ApiError ? err.message : 'Could not deactivate user.')
    },
  })
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) => updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() })
      notify.success('Role updated')
    },
  })
}
