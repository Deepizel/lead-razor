import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { useApproveWaitlistEntry } from '@/hooks/useWaitlist'
import type { WaitlistEntry } from '@/types/waitlist'

type ApproveWaitlistMutation = ReturnType<typeof useApproveWaitlistEntry>

interface WaitlistApproveDialogProps {
  entry: WaitlistEntry | null
  open: boolean
  onOpenChange: (open: boolean) => void
  approve: ApproveWaitlistMutation
}

function formatApplicantName(entry: WaitlistEntry) {
  const name = [entry.firstName, entry.lastName].filter(Boolean).join(' ').trim()
  return name || entry.email
}

export function WaitlistApproveDialog({
  entry,
  open,
  onOpenChange,
  approve,
}: WaitlistApproveDialogProps) {
  const handleApprove = async () => {
    if (!entry) return
    try {
      await approve.mutateAsync(entry.id)
      onOpenChange(false)
    } catch {
      /* toast handled in hook */
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Approve waitlist application?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-2 text-sm text-muted-foreground">
              {entry ? (
                <>
                  <p>
                    You are about to approve{' '}
                    <span className="font-medium text-foreground">
                      {formatApplicantName(entry)}
                    </span>{' '}
                    (<span className="text-foreground">{entry.email}</span>).
                  </p>
                  {entry.businessIndustry ? (
                    <p>
                      Industry:{' '}
                      <span className="text-foreground">{entry.businessIndustry}</span>
                    </p>
                  ) : null}
                </>
              ) : null}
              <p>
                This creates their account, marks the waitlist entry active, and sends a
                password-setup email (valid 24 hours).
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={approve.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={approve.isPending || !entry}
            onClick={(e) => {
              e.preventDefault()
              void handleApprove()
            }}
          >
            {approve.isPending ? 'Approving…' : 'Approve & send email'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
