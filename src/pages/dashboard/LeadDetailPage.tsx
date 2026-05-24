import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ActionButtonGroup,
  type SendEmailPayload,
} from '@/components/dashboard/ActionButtonGroup'
import { LeadEmailTimeline } from '@/components/lead/LeadEmailTimeline'
import { LeadProfilePanel } from '@/components/dashboard/LeadProfilePanel'
import { ReasoningPanel } from '@/components/dashboard/ReasoningPanel'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useLead,
  useLeadsApiMode,
  useRefreshLeadSnapshot,
  useSendLeadEmail,
} from '@/hooks/useLeads'
import { ApiError } from '@/lib/api-client'
import { useUiStore } from '@/stores/uiStore'

function errorMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message
  if (err instanceof Error) return err.message
  return 'Something went wrong'
}

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>()
  const apiMode = useLeadsApiMode()
  const { data: lead, isLoading, isError, error } = useLead(id)
  const refreshSnapshot = useRefreshLeadSnapshot(id)
  const sendEmail = useSendLeadEmail(id)
  const setSelectedLeadId = useUiStore((s) => s.setSelectedLeadId)

  useEffect(() => {
    if (id) setSelectedLeadId(id)
    return () => setSelectedLeadId(null)
  }, [id, setSelectedLeadId])

  const sendHint = apiMode
    ? lead?.hasSnapshot
      ? 'Send the AI snapshot as-is, or edit subject/body for a custom message.'
      : 'Refresh snapshot before sending.'
    : undefined

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    )
  }

  if (isError || !lead) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard">← Back to leads</Link>
        </Button>
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : 'Lead not found.'}
        </p>
        <p className="text-xs text-muted-foreground">
          Use a lead UUID from your database in the URL (e.g. from an upload or{' '}
          <code className="rounded bg-muted px-1">GET /api/leads</code>).
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2">
            <Link to="/dashboard">← Back to leads</Link>
          </Button>
          <h1 className="text-lg font-semibold tracking-tight">Lead detail</h1>
          <p className="text-xs text-muted-foreground">
            Snapshot profiling and Resend email via API
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full shrink-0 sm:w-auto"
          disabled={!apiMode || refreshSnapshot.isPending}
          onClick={() => refreshSnapshot.mutate(undefined)}
        >
          {refreshSnapshot.isPending ? 'Refreshing…' : 'Refresh snapshot'}
        </Button>
      </div>

      {refreshSnapshot.isError && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {errorMessage(refreshSnapshot.error)}
        </p>
      )}
      {sendEmail.isError && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {errorMessage(sendEmail.error)}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,280px)_1fr_minmax(0,320px)]">
        <LeadProfilePanel lead={lead} />
        <ReasoningPanel lead={lead} />
        <ActionButtonGroup
          lead={lead}
          onSendEmail={(payload: SendEmailPayload) => sendEmail.mutate(payload)}
          isSending={sendEmail.isPending}
          sendDisabled={!apiMode}
          sendHint={sendHint}
        />
      </div>

      <LeadEmailTimeline leadId={lead.id} />
    </div>
  )
}
