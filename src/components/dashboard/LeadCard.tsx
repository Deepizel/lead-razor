import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScoreBadge } from '@/components/dashboard/ScoreBadge'
import { StatusChip } from '@/components/dashboard/StatusChip'
import { formatDate } from '@/lib/lead-utils'
import type { Lead } from '@/types/lead'

interface LeadCardProps {
  lead: Lead
  onRescore?: (id: string) => void
}

export function LeadCard({ lead, onRescore }: LeadCardProps) {
  return (
    <Card className="transition-colors hover:bg-muted/30">
      <CardHeader className="flex-row items-start justify-between gap-2 space-y-0 pb-2">
        <div className="min-w-0 flex-1">
          <CardTitle className="truncate text-sm">{lead.name}</CardTitle>
          <p className="truncate text-xs text-muted-foreground">
            {lead.role} · {lead.company}
          </p>
          <p className="mt-1 truncate text-[0.625rem] text-muted-foreground">
            {lead.email}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <ScoreBadge score={lead.score} status={lead.status} />
          <StatusChip status={lead.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {lead.reasoning[0]}
        </p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[0.625rem] text-muted-foreground">
          <span>{lead.source}</span>
          <span className="text-border">·</span>
          <span className="truncate">{lead.lastAction}</span>
          <span className="text-border">·</span>
          <span>{formatDate(lead.createdAt)}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="default" size="sm" className="flex-1 sm:flex-none" asChild>
            <Link to={`/dashboard/leads/${lead.id}`}>View</Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none"
            onClick={() => onRescore?.(lead.id)}
          >
            Re-score
          </Button>
          <Button variant="secondary" size="sm" className="flex-1 sm:flex-none">
            Email
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
