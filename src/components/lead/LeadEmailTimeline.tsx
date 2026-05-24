import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { OUTREACH_PATH } from '@/constants/routes'
import { useLeadEmailTimeline } from '@/hooks/useEmails'
import { formatDate } from '@/lib/lead-utils'
import { cn } from '@/lib/utils'
import type { LeadEmailTimelineItem } from '@/types/api-email'

const eventStyles: Record<string, string> = {
  email_sent: 'border-violet-500/40 bg-violet-500/10 text-violet-300',
  email_opened: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300',
  link_clicked: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  email_replied: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
}

function EventDot({ type }: { type: string }) {
  return (
    <span
      className={cn(
        'mt-1.5 size-2 shrink-0 rounded-full border',
        eventStyles[type] ?? 'border-border bg-muted',
      )}
    />
  )
}

function TimelineEntry({ item }: { item: LeadEmailTimelineItem }) {
  return (
    <li className="relative flex gap-3 pb-6 last:pb-0">
      <div className="flex flex-col items-center">
        <EventDot type={item.type} />
        <span className="w-px flex-1 bg-border/60" aria-hidden />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm font-medium">{item.label}</p>
          <time className="text-[0.625rem] text-muted-foreground">
            {new Intl.DateTimeFormat('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            }).format(new Date(item.occurredAt))}
          </time>
        </div>
        {item.subject && (
          <p className="text-xs text-muted-foreground">Subject: {item.subject}</p>
        )}
        {item.bodyPreview && (
          <p className="line-clamp-2 text-xs text-muted-foreground">{item.bodyPreview}</p>
        )}
      </div>
    </li>
  )
}

interface LeadEmailTimelineProps {
  leadId: string
}

export function LeadEmailTimeline({ leadId }: LeadEmailTimelineProps) {
  const { data, isLoading, isError, error } = useLeadEmailTimeline(leadId)

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
        <div>
          <CardTitle>Email history</CardTitle>
          <p className="text-xs text-muted-foreground">
            Sends, opens, clicks, and replies for this lead
          </p>
        </div>
        <Link
          to={OUTREACH_PATH}
          className="text-xs text-primary underline-offset-4 hover:underline"
        >
          Open outreach hub →
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        )}
        {isError && (
          <p className="text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : 'Could not load email timeline.'}
          </p>
        )}
        {!isLoading && !isError && data && data.events.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No emails sent to this lead yet. Compose from the{' '}
            <Link to={OUTREACH_PATH} className="text-primary underline-offset-4 hover:underline">
              outreach hub
            </Link>{' '}
            or send from the actions panel above.
          </p>
        )}
        {!isLoading && !isError && data && data.events.length > 0 && (
          <ol className="list-none">
            {data.events.map((item) => (
              <TimelineEntry key={item.id} item={item} />
            ))}
          </ol>
        )}
        {data?.emails && data.emails.length > 0 && (
          <p className="mt-4 text-[0.625rem] text-muted-foreground">
            {data.emails.length} sent message{data.emails.length === 1 ? '' : 's'} · last{' '}
            {formatDate(data.emails[0].sentAt)}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
