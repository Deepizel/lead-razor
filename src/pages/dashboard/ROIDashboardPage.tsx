import { MetricCards } from '@/components/dashboard/MetricCards'
import { ROIChart } from '@/components/dashboard/ROIChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useROIMetrics } from '@/hooks/useLeads'

export default function ROIDashboardPage() {
  const { data: metrics, isLoading } = useROIMetrics()

  const latest = metrics?.[metrics.length - 1]

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">ROI & performance</h1>
        <p className="text-xs text-muted-foreground">
          Business impact of AI lead qualification
        </p>
      </div>

      <MetricCards
        metrics={[
          {
            label: 'Revenue (May)',
            value: latest ? `$${(latest.revenue / 1000).toFixed(0)}k` : '—',
          },
          {
            label: 'Conversion rate',
            value: latest ? `${latest.conversionRate}%` : '—',
          },
          {
            label: 'Email → meeting',
            value: latest ? `${latest.emailToMeeting}%` : '—',
          },
          {
            label: 'Avg lead score',
            value: latest ? String(latest.avgScore) : '—',
          },
        ]}
      />

      {isLoading ? (
        <Skeleton className="h-[360px] w-full" />
      ) : (
        metrics && <ROIChart data={metrics} />
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue attributed</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Mock: AI-qualified leads drove ${latest?.revenue.toLocaleString() ?? 0} in
            attributed pipeline revenue this month.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Lead quality trend</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Average score improved from 58 → {latest?.avgScore ?? '—'} over five months as
            the agent learned your ICP signals.
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
