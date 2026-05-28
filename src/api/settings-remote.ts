import { apiPaths } from '@/api/paths'
import { apiRequest } from '@/lib/api-client'
import { mapEmailIdentityList, mapEmailIdentitySingle } from '@/lib/map-email-identity'
import type {
  EmailIdentity,
  SaveEmailIdentityPayload,
  TestEmailIdentityResponse,
} from '@/types/api-settings'

export async function fetchEmailIdentitiesRemote(): Promise<EmailIdentity[]> {
  const data = await apiRequest<unknown>(apiPaths.settings.emailIdentities, {
    silentError: true,
  })
  return mapEmailIdentityList(data).identities
}

export async function createEmailIdentityRemote(
  payload: SaveEmailIdentityPayload,
): Promise<EmailIdentity> {
  const data = await apiRequest<unknown>(apiPaths.settings.emailIdentities, {
    method: 'POST',
    body: JSON.stringify(payload),
    silentError: true,
  })
  return mapEmailIdentitySingle(data).identity
}

export async function updateEmailIdentityRemote(
  id: string,
  payload: SaveEmailIdentityPayload,
): Promise<EmailIdentity> {
  const data = await apiRequest<unknown>(apiPaths.settings.emailIdentityDetail(id), {
    method: 'PATCH',
    body: JSON.stringify(payload),
    silentError: true,
  })
  return mapEmailIdentitySingle(data).identity
}

export async function deleteEmailIdentityRemote(id: string): Promise<void> {
  await apiRequest(apiPaths.settings.emailIdentityDetail(id), {
    method: 'DELETE',
    silentError: true,
  })
}

export async function setDefaultEmailIdentityRemote(id: string): Promise<void> {
  await apiRequest(apiPaths.settings.emailIdentitySetDefault(id), {
    method: 'POST',
    body: JSON.stringify({}),
    silentError: true,
  })
}

export async function testEmailIdentityRemote(
  id: string,
  to?: string,
): Promise<TestEmailIdentityResponse> {
  return apiRequest<TestEmailIdentityResponse>(apiPaths.settings.emailIdentityTest(id), {
    method: 'POST',
    body: JSON.stringify(to ? { to } : {}),
    silentError: true,
  })
}
