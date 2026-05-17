import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { hasApiBaseUrl } from '@/lib/api-client'
import type { Lead } from '@/types/lead'

interface ActionButtonGroupProps {
  lead: Lead
  onSendEmail?: () => void
  isSending?: boolean
  sendDisabled?: boolean
  sendHint?: string
}

export function ActionButtonGroup({
  lead,
  onSendEmail,
  isSending = false,
  sendDisabled = false,
  sendHint,
}: ActionButtonGroupProps) {
  const useApiEmail = hasApiBaseUrl() && Boolean(lead.emailSubject)
  const [subject, setSubject] = useState(lead.emailSubject ?? '')
  const [body, setBody] = useState(lead.emailBody ?? lead.draftEmail)
  const [legacyDraft, setLegacyDraft] = useState(lead.draftEmail)

  useEffect(() => {
    setSubject(lead.emailSubject ?? '')
    setBody(lead.emailBody ?? lead.draftEmail)
    setLegacyDraft(lead.draftEmail)
  }, [lead.id, lead.emailSubject, lead.emailBody, lead.draftEmail])

  const apiMode = hasApiBaseUrl()
  const noSnapshot = apiMode && !lead.hasSnapshot
  const alreadySent = Boolean(lead.emailSentAt)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Actions</CardTitle>
        <p className="text-xs text-muted-foreground">
          {apiMode
            ? 'Email is sent from the server snapshot via Resend'
            : 'AI-drafted — edit before sending'}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {useApiEmail ? (
          <>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email-subject">Subject</Label>
              <Input
                id="email-subject"
                value={subject}
                readOnly
                className="bg-muted/30"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email-body">Body</Label>
              <Textarea
                id="email-body"
                className="min-h-[180px] resize-y bg-muted/30"
                value={body}
                readOnly
              />
            </div>
            {lead.emailSentAt && (
              <p className="text-[0.625rem] text-muted-foreground">
                Sent {new Date(lead.emailSentAt).toLocaleString()}
              </p>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="draft-email">Draft email</Label>
            <Textarea
              id="draft-email"
              className="min-h-[180px] resize-y"
              value={legacyDraft}
              onChange={(e) => setLegacyDraft(e.target.value)}
            />
          </div>
        )}

        {sendHint && (
          <p className="text-[0.625rem] text-muted-foreground">{sendHint}</p>
        )}

        <Button
          className="w-full"
          disabled={sendDisabled || isSending || noSnapshot || alreadySent}
          onClick={onSendEmail}
        >
          {isSending ? 'Sending…' : alreadySent ? 'Email sent' : 'Send email'}
        </Button>
        <Button variant="outline" className="w-full" disabled={apiMode}>
          Generate follow-up
        </Button>
        <Button variant="secondary" className="w-full" disabled>
          Push to CRM
        </Button>
        <Button variant="ghost" className="w-full" disabled>
          Schedule meeting
        </Button>
      </CardContent>
    </Card>
  )
}
