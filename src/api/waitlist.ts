import {
  approveWaitlistEntryRemote,
  fetchAdminWaitlistRemote,
  joinWaitlistRemote,
  rejectWaitlistEntryRemote,
  setWaitlistPasswordRemote,
  validateSetPasswordTokenRemote,
} from '@/api/waitlist-remote'
import { assertApiConfigured } from '@/lib/require-api'
import type { JoinWaitlistRequest, SetPasswordRequest } from '@/types/waitlist'

export async function joinWaitlist(body: JoinWaitlistRequest) {
  assertApiConfigured()
  return joinWaitlistRemote(body)
}

export async function validateSetPasswordToken(token: string) {
  assertApiConfigured()
  return validateSetPasswordTokenRemote(token)
}

export async function setWaitlistPassword(body: SetPasswordRequest) {
  assertApiConfigured()
  return setWaitlistPasswordRemote(body)
}

export async function fetchAdminWaitlist() {
  assertApiConfigured()
  return fetchAdminWaitlistRemote()
}

export async function approveWaitlistEntry(id: string) {
  assertApiConfigured()
  return approveWaitlistEntryRemote(id)
}

export async function rejectWaitlistEntry(id: string) {
  assertApiConfigured()
  return rejectWaitlistEntryRemote(id)
}
