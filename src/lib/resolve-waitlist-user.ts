import type { AdminUser, WaitlistEntry } from '@/types/waitlist'

/** Links an approved waitlist row to its account for admin user actions */
export function resolveWaitlistUser(
  entry: WaitlistEntry,
  users: AdminUser[],
): AdminUser | undefined {
  if (entry.userId) {
    const byId = users.find((u) => u.id === entry.userId)
    if (byId) return byId
  }
  const email = entry.email.trim().toLowerCase()
  if (!email) return undefined
  return users.find((u) => u.email.trim().toLowerCase() === email)
}
