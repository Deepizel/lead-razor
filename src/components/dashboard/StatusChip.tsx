import { Badge } from '@/components/ui/badge'
import { LEAD_STATUS_LABELS, leadStatusChipClass } from '@/lib/lead-status-styles'
import { cn } from '@/lib/utils'
import type { LeadStatus } from '@/types/lead'

export function StatusChip({
  status,
  className,
}: {
  status: LeadStatus
  className?: string
}) {
  return (
    <Badge variant="outline" className={cn(leadStatusChipClass[status], className)}>
      {LEAD_STATUS_LABELS[status]}
    </Badge>
  )
}
