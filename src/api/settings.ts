import {
  createEmailIdentityRemote,
  deleteEmailIdentityRemote,
  fetchEmailIdentitiesRemote,
  setDefaultEmailIdentityRemote,
  testEmailIdentityRemote,
  updateEmailIdentityRemote,
} from '@/api/settings-remote'
import { assertApiConfigured } from '@/lib/require-api'
import type { SaveEmailIdentityPayload } from '@/types/api-settings'

export async function fetchEmailIdentities() {
  assertApiConfigured()
  return fetchEmailIdentitiesRemote()
}

export async function createEmailIdentity(payload: SaveEmailIdentityPayload) {
  assertApiConfigured()
  return createEmailIdentityRemote(payload)
}

export async function updateEmailIdentity(id: string, payload: SaveEmailIdentityPayload) {
  assertApiConfigured()
  return updateEmailIdentityRemote(id, payload)
}

export async function deleteEmailIdentity(id: string) {
  assertApiConfigured()
  return deleteEmailIdentityRemote(id)
}

export async function setDefaultEmailIdentity(id: string) {
  assertApiConfigured()
  return setDefaultEmailIdentityRemote(id)
}

export async function testEmailIdentity(id: string, to?: string) {
  assertApiConfigured()
  return testEmailIdentityRemote(id, to)
}
