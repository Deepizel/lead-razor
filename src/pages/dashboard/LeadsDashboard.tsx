import { useEffect } from 'react'
import { AddLeadMenu } from '@/components/dashboard/AddLeadMenu'
import { LeadTable } from '@/components/dashboard/LeadTable'
import { LeadsFilters } from '@/components/dashboard/LeadsFilters'
import { MetricCards } from '@/components/dashboard/MetricCards'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useLeads } from '@/hooks/useLeads'
import { useUiStore } from '@/stores/uiStore'

export default function LeadsDashboard() {
  const { data: leads, isLoading, isError } = useLeads()
  const setSelectedLeadId = useUiStore((s) => s.setSelectedLeadId)

  useEffect(() => {
    setSelectedLeadId(null)
  }, [setSelectedLeadId])

  const hotCount = leads?.filter((l) => l.status === 'hot').length ?? 0
  const avgScore =
    leads && leads.length > 0
      ? Math.round(leads.reduce((sum, l) => sum + l.score, 0) / leads.length)
      : 0

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold tracking-tight">Leads dashboard</h1>
          <p className="text-xs text-muted-foreground">
            AI-scored pipeline — filter, review, and act on incoming leads
          </p>
        </div>
        <AddLeadMenu />
      </div>

      <MetricCards
        metrics={[
          { label: 'Total leads', value: String(leads?.length ?? '—') },
          { label: 'Hot leads', value: String(hotCount), hint: 'Score 80+' },
          { label: 'Avg score', value: String(avgScore) },
          { label: 'Needs action', value: '3', hint: 'Mock — re-score queue' },
        ]}
      />

      <LeadsFilters />

      <Card>
        <CardHeader>
          <CardTitle>All leads</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="space-y-3 md:space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full md:h-10" />
              ))}
            </div>
          )}
          {isError && (
            <p className="text-sm text-destructive">Failed to load leads.</p>
          )}
          {leads && leads.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No leads match your filters. Try adjusting the upload date range or
              reset filters.
            </p>
          )}
          {leads && leads.length > 0 && (
            <LeadTable
              leads={leads}
              onRescore={(id) => console.info('Re-score', id)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
