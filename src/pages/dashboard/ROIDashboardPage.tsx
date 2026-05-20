import { ApiStatusBanner } from '@/components/layout/ApiStatusBanner'
import { EmptyAnalytics } from '@/components/layout/EmptyAnalytics'

export default function ROIDashboardPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">ROI & performance</h1>
        <p className="text-xs text-muted-foreground">
          Business impact of AI lead qualification
        </p>
      </div>

      <ApiStatusBanner />

      <EmptyAnalytics
        title="No ROI data yet"
        description="Revenue and conversion metrics will appear here when the backend exposes an analytics endpoint."
      />
    </div>
  )
}
