import { MetricCards } from '@/components/dashboard/MetricCards'
import { PipelineChart } from '@/components/dashboard/PipelineChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { usePipelineStages } from '@/hooks/useLeads'

export default function PipelineAnalyticsPage() {
  const { data: stages, isLoading } = usePipelineStages()

  const total = stages?.reduce((sum, s) => sum + s.count, 0) ?? 0
  const closed = stages?.find((s) => s.stage === 'Closed')?.count ?? 0
  const conversion = total > 0 ? ((closed / total) * 100).toFixed(1) : '0'

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Pipeline analytics</h1>
        <p className="text-xs text-muted-foreground">
          Funnel performance from new lead to closed won
        </p>
      </div>

      <MetricCards
        metrics={[
          { label: 'Total leads', value: String(total) },
          { label: 'Conversion rate', value: `${conversion}%` },
          { label: 'Avg lead score', value: '71', hint: 'Mock aggregate' },
          { label: 'Meetings booked', value: '41', hint: 'Pipeline stage' },
        ]}
      />

      {isLoading ? (
        <Skeleton className="h-[260px] w-full sm:h-[360px]" />
      ) : (
        stages && <PipelineChart data={stages} />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Stage breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-2 gap-2 lg:grid-cols-5">
            {stages?.map((stage) => (
              <li
                key={stage.stage}
                className="rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-xs"
              >
                <span className="text-muted-foreground">{stage.stage}</span>
                <p className="text-lg font-semibold tabular-nums">{stage.count}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
