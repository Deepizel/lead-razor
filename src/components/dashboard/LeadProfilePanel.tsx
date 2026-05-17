import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ScoreBadge } from '@/components/dashboard/ScoreBadge'
import { StatusChip } from '@/components/dashboard/StatusChip'
import { formatDate } from '@/lib/lead-utils'
import type { Lead } from '@/types/lead'

export function LeadProfilePanel({ lead }: { lead: Lead }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{lead.name}</CardTitle>
        <p className="text-xs text-muted-foreground">{lead.role}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <ScoreBadge score={lead.score} status={lead.status} />
          <StatusChip status={lead.status} />
        </div>
        <Separator />
        <dl className="space-y-3 text-xs">
          <div>
            <dt className="text-muted-foreground">Company</dt>
            <dd className="mt-0.5 font-medium">{lead.company}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd className="mt-0.5 font-medium">{lead.email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Source</dt>
            <dd className="mt-0.5 font-medium">{lead.source}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Last action</dt>
            <dd className="mt-0.5 font-medium">{lead.lastAction}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Created</dt>
            <dd className="mt-0.5 font-medium">{formatDate(lead.createdAt)}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
