import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useCategories } from '@/hooks/useCategories'
import {
  useDraftEmail,
  useRecipientsPreviewQuery,
  useSendEmail,
} from '@/hooks/useEmails'
import { useEmailIdentities } from '@/hooks/useSettings'
import { useLeads } from '@/hooks/useLeads'
import { notify } from '@/stores/toastStore'
import type { ApiLeadTier } from '@/types/api-lead'
type ComposeMode = 'single' | 'bulk'

const tierOptions: { label: string; value: ApiLeadTier | 'all' }[] = [
  { label: 'All tiers', value: 'all' },
  { label: 'Hot', value: 'hot' },
  { label: 'Warm', value: 'warm' },
  { label: 'Cold', value: 'cold' },
]

export function ComposeSendTab() {
  const [mode, setMode] = useState<ComposeMode>('single')
  const [leadId, setLeadId] = useState('')
  const [tier, setTier] = useState<ApiLeadTier | 'all'>('all')
  const [categoryId, setCategoryId] = useState<string>('all')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [useSnapshot, setUseSnapshot] = useState(true)
  const [emailIdentityId, setEmailIdentityId] = useState<string>('')

  const { data: leads = [] } = useLeads()
  const { data: categories = [] } = useCategories()
  const { data: identities = [] } = useEmailIdentities()
  const draft = useDraftEmail()
  const send = useSendEmail()

  const previewParams = useMemo(
    () =>
      mode === 'bulk'
        ? {
            tier: tier === 'all' ? undefined : tier,
            categoryId: categoryId === 'all' ? undefined : categoryId,
          }
        : null,
    [mode, tier, categoryId],
  )
  const preview = useRecipientsPreviewQuery(previewParams, mode === 'bulk')

  const recipientCount = preview.data?.count ?? 0
  const bulkLeadIds = preview.data?.leads.map((l) => l.id) ?? []
  const defaultIdentityId = identities.find((i) => i.isDefault)?.id

  useEffect(() => {
    if (!defaultIdentityId) return
    setEmailIdentityId((current) => (current ? current : defaultIdentityId))
  }, [defaultIdentityId])

  const handleDraft = async () => {
    if (!leadId) {
      notify.error('Select a lead to draft from snapshot.')
      return
    }
    try {
      const result = await draft.mutateAsync({ leadId })
      setSubject(result.subject)
      setBody(result.body)
      setUseSnapshot(false)
      notify.success('Draft ready', 'Subject and body loaded from snapshot.')
    } catch {
      /* toast from api client */
    }
  }

  const handleSend = async () => {
    try {
      if (mode === 'single') {
        if (!leadId) {
          notify.error('Select a lead.')
          return
        }
        if (!useSnapshot && (!subject.trim() || !body.trim())) {
          notify.error('Subject and body are required when not using snapshot.')
          return
        }
        await send.mutateAsync(
          useSnapshot
            ? { leadId, useSnapshot: true, emailIdentityId }
            : { leadId, subject: subject.trim(), body: body.trim(), emailIdentityId },
        )
      } else {
        if (!subject.trim() || !body.trim()) {
          notify.error('Subject and body are required for bulk send.')
          return
        }
        if (bulkLeadIds.length === 0) {
          notify.error('No recipients match your filters.')
          return
        }
        await send.mutateAsync({
          leadIds: bulkLeadIds,
          subject: subject.trim(),
          body: body.trim(),
          emailIdentityId,
        })
      }
      setSubject('')
      setBody('')
    } catch {
      /* handled */
    }
  }

  const sending = send.isPending

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,280px)_1fr]">
      <div className="space-y-4 rounded-lg border border-border/60 bg-muted/10 p-4">
        <div className="space-y-2">
          <Label>Send mode</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant={mode === 'single' ? 'default' : 'outline'}
              onClick={() => setMode('single')}
            >
              One lead
            </Button>
            <Button
              type="button"
              size="sm"
              variant={mode === 'bulk' ? 'default' : 'outline'}
              onClick={() => setMode('bulk')}
            >
              Group
            </Button>
          </div>
        </div>

        {mode === 'single' ? (
          <div className="space-y-1.5">
            <Label htmlFor="compose-lead">Lead</Label>
            <Select value={leadId || undefined} onValueChange={setLeadId}>
              <SelectTrigger id="compose-lead" className="w-full">
                <SelectValue placeholder="Select lead" />
              </SelectTrigger>
              <SelectContent>
                {leads.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    <span className="truncate">
                      {l.name} · {l.company}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              disabled={!leadId || draft.isPending}
              onClick={() => void handleDraft()}
            >
              {draft.isPending ? 'Drafting…' : 'Draft from snapshot (AI)'}
            </Button>
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={useSnapshot}
                onChange={(e) => setUseSnapshot(e.target.checked)}
                className="rounded border-border"
              />
              Send snapshot as-is (no subject/body edits)
            </label>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="compose-tier">Tier filter</Label>
              <Select
                value={tier}
                onValueChange={(v) => setTier(v as ApiLeadTier | 'all')}
              >
                <SelectTrigger id="compose-tier">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tierOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="compose-category">Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger id="compose-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              {preview.isLoading
                ? 'Loading recipients…'
                : `${recipientCount} lead${recipientCount === 1 ? '' : 's'} will receive this email`}
            </p>
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="compose-identity">Sender identity</Label>
          <Select value={emailIdentityId} onValueChange={setEmailIdentityId}>
            <SelectTrigger id="compose-identity">
              <SelectValue placeholder="Default sender" />
            </SelectTrigger>
            <SelectContent>
              {identities.map((identity) => (
                <SelectItem key={identity.id} value={identity.id}>
                  {identity.label} {identity.isDefault ? '• default' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {identities.length === 0 && (
            <p className="text-xs text-destructive">
              No sender identity configured. Add one in Settings → Email identities.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="compose-subject">Subject</Label>
          <Input
            id="compose-subject"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value)
              setUseSnapshot(false)
            }}
            disabled={mode === 'single' && useSnapshot}
            placeholder={
              mode === 'single' && useSnapshot
                ? 'Uses snapshot subject when sent'
                : 'Email subject'
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="compose-body">Body</Label>
          <Textarea
            id="compose-body"
            className="min-h-[220px] resize-y"
            value={body}
            onChange={(e) => {
              setBody(e.target.value)
              setUseSnapshot(false)
            }}
            disabled={mode === 'single' && useSnapshot}
            placeholder={
              mode === 'single' && useSnapshot
                ? 'Uses snapshot body when sent'
                : 'Write or paste your message…'
            }
          />
        </div>
        <Button
          type="button"
          disabled={
            sending ||
            (mode === 'single' && !leadId) ||
            (mode === 'bulk' && recipientCount === 0)
          }
          onClick={() => void handleSend()}
        >
          {sending
            ? 'Sending…'
            : mode === 'bulk'
              ? `Send to ${recipientCount} leads`
              : 'Send email'}
        </Button>
        <p className="text-[0.625rem] text-muted-foreground">
          Single send with snapshot uses{' '}
          <code className="rounded bg-muted px-1">POST /api/leads/:id/email/send</code>{' '}
          with <code className="rounded bg-muted px-1">useSnapshot: true</code>. Custom or
          bulk sends use <code className="rounded bg-muted px-1">POST /api/emails/send</code>.
        </p>
      </div>
    </div>
  )
}
