import { useHealthConfig } from '@/hooks/useApiHealth'
import { useEmailsApiMode } from '@/hooks/useEmails'

/** Outreach-specific config from GET /api/health/config */
export function OutreachConfigBanner() {
  const apiMode = useEmailsApiMode()
  const { data, isLoading, isError } = useHealthConfig()

  if (!apiMode) return null

  if (isLoading) {
    return (
      <p className="rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
        Checking outreach email configuration…
      </p>
    )
  }

  if (isError || !data) {
    return (
      <p className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-400">
        Could not read outreach config from{' '}
        <code className="rounded bg-muted px-1">GET /api/health/config</code>. Sends may fail
        until the backend is configured.
      </p>
    )
  }

  if (!data.outreachEmail) {
    return (
      <p className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-400">
        Outreach email is not enabled on the backend. Set{' '}
        <code className="rounded bg-muted px-1">EMAIL_PROVIDER</code> and SMTP/Resend env vars.
      </p>
    )
  }

  return (
    <p className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
      Outreach email ready
      {data.emailProvider ? ` (${data.emailProvider})` : ''}.
    </p>
  )
}
