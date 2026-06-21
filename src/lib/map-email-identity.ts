import type {
  EmailIdentity,
  EmailIdentityListResponse,
  EmailIdentityProvider,
  EmailIdentitySingleResponse,
  ReplyHandlingMode,
  SaveEmailIdentityPayload,
} from '@/types/api-settings'

function pickString(o: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const v = o[key]
    if (typeof v === 'string') return v
  }
  return ''
}

function pickBoolean(o: Record<string, unknown>, ...keys: string[]): boolean {
  for (const key of keys) {
    const v = o[key]
    if (typeof v === 'boolean') return v
  }
  return false
}

function normalizeProvider(raw: string): EmailIdentityProvider {
  const v = raw.toLowerCase()
  if (v === 'gmail' || v === 'gmail_smtp') return 'gmail'
  if (v === 'smtp' || v === 'custom_smtp') return 'smtp'
  if (v === 'resend') return 'resend'
  if (v === 'brevo') return 'brevo'
  return 'gmail'
}

function normalizeReplyMode(raw: string): ReplyHandlingMode {
  if (raw === 'gmail') return 'gmail'
  if (raw === 'manual') return 'manual'
  return 'webhook'
}

function mapIdentity(raw: unknown): EmailIdentity | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const id = pickString(o, 'id')
  if (!id) return null

  const providerType = normalizeProvider(pickString(o, 'providerType', 'provider_type', 'provider'))
  const masked = (o.credentialsMasked ?? o.credentials_masked ?? {}) as Record<string, unknown>
  const portRaw = o.smtpPort ?? o.smtp_port

  return {
    id,
    label: pickString(o, 'label'),
    fromName: pickString(o, 'fromName', 'from_name'),
    fromEmail: pickString(o, 'fromEmail', 'from_email'),
    replyTo: pickString(o, 'replyTo', 'reply_to'),
    providerType,
    isDefault: pickBoolean(o, 'isDefault', 'is_default'),
    trackingEnabled: pickBoolean(o, 'trackingEnabled', 'tracking_enabled'),
    domainVerified: pickBoolean(o, 'domainVerified', 'domain_verified'),
    replyHandlingMode: normalizeReplyMode(
      pickString(o, 'replyHandlingMode', 'reply_handling_mode') || 'webhook',
    ),
    smtpHost: pickString(o, 'smtpHost', 'smtp_host', 'host'),
    smtpPort: typeof portRaw === 'number' ? portRaw : Number(portRaw) || 587,
    smtpSecure: pickBoolean(o, 'smtpSecure', 'smtp_secure', 'secure'),
    smtpUser: pickString(o, 'smtpUser', 'smtp_user', 'user'),
    credentialsMasked: {
      host: typeof masked.host === 'string' ? masked.host : undefined,
      user: typeof masked.user === 'string' ? masked.user : undefined,
      pass: typeof masked.pass === 'string' ? masked.pass : undefined,
      apiKey: typeof masked.apiKey === 'string' ? masked.apiKey : undefined,
    },
    credentialsConfigured: Boolean(
      o.credentialsConfigured ?? o.credentials_configured ?? masked.pass ?? masked.apiKey ?? masked.user,
    ),
  }
}

export function mapEmailIdentityList(raw: unknown): EmailIdentityListResponse {
  const o = (raw ?? {}) as Record<string, unknown>
  const list = Array.isArray(raw) ? raw : (o.identities ?? o.items ?? [])
  const identities = Array.isArray(list)
    ? list.map(mapIdentity).filter((v): v is EmailIdentity => v != null)
    : []
  return { identities }
}

export function mapEmailIdentitySingle(raw: unknown): EmailIdentitySingleResponse {
  const o = (raw ?? {}) as Record<string, unknown>
  const identityRaw = o.identity ?? raw
  const identity = mapIdentity(identityRaw)
  return { identity: identity as EmailIdentity }
}

export interface EmailIdentityFormState {
  label: string
  fromName: string
  fromEmail: string
  replyTo: string
  providerType: EmailIdentityProvider
  trackingEnabled: boolean
  domainVerified: boolean
  replyHandlingMode: ReplyHandlingMode
  smtpHost: string
  smtpPort: string
  smtpSecure: boolean
  smtpUser: string
  smtpPass: string
  apiKey: string
}

export const MASKED_SECRET_PLACEHOLDER = '••••••••'

export function toFormState(identity?: EmailIdentity): EmailIdentityFormState {
  return {
    label: identity?.label ?? '',
    fromName: identity?.fromName ?? '',
    fromEmail: identity?.fromEmail ?? '',
    replyTo: identity?.replyTo ?? '',
    providerType: identity?.providerType ?? 'gmail',
    trackingEnabled: identity?.trackingEnabled ?? true,
    domainVerified: identity?.domainVerified ?? false,
    replyHandlingMode: identity?.replyHandlingMode ?? 'webhook',
    smtpHost: identity?.smtpHost ?? 'smtp.gmail.com',
    smtpPort: String(identity?.smtpPort ?? 587),
    smtpSecure: identity?.smtpSecure ?? false,
    smtpUser: identity?.smtpUser ?? '',
    smtpPass: '',
    apiKey: '',
  }
}

export function buildSavePayload(
  form: EmailIdentityFormState,
  includeSecrets: boolean,
): SaveEmailIdentityPayload {
  const payload: SaveEmailIdentityPayload = {
    label: form.label.trim(),
    fromName: form.fromName.trim(),
    fromEmail: form.fromEmail.trim(),
    replyTo: form.replyTo.trim() || undefined,
    providerType: form.providerType,
    trackingEnabled: form.trackingEnabled,
    domainVerified: form.domainVerified,
    replyHandlingMode: form.replyHandlingMode,
  }

  if (!includeSecrets) return payload

  if (form.providerType === 'gmail' || form.providerType === 'smtp') {
    payload.credentials = {
      host: form.smtpHost.trim(),
      port: Number(form.smtpPort) || 587,
      secure: form.smtpSecure,
      user: form.smtpUser.trim(),
      pass: form.smtpPass,
    }
  } else {
    payload.credentials = { apiKey: form.apiKey }
  }

  return payload
}
