import { apiPaths } from '@/api/paths'
import { apiRequest } from '@/lib/api-client'
import { useAuthStore } from '@/stores/authStore'
import type {
  AuthMessageResponse,
  AuthSession,
  AuthUser,
  ForgotPasswordRequest,
  LoginRequest,
  RefreshRequest,
  ResetPasswordRequest,
  SignupRequest,
} from '@/types/auth'

const ACCESS_TTL_MS = 5 * 60 * 1000

interface RawAuthPayload {
  accessToken?: string
  access_token?: string
  refreshToken?: string
  refresh_token?: string
  user?: RawUser
}

interface RawUser {
  id: string
  email: string
  emailVerified?: boolean
  email_verified?: boolean
  role?: string
  status?: string
  firstName?: string
  first_name?: string
  lastName?: string
  last_name?: string
}

/** `/api/auth/me` returns `{ user: { ... } }`; login/refresh may nest `user` too */
function unwrapRawUser(raw: unknown): RawUser {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid user response from server')
  }
  const o = raw as Record<string, unknown>
  if (o.user && typeof o.user === 'object') {
    return o.user as RawUser
  }
  return raw as RawUser
}

function mapUser(raw: RawUser): AuthUser {
  const role = raw.role === 'admin' ? 'admin' : raw.role === 'user' ? 'user' : undefined
  const status =
    raw.status === 'active' || raw.status === 'deactivated' || raw.status === 'pending'
      ? raw.status
      : undefined
  return {
    id: raw.id,
    email: raw.email,
    emailVerified: Boolean(raw.emailVerified ?? raw.email_verified),
    role,
    status,
    firstName: raw.firstName ?? raw.first_name ?? undefined,
    lastName: raw.lastName ?? raw.last_name ?? undefined,
  }
}

function mapSession(raw: RawAuthPayload, user: AuthUser): AuthSession {
  const accessToken = raw.accessToken ?? raw.access_token
  const refreshToken = raw.refreshToken ?? raw.refresh_token
  if (!accessToken || !refreshToken) {
    throw new Error('Invalid auth response from server')
  }
  return {
    accessToken,
    refreshToken,
    accessTokenExpiresAt: Date.now() + ACCESS_TTL_MS,
    user,
  }
}

function mapAuthResponse(raw: RawAuthPayload & { user?: RawUser }): AuthSession {
  const user = raw.user
    ? mapUser(raw.user)
    : { id: '', email: '', emailVerified: false }
  return mapSession(raw, user)
}

export async function signup(body: SignupRequest): Promise<AuthMessageResponse> {
  return apiRequest<AuthMessageResponse>(apiPaths.auth.signup, {
    method: 'POST',
    body: JSON.stringify(body),
    skipAuth: true,
    silentError: true,
  })
}

export async function login(body: LoginRequest): Promise<AuthSession> {
  const raw = await apiRequest<RawAuthPayload & { user: RawUser }>(apiPaths.auth.login, {
    method: 'POST',
    body: JSON.stringify(body),
    skipAuth: true,
    silentError: true,
  })
  return mapAuthResponse(raw)
}

export async function refreshSession(body: RefreshRequest): Promise<AuthSession> {
  const raw = await apiRequest<RawAuthPayload & { user?: RawUser }>(apiPaths.auth.refresh, {
    method: 'POST',
    body: JSON.stringify(body),
    skipAuth: true,
    silentError: true,
  })
  const existingUser = useAuthStore.getState().user
  const user = raw.user ? mapUser(raw.user) : existingUser ?? { id: '', email: '', emailVerified: false }
  return mapSession(raw, user)
}

export async function fetchMe(): Promise<AuthUser> {
  const raw = await apiRequest<unknown>(apiPaths.auth.me, { silentError: true })
  return mapUser(unwrapRawUser(raw))
}

export async function forgotPassword(body: ForgotPasswordRequest): Promise<AuthMessageResponse> {
  return apiRequest<AuthMessageResponse>(apiPaths.auth.forgotPassword, {
    method: 'POST',
    body: JSON.stringify(body),
    skipAuth: true,
    silentError: true,
  })
}

export async function resetPassword(body: ResetPasswordRequest): Promise<AuthMessageResponse> {
  return apiRequest<AuthMessageResponse>(apiPaths.auth.resetPassword, {
    method: 'POST',
    body: JSON.stringify(body),
    skipAuth: true,
    silentError: true,
  })
}

export async function verifyEmail(token: string): Promise<AuthMessageResponse> {
  return apiRequest<AuthMessageResponse>(
    `${apiPaths.auth.verifyEmail}?token=${encodeURIComponent(token)}`,
    { skipAuth: true, silentError: true },
  )
}
