import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { hasApiBaseUrl } from '@/lib/api-client'
import { cn } from '@/lib/utils'
import type { Lead } from '@/types/lead'

export interface SendEmailPayload {
  useSnapshot?: boolean
  subject?: string
  body?: string
}

interface ActionButtonGroupProps {
  lead: Lead
  onSendEmail?: (payload: SendEmailPayload) => void
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
  const apiMode = hasApiBaseUrl()
  const useApiEmail = apiMode && Boolean(lead.emailSubject || lead.hasSnapshot)
  const [subject, setSubject] = useState(lead.emailSubject ?? '')
  const [body, setBody] = useState(lead.emailBody ?? lead.draftEmail)
  const [legacyDraft, setLegacyDraft] = useState(lead.draftEmail)
  const [useSnapshot, setUseSnapshot] = useState(true)

  useEffect(() => {
    setSubject(lead.emailSubject ?? '')
    setBody(lead.emailBody ?? lead.draftEmail)
    setLegacyDraft(lead.draftEmail)
  }, [lead.id, lead.emailSubject, lead.emailBody, lead.draftEmail])

  const noSnapshot = apiMode && !lead.hasSnapshot

  const handleSend = () => {
    if (useApiEmail && useSnapshot) {
      onSendEmail?.({ useSnapshot: true })
      return
    }
    onSendEmail?.({
      useSnapshot: false,
      subject: useApiEmail ? subject : undefined,
      body: useApiEmail ? body : legacyDraft,
    })
  }

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
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={useSnapshot}
                onChange={(e) => setUseSnapshot(e.target.checked)}
                className="rounded border-border"
              />
              Send snapshot as-is
            </label>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email-subject">Subject</Label>
              <Input
                id="email-subject"
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value)
                  setUseSnapshot(false)
                }}
                readOnly={useSnapshot}
                className={useSnapshot ? 'bg-muted/30' : undefined}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email-body">Body</Label>
              <Textarea
                id="email-body"
                className={cn(
                  'min-h-[180px] resize-y',
                  useSnapshot && 'bg-muted/30',
                )}
                value={body}
                onChange={(e) => {
                  setBody(e.target.value)
                  setUseSnapshot(false)
                }}
                readOnly={useSnapshot}
              />
            </div>
            {lead.emailSentAt && (
              <p className="text-[0.625rem] text-muted-foreground">
                Last snapshot send {new Date(lead.emailSentAt).toLocaleString()}
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
          disabled={sendDisabled || isSending || noSnapshot}
          onClick={handleSend}
        >
          {isSending ? 'Sending…' : 'Send email'}
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
