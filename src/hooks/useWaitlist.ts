import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { LOGIN_PATH } from '@/constants/routes'
import { ApiError } from '@/lib/api-client'
import {
  approveWaitlistEntry,
  fetchAdminWaitlist,
  joinWaitlist,
  rejectWaitlistEntry,
  setWaitlistPassword,
  validateSetPasswordToken,
} from '@/api/waitlist'
import { hasApiBaseUrl } from '@/lib/api-client'
import { notify } from '@/stores/toastStore'
import type { JoinWaitlistRequest, SetPasswordRequest } from '@/types/waitlist'

export const waitlistKeys = {
  all: ['waitlist'] as const,
  adminList: () => [...waitlistKeys.all, 'admin-list'] as const,
  setPasswordToken: (token: string) => [...waitlistKeys.all, 'token', token] as const,
}

export function useJoinWaitlist() {
  return useMutation({
    mutationFn: (body: JoinWaitlistRequest) => joinWaitlist(body),
    onSuccess: (res) => {
      notify.success(
        'You are on the waitlist',
        res.message ?? 'We will email you when your account is approved.',
      )
    },
    onError: (err) => {
      notify.error(err instanceof Error ? err.message : 'Could not join waitlist')
    },
  })
}

export function useValidateSetPasswordToken(token: string | null) {
  return useQuery({
    queryKey: waitlistKeys.setPasswordToken(token ?? ''),
    queryFn: () => validateSetPasswordToken(token!),
    enabled: Boolean(token) && hasApiBaseUrl(),
    retry: false,
  })
}

export function useSetWaitlistPassword() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (body: SetPasswordRequest) => setWaitlistPassword(body),
    onSuccess: (res) => {
      notify.success(res.message ?? 'Password set. You can sign in now.')
      navigate(LOGIN_PATH, { replace: true })
    },
    onError: (err) => {
      notify.error(err instanceof ApiError ? err.message : 'Could not set password')
    },
  })
}

export function useAdminWaitlist() {
  return useQuery({
    queryKey: waitlistKeys.adminList(),
    queryFn: fetchAdminWaitlist,
    enabled: hasApiBaseUrl(),
  })
}

export function useApproveWaitlistEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: approveWaitlistEntry,
    onSuccess: (res) => {
      void queryClient.invalidateQueries({ queryKey: waitlistKeys.adminList() })
      notify.success('Approved', res?.message ?? 'Applicant approved and invite sent.')
    },
    onError: (err) => {
      notify.error(
        err instanceof ApiError ? err.message : 'Could not approve this application.',
      )
    },
  })
}

export function useRejectWaitlistEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: rejectWaitlistEntry,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: waitlistKeys.adminList() })
      notify.success('Rejected', 'Waitlist application marked as rejected.')
    },
    onError: (err) => {
      notify.error(
        err instanceof ApiError ? err.message : 'Could not reject this application.',
      )
    },
  })
}
