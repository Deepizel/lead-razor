import { apiPaths } from '@/api/paths'
import { apiRequest } from '@/lib/api-client'
import { mapWaitlistList } from '@/lib/map-waitlist'
import type { AuthMessageResponse } from '@/types/auth'
import type {
  JoinWaitlistRequest,
  SetPasswordRequest,
  SetPasswordTokenInfo,
} from '@/types/waitlist'

export async function joinWaitlistRemote(body: JoinWaitlistRequest): Promise<AuthMessageResponse> {
  return apiRequest<AuthMessageResponse>(apiPaths.waitlist.join, {
    method: 'POST',
    body: JSON.stringify(body),
    skipAuth: true,
    silentError: true,
  })
}

export async function validateSetPasswordTokenRemote(
  token: string,
): Promise<SetPasswordTokenInfo> {
  const qs = new URLSearchParams({ token })
  return apiRequest<SetPasswordTokenInfo>(
    `${apiPaths.waitlist.setPassword}?${qs}`,
    { skipAuth: true, silentError: true },
  )
}

export async function setWaitlistPasswordRemote(
  body: SetPasswordRequest,
): Promise<AuthMessageResponse> {
  return apiRequest<AuthMessageResponse>(apiPaths.waitlist.setPassword, {
    method: 'POST',
    body: JSON.stringify(body),
    skipAuth: true,
    silentError: true,
  })
}

export async function fetchAdminWaitlistRemote() {
  const raw = await apiRequest<unknown>(apiPaths.admin.waitlist, { silentError: true })
  return mapWaitlistList(raw)
}

export async function approveWaitlistEntryRemote(id: string): Promise<AuthMessageResponse> {
  return apiRequest<AuthMessageResponse>(apiPaths.admin.waitlistApprove(id), {
    method: 'POST',
    body: JSON.stringify({}),
    silentError: true,
    /** Approve may send email synchronously */
    timeoutMs: 90_000,
  })
}

export async function rejectWaitlistEntryRemote(id: string): Promise<AuthMessageResponse> {
  return apiRequest<AuthMessageResponse>(apiPaths.admin.waitlistReject(id), {
    method: 'POST',
    body: JSON.stringify({}),
    silentError: true,
  })
}
