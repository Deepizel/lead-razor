import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { weekOverWeekDelta } from '@/lib/pipeline-analytics'
import type { PipelineHotLeadsWeekOverWeek } from '@/types/api-pipeline'
import { cn } from '@/lib/utils'

interface HotLeadsWeekCardProps {
  data: PipelineHotLeadsWeekOverWeek
}

export function HotLeadsWeekCard({ data }: HotLeadsWeekCardProps) {
  const { delta, percent } = weekOverWeekDelta(
    data.currentWeek,
    data.previousWeek,
  )
  const positive = delta >= 0

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Hot leads this week</CardTitle>
        <p className="text-xs text-muted-foreground">
          Compared to {data.previousWeek} hot lead{data.previousWeek === 1 ? '' : 's'}{' '}
          last week
        </p>
      </CardHeader>
      <CardContent className="flex flex-wrap items-end gap-3">
        <p className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {data.currentWeek}
        </p>
        <p
          className={cn(
            'text-sm font-medium',
            positive ? 'text-emerald-400' : 'text-amber-400',
          )}
        >
          {positive ? '+' : ''}
          {delta} vs prior week
          {percent != null && (
            <span className="text-muted-foreground">
              {' '}
              ({positive ? '+' : ''}
              {percent}%)
            </span>
          )}
        </p>
      </CardContent>
    </Card>
  )
}
