/** Backend route paths (prepend `apiBaseUrl` from api-client) */
export const apiPaths = {
  health: {
    root: '/',
    config: '/api/health/config',
  },
  auth: {
    signup: '/api/auth/signup',
    login: '/api/auth/login',
    refresh: '/api/auth/refresh',
    forgotPassword: '/api/auth/forgot-password',
    resetPassword: '/api/auth/reset-password',
    verifyEmail: '/api/auth/verify-email',
    me: '/api/auth/me',
  },
  leads: {
    list: '/api/leads',
    /** POST — create one lead (JSON body, same fields as upload template) */
    create: '/api/leads',
    detail: (id: string) => `/api/leads/${id}`,
    snapshot: (id: string) => `/api/leads/${id}/snapshot`,
    sendEmail: (id: string) => `/api/leads/${id}/email/send`,
    emails: (id: string) => `/api/leads/${id}/emails`,
    score: (id: string) => `/api/leads/${id}/score`,
    upload: '/api/leads/upload',
    uploadTemplate: '/api/leads/upload/template',
    export: '/api/leads/export',
  },
  emails: {
    draft: '/api/emails/draft',
    recipientsPreview: '/api/emails/recipients/preview',
    send: '/api/emails/send',
    list: '/api/emails',
    detail: (id: string) => `/api/emails/${id}`,
  },
  /** Public tracking — embedded in sent emails; not called from the SPA */
  track: {
    open: (id: string) => `/api/track/open/${id}.png`,
    click: (id: string, linkIndex: number) => `/api/track/click/${id}/${linkIndex}`,
  },
  webhooks: {
    /** Public inbound reply webhook (Resend) */
    resendInbound: '/api/webhooks/resend/inbound',
  },
  uploads: {
    progress: (id: string) => `/api/uploads/${id}/progress`,
  },
  categories: {
    list: '/api/categories',
    detail: (id: string) => `/api/categories/${id}`,
  },
  events: '/api/events',
  analytics: {
    pipeline: '/api/analytics/pipeline',
  },
  reports: {
    export: '/api/reports/export',
  },
} as const
