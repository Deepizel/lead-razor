import { Cancel01Icon, Tick02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { ScoreBadge } from '@/components/dashboard/ScoreBadge'
import { StatusChip } from '@/components/dashboard/StatusChip'
import { Skeleton } from '@/components/ui/skeleton'
import { useLeadScoreBreakdown } from '@/hooks/useLeads'
import { cn } from '@/lib/utils'

interface ScoreBreakdownChecklistProps {
  leadId: string
  fallbackReasoning?: string[]
}

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <p className="text-xs text-muted-foreground">None detected</p>
  }
  return (
    <ul className="list-disc space-y-1.5 pl-4 text-xs text-muted-foreground">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

export function ScoreBreakdownChecklist({
  leadId,
  fallbackReasoning = [],
}: ScoreBreakdownChecklistProps) {
  const { data, isLoading, isError } = useLeadScoreBreakdown(leadId)

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    )
  }

  if (isError || !data || data.breakdown.length === 0) {
    return (
      <div>
        <p className="mb-3 text-xs text-muted-foreground">
          Score breakdown unavailable — showing AI summary instead.
        </p>
        <BulletList items={fallbackReasoning} />
      </div>
    )
  }

  const maxPoints = data.breakdown.reduce((sum, item) => sum + item.points, 0)
  const earned = data.breakdown
    .filter((item) => item.met)
    .reduce((sum, item) => sum + item.points, 0)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <ScoreBadge score={data.total} status={data.tier} />
        <StatusChip status={data.tier} />
        <span className="text-xs text-muted-foreground">
          {earned} of {maxPoints} possible signal points
        </span>
      </div>

      <ul className="space-y-2">
        {data.breakdown.map((item) => (
          <li
            key={item.signal}
            className={cn(
              'flex items-start gap-2.5 rounded-md border px-3 py-2 text-xs',
              item.met
                ? 'border-emerald-500/30 bg-emerald-500/5'
                : 'border-border/60 bg-muted/20',
            )}
          >
            <span
              className={cn(
                'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full',
                item.met
                  ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                  : 'bg-muted text-muted-foreground',
              )}
              aria-hidden
            >
              <HugeiconsIcon
                icon={item.met ? Tick02Icon : Cancel01Icon}
                strokeWidth={2}
                className="size-2.5"
              />
            </span>
            <p
              className={cn(
                'min-w-0 flex-1 leading-snug',
                item.met ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {item.signal}
              <span className="sr-only">{item.met ? ' — met' : ' — not met'}</span>
            </p>
            <span
              className={cn(
                'shrink-0 font-mono text-[0.625rem] font-medium tabular-nums',
                item.met ? 'text-emerald-700 dark:text-emerald-400' : 'text-muted-foreground',
              )}
            >
              {item.met ? '+' : ''}
              {item.points} pts
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
