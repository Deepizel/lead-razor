import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { LeadStatus } from '@/types/lead'

const labels: Record<LeadStatus, string> = {
  hot: 'Hot',
  warm: 'Warm',
  cold: 'Cold',
}

const styles: Record<LeadStatus, string> = {
  hot: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/10',
  warm: 'border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/10',
  cold: 'border-zinc-500/40 bg-zinc-500/10 text-zinc-400 hover:bg-zinc-500/10',
}

export function StatusChip({
  status,
  className,
}: {
  status: LeadStatus
  className?: string
}) {
  return (
    <Badge variant="outline" className={cn(styles[status], className)}>
      {labels[status]}
    </Badge>
  )
}
