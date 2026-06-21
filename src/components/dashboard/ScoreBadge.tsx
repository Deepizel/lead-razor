import { Badge } from '@/components/ui/badge'
import { leadStatusScoreClass } from '@/lib/lead-status-styles'
import { cn } from '@/lib/utils'
import type { LeadStatus } from '@/types/lead'

interface ScoreBadgeProps {
  score: number
  status?: LeadStatus
  className?: string
}

export function ScoreBadge({ score, status, className }: ScoreBadgeProps) {
  const tier =
    status ?? (score >= 80 ? 'hot' : score >= 50 ? 'warm' : 'cold')

  return (
    <Badge
      variant="outline"
      className={cn(
        'min-w-10 justify-center font-mono text-xs font-semibold tabular-nums',
        leadStatusScoreClass[tier],
        className,
      )}
    >
      {score}
    </Badge>
  )
}
