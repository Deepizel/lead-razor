import { apiBaseUrl } from '@/lib/api-client'
import { useApiHealth } from '@/hooks/useApiHealth'
import { useLeadsApiMode } from '@/hooks/useLeads'

export function ApiStatusBanner() {
  const apiMode = useLeadsApiMode()
  const { data: healthy, isLoading, isError } = useApiHealth()

  if (!apiMode) {
    return (
      <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
        Set <code className="rounded bg-muted px-1">VITE_API_BASE_URL</code> in `.env` and
        restart the dev server. This app only loads data from the backend API.
      </p>
    )
  }

  if (isLoading) {
    return (
      <p className="rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
        Connecting to {apiBaseUrl}…
      </p>
    )
  }

  if (isError || !healthy) {
    return (
      <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
        Cannot reach API at {apiBaseUrl}. Render cold starts can take ~1 minute — retry shortly.
      </p>
    )
  }

  return (
    <p className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-400">
      Connected to {apiBaseUrl}
    </p>
  )
}
