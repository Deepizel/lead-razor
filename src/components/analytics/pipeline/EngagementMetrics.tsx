import { MetricCards } from '@/components/dashboard/MetricCards'
import { formatRate } from '@/lib/pipeline-analytics'
import type { PipelineEngagement } from '@/types/api-pipeline'

interface EngagementMetricsProps {
  engagement: PipelineEngagement
}

export function EngagementMetrics({ engagement }: EngagementMetricsProps) {
  return (
    <MetricCards
      metrics={[
        {
          label: 'Total leads',
          value: String(engagement.totalLeads),
        },
        {
          label: 'Leads emailed',
          value: String(engagement.leadsEmailed),
          hint: 'At least one email sent',
        },
        {
          label: 'Open rate',
          value: formatRate(engagement.openRate),
          hint: 'Of emailed leads',
        },
        {
          label: 'Reply rate',
          value: formatRate(engagement.replyRate),
        },
        {
          label: 'Click rate',
          value: formatRate(engagement.clickRate),
        },
        {
          label: 'Booking rate',
          value: formatRate(engagement.bookingRate),
        },
      ]}
    />
  )
}
