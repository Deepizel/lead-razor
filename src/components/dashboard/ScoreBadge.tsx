import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { LeadStatus } from '@/types/lead'

interface ScoreBadgeProps {
  score: number
  status?: LeadStatus
  className?: string
}

const statusStyles: Record<LeadStatus, string> = {
  hot: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
  warm: 'border-amber-500/40 bg-amber-500/15 text-amber-400',
  cold: 'border-zinc-500/40 bg-zinc-500/15 text-zinc-400',
}

export function ScoreBadge({ score, status, className }: ScoreBadgeProps) {
  const tier =
    status ?? (score >= 80 ? 'hot' : score >= 50 ? 'warm' : 'cold')

  return (
    <Badge
      variant="outline"
      className={cn(
        'min-w-10 justify-center font-mono text-xs font-semibold tabular-nums',
        statusStyles[tier],
        className,
      )}
    >
      {score}
    </Badge>
  )
}
