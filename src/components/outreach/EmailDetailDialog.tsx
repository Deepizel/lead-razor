import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { useEmailDetail } from '@/hooks/useEmails'
import { formatTrackingYesNo } from '@/lib/map-email'
import { formatDate } from '@/lib/lead-utils'
import { Link } from 'react-router-dom'
import { DASHBOARD_BASE } from '@/constants/routes'

interface EmailDetailDialogProps {
  emailId: string | null
  onOpenChange: (open: boolean) => void
}

export function EmailDetailDialog({ emailId, onOpenChange }: EmailDetailDialogProps) {
  const { data, isLoading, isError, error } = useEmailDetail(emailId ?? undefined)

  return (
    <Dialog open={Boolean(emailId)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Email tracking</DialogTitle>
          <DialogDescription>
            Delivery and engagement for this outreach message
          </DialogDescription>
        </DialogHeader>

        {isLoading && <Skeleton className="h-40 w-full" />}
        {isError && (
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : 'Failed to load email detail.'}
          </p>
        )}
        {data && (
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Lead</p>
              <Link
                to={`${DASHBOARD_BASE}/leads/${data.leadId}`}
                className="font-medium text-primary underline-offset-4 hover:underline"
                onClick={() => onOpenChange(false)}
              >
                {data.leadName}
              </Link>
              {data.to && (
                <p className="text-xs text-muted-foreground">{data.to}</p>
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Subject</p>
              <p className="font-medium">{data.subject}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Sent</p>
              <p>{formatDate(data.sentAt)}</p>
            </div>
            <dl className="grid grid-cols-1 gap-2 rounded-lg border border-border/60 bg-muted/20 p-3 text-xs sm:grid-cols-3">
              <div>
                <dt className="text-muted-foreground">Opened</dt>
                <dd className="font-medium">
                  {formatTrackingYesNo(data.opened, data.openedAt)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Clicked</dt>
                <dd className="font-medium">
                  {formatTrackingYesNo(data.clicked, data.clickedAt)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Replied</dt>
                <dd className="font-medium">
                  {formatTrackingYesNo(data.replied, data.repliedAt)}
                </dd>
              </div>
            </dl>
            {data.body && (
              <div>
                <p className="mb-1 text-xs text-muted-foreground">Body</p>
                <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-md border border-border/60 bg-muted/30 p-3 text-xs">
                  {data.body}
                </pre>
              </div>
            )}
            {data.clicks && data.clicks.length > 0 && (
              <div>
                <p className="mb-1 text-xs text-muted-foreground">Clicks</p>
                <ul className="space-y-1 text-xs">
                  {data.clicks.map((c) => (
                    <li key={c.linkIndex}>
                      Link {c.linkIndex + 1}
                      {c.url ? `: ${c.url}` : ''} · {formatDate(c.clickedAt)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
