import type {
  AdminUser,
  UserRole,
  UserStatus,
  WaitlistEntry,
  WaitlistStatus,
} from '@/types/waitlist'

function pickString(o: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const v = o[key]
    if (typeof v === 'string') return v
    if (typeof v === 'number' && Number.isFinite(v)) return String(v)
  }
  return ''
}

function mapWaitlistStatus(raw: string): WaitlistStatus {
  if (raw === 'active' || raw === 'rejected') return raw
  return 'pending'
}

function mapUserStatus(raw: string): UserStatus {
  if (raw === 'active' || raw === 'deactivated') return raw
  return 'pending'
}

function mapUserRole(raw: string): UserRole {
  return raw === 'admin' ? 'admin' : 'user'
}

export function mapWaitlistEntry(raw: unknown): WaitlistEntry | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const id = pickString(o, 'id')
  if (!id) return null
  const userId = pickString(o, 'userId', 'user_id')
  return {
    id,
    userId: userId || undefined,
    firstName: pickString(o, 'firstName', 'first_name'),
    lastName: pickString(o, 'lastName', 'last_name'),
    email: pickString(o, 'email'),
    businessIndustry: pickString(o, 'businessIndustry', 'business_industry'),
    status: mapWaitlistStatus(pickString(o, 'status') || 'pending'),
    createdAt: pickString(o, 'createdAt', 'created_at'),
  }
}

export function mapWaitlistList(raw: unknown): WaitlistEntry[] {
  const o = (raw ?? {}) as Record<string, unknown>
  const list = Array.isArray(raw) ? raw : (o.waitlist ?? o.entries ?? o.items ?? [])
  if (!Array.isArray(list)) return []
  return list.map(mapWaitlistEntry).filter((e): e is WaitlistEntry => e != null)
}

export function mapAdminUser(raw: unknown): AdminUser | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const id = pickString(o, 'id')
  if (!id) return null
  return {
    id,
    email: pickString(o, 'email'),
    firstName: pickString(o, 'firstName', 'first_name'),
    lastName: pickString(o, 'lastName', 'last_name'),
    role: mapUserRole(pickString(o, 'role') || 'user'),
    status: mapUserStatus(pickString(o, 'status') || 'pending'),
    createdAt: pickString(o, 'createdAt', 'created_at') || undefined,
  }
}

export function mapAdminUsersList(raw: unknown): AdminUser[] {
  const o = (raw ?? {}) as Record<string, unknown>
  const list = Array.isArray(raw) ? raw : (o.users ?? o.items ?? [])
  if (!Array.isArray(list)) return []
  return list.map(mapAdminUser).filter((u): u is AdminUser => u != null)
}
