import type { UserRole, UserStatus } from '@/types/waitlist'

export interface AuthUser {
  id: string
  email: string
  emailVerified: boolean
  role?: UserRole
  status?: UserStatus
  firstName?: string
  lastName?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  /** Unix ms when access token expires */
  accessTokenExpiresAt: number
}

export interface AuthSession extends AuthTokens {
  user: AuthUser
}

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
}

export interface RefreshRequest {
  refreshToken: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
}

export interface AuthMessageResponse {
  message: string
}
