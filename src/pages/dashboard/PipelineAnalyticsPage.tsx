import { ApiStatusBanner } from '@/components/layout/ApiStatusBanner'
import { EmptyAnalytics } from '@/components/layout/EmptyAnalytics'

export default function PipelineAnalyticsPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Pipeline analytics</h1>
        <p className="text-xs text-muted-foreground">
          Funnel performance from new lead to closed won
        </p>
      </div>

      <ApiStatusBanner />

      <EmptyAnalytics
        title="No pipeline data yet"
        description="Pipeline metrics will appear here when the backend exposes an analytics endpoint. Until then, use the leads dashboard and upload flow to grow your pipeline."
      />
    </div>
  )
}
