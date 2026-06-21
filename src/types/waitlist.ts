export type UserRole = 'admin' | 'user'
export type UserStatus = 'pending' | 'active' | 'deactivated'
export type WaitlistStatus = 'pending' | 'active' | 'rejected'

export interface JoinWaitlistRequest {
  firstName: string
  lastName: string
  email: string
  businessIndustry: string
}

export interface WaitlistEntry {
  id: string
  /** Set after approve — used for deactivate via /api/admin/users/:id/deactivate */
  userId?: string
  firstName: string
  lastName: string
  email: string
  businessIndustry: string
  status: WaitlistStatus
  createdAt: string
}

export interface AdminUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  status: UserStatus
  createdAt?: string
}

export interface SetPasswordTokenInfo {
  email: string
  firstName: string
  lastName: string
}

export interface SetPasswordRequest {
  token: string
  password: string
}
