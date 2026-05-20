/** Backend route paths (prepend `apiBaseUrl` from api-client) */
export const apiPaths = {
  health: '/',
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
    detail: (id: string) => `/api/leads/${id}`,
    snapshot: (id: string) => `/api/leads/${id}/snapshot`,
    sendEmail: (id: string) => `/api/leads/${id}/email/send`,
    upload: '/api/leads/upload',
  },
  uploads: {
    progress: (id: string) => `/api/uploads/${id}/progress`,
  },
  categories: {
    list: '/api/categories',
    detail: (id: string) => `/api/categories/${id}`,
  },
  events: '/api/events',
} as const
