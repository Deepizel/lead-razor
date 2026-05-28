export type EmailIdentityProvider = 'gmail' | 'smtp' | 'resend' | 'brevo'
export type ReplyHandlingMode = 'webhook' | 'gmail' | 'manual'

export const EMAIL_IDENTITY_PROVIDER_OPTIONS: Array<{
  value: EmailIdentityProvider
  label: string
}> = [
  { value: 'gmail', label: 'Gmail SMTP' },
  { value: 'smtp', label: 'Custom SMTP' },
  { value: 'resend', label: 'Resend' },
  { value: 'brevo', label: 'Brevo' },
]

export interface EmailIdentity {
  id: string
  label: string
  fromName: string
  fromEmail: string
  replyTo: string
  providerType: EmailIdentityProvider
  isDefault: boolean
  trackingEnabled: boolean
  domainVerified: boolean
  replyHandlingMode: ReplyHandlingMode
  smtpHost: string
  smtpPort: number
  smtpSecure: boolean
  smtpUser: string
  credentialsMasked: {
    host?: string
    user?: string
    pass?: string
    apiKey?: string
  }
  credentialsConfigured: boolean
}

export interface EmailIdentityListResponse {
  identities: EmailIdentity[]
}

export interface EmailIdentitySingleResponse {
  identity: EmailIdentity
}

export interface SaveEmailIdentityPayload {
  label: string
  fromName: string
  fromEmail: string
  replyTo?: string
  providerType: EmailIdentityProvider
  isDefault?: boolean
  trackingEnabled: boolean
  domainVerified: boolean
  replyHandlingMode: ReplyHandlingMode
  credentials?: {
    host?: string
    port?: number
    secure?: boolean
    user?: string
    pass?: string
    apiKey?: string
  }
}

export interface TestEmailIdentityResponse {
  message?: string
  success?: boolean
}
