import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ActionButtonGroup } from '@/components/dashboard/ActionButtonGroup'
import { LeadProfilePanel } from '@/components/dashboard/LeadProfilePanel'
import { ReasoningPanel } from '@/components/dashboard/ReasoningPanel'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useLead } from '@/hooks/useLeads'
import { useUiStore } from '@/stores/uiStore'

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: lead, isLoading, isError } = useLead(id)
  const setSelectedLeadId = useUiStore((s) => s.setSelectedLeadId)

  useEffect(() => {
    if (id) setSelectedLeadId(id)
    return () => setSelectedLeadId(null)
  }, [id, setSelectedLeadId])

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
          <Link to="/">← Back to leads</Link>
        </Button>
        <p className="text-sm text-destructive">Lead not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2">
            <Link to="/">← Back to leads</Link>
          </Button>
          <h1 className="text-lg font-semibold tracking-tight">Lead detail</h1>
          <p className="text-xs text-muted-foreground">
            AI reasoning and recommended actions
          </p>
        </div>
        <Button variant="outline" size="sm" className="w-full shrink-0 sm:w-auto">
          Trigger re-score
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,280px)_1fr_minmax(0,320px)]">
        <LeadProfilePanel lead={lead} />
        <ReasoningPanel lead={lead} />
        <ActionButtonGroup lead={lead} />
      </div>
    </div>
  )
}
