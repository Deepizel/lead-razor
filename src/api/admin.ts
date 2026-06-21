import {
  approveUserRemote,
  deactivateUserRemote,
  fetchAdminUsersRemote,
  updateUserRoleRemote,
} from '@/api/admin-remote'
import { assertApiConfigured } from '@/lib/require-api'
import type { UserRole } from '@/types/waitlist'

export async function fetchAdminUsers() {
  assertApiConfigured()
  return fetchAdminUsersRemote()
}

export async function approveUser(id: string) {
  assertApiConfigured()
  return approveUserRemote(id)
}

export async function deactivateUser(id: string) {
  assertApiConfigured()
  return deactivateUserRemote(id)
}

export async function updateUserRole(id: string, role: UserRole) {
  assertApiConfigured()
  return updateUserRoleRemote(id, role)
}
