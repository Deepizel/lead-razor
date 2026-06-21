import { apiPaths } from '@/api/paths'
import { apiRequest } from '@/lib/api-client'
import { mapAdminUsersList } from '@/lib/map-waitlist'
import type { AuthMessageResponse } from '@/types/auth'
import type { UserRole } from '@/types/waitlist'

export async function fetchAdminUsersRemote() {
  const raw = await apiRequest<unknown>(apiPaths.admin.users, { silentError: true })
  return mapAdminUsersList(raw)
}

export async function approveUserRemote(id: string): Promise<AuthMessageResponse> {
  return apiRequest<AuthMessageResponse>(apiPaths.admin.userApprove(id), {
    method: 'POST',
    body: JSON.stringify({}),
    silentError: true,
  })
}

export async function deactivateUserRemote(id: string): Promise<AuthMessageResponse> {
  return apiRequest<AuthMessageResponse>(apiPaths.admin.userDeactivate(id), {
    method: 'POST',
    body: JSON.stringify({}),
    silentError: true,
  })
}

export async function updateUserRoleRemote(
  id: string,
  role: UserRole,
): Promise<AuthMessageResponse> {
  return apiRequest<AuthMessageResponse>(apiPaths.admin.userRole(id), {
    method: 'PATCH',
    body: JSON.stringify({ role }),
    silentError: true,
  })
}
