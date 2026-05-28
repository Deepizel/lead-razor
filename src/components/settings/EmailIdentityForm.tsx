import { useState } from 'react'
import { MaskedSecretField } from '@/components/settings/MaskedSecretField'
import { ApiStatusBanner } from '@/components/layout/ApiStatusBanner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useCreateEmailIdentity,
  useDeleteEmailIdentity,
  useEmailIdentities,
  useSetDefaultEmailIdentity,
  useSettingsApiMode,
  useTestEmailIdentity,
  useUpdateEmailIdentity,
} from '@/hooks/useSettings'
import { ApiError } from '@/lib/api-client'
import { buildSavePayload, toFormState, type EmailIdentityFormState } from '@/lib/map-email-identity'
import { EMAIL_IDENTITY_PROVIDER_OPTIONS, type EmailIdentity } from '@/types/api-settings'

const emptyForm: EmailIdentityFormState = toFormState()

export function EmailIdentityForm() {
  const apiMode = useSettingsApiMode()
  const { data: identities = [], isLoading, isError, error, refetch } = useEmailIdentities()
  const createMutation = useCreateEmailIdentity()
  const updateMutation = useUpdateEmailIdentity()
  const deleteMutation = useDeleteEmailIdentity()
  const defaultMutation = useSetDefaultEmailIdentity()
  const testMutation = useTestEmailIdentity()

  const [editingIdentity, setEditingIdentity] = useState<EmailIdentity | null>(null)
  const [form, setForm] = useState<EmailIdentityFormState>(emptyForm)
  const [changeSmtpPass, setChangeSmtpPass] = useState(false)
  const [changeApiKey, setChangeApiKey] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const pending =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    defaultMutation.isPending ||
    testMutation.isPending

  const isSmtpProvider = form.providerType === 'gmail' || form.providerType === 'smtp'
  const credentialsConfigured = editingIdentity?.credentialsConfigured ?? false

  const updateForm = (patch: Partial<EmailIdentityFormState>) => {
    setForm((prev) => ({ ...prev, ...patch }))
    setSaveError(null)
  }

  const openCreate = () => {
    setEditingIdentity(null)
    setForm(emptyForm)
    setChangeSmtpPass(false)
    setChangeApiKey(false)
    setSaveError(null)
  }

  const openEdit = (identity: EmailIdentity) => {
    setEditingIdentity(identity)
    setForm(toFormState(identity))
    setChangeSmtpPass(false)
    setChangeApiKey(false)
    setSaveError(null)
  }

  const validate = (): string | null => {
    if (!form.label.trim()) return 'Label is required.'
    if (!form.fromName.trim()) return 'From name is required.'
    if (!form.fromEmail.trim()) return 'From email is required.'

    if (isSmtpProvider) {
      if (!form.smtpHost.trim()) return 'SMTP host is required.'
      if (!form.smtpPort.trim() || Number.isNaN(Number(form.smtpPort))) return 'SMTP port must be numeric.'
      if (!form.smtpUser.trim()) return 'SMTP user is required.'
      const needsPass = !editingIdentity || !credentialsConfigured || changeSmtpPass
      if (needsPass && !form.smtpPass.trim()) return 'SMTP password is required.'
    } else {
      const needsKey = !editingIdentity || !credentialsConfigured || changeApiKey
      if (needsKey && !form.apiKey.trim()) return 'API key is required.'
    }
    return null
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setSaveError(validationError)
      return
    }

    try {
      const includeSecrets = !editingIdentity || changeSmtpPass || changeApiKey
      const payload = buildSavePayload(form, includeSecrets)
      const saved = editingIdentity
        ? await updateMutation.mutateAsync({ id: editingIdentity.id, payload })
        : await createMutation.mutateAsync(payload)
      setEditingIdentity(saved)
      setForm(toFormState(saved))
      setChangeSmtpPass(false)
      setChangeApiKey(false)
      setSaveError(null)
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : 'Failed to save identity')
    }
  }

  const handleDelete = async (identity: EmailIdentity) => {
    if (!window.confirm(`Delete identity "${identity.label}"?`)) return
    await deleteMutation.mutateAsync(identity.id)
    if (editingIdentity?.id === identity.id) openCreate()
  }

  if (!apiMode) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Email identities</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Set <code className="rounded bg-muted px-1">VITE_API_BASE_URL</code> to manage sender profiles.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Email identities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-destructive">
            {error instanceof ApiError ? error.message : 'Failed to load identities.'}
          </p>
          <Button variant="outline" size="sm" onClick={() => void refetch()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Email identities</CardTitle>
          <CardDescription>Configure per-user sending profiles and choose a default sender.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ApiStatusBanner />
          {identities.length === 0 ? (
            <p className="text-sm text-muted-foreground">No identities yet. Add one below.</p>
          ) : (
            <div className="grid gap-3">
              {identities.map((identity) => (
                <div key={identity.id} className="rounded-md border border-border/70 bg-muted/10 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{identity.label}</span>
                      <Badge variant="outline">{identity.providerType}</Badge>
                      {identity.isDefault && <Badge>Default</Badge>}
                    </div>
                    <div className="flex gap-2">
                      {!identity.isDefault && (
                        <Button size="sm" variant="outline" onClick={() => void defaultMutation.mutateAsync(identity.id)}>
                          Set default
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => openEdit(identity)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => void testMutation.mutateAsync({ id: identity.id })}>
                        Test
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => void handleDelete(identity)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {identity.fromName} &lt;{identity.fromEmail}&gt;
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{editingIdentity ? 'Edit identity' : 'Add identity'}</CardTitle>
          <CardDescription>Credentials remain masked unless you choose to change them.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => void handleSave(e)} className="space-y-4 sm:max-w-md">
            <div className="grid gap-1.5">
              <Label htmlFor="identity-label">Label</Label>
              <Input id="identity-label" value={form.label} onChange={(e) => updateForm({ label: e.target.value })} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="provider-type">Provider</Label>
              <Select value={form.providerType} onValueChange={(v) => updateForm({ providerType: v as EmailIdentityFormState['providerType'] })}>
                <SelectTrigger id="provider-type"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {EMAIL_IDENTITY_PROVIDER_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="from-name">From name</Label>
              <Input id="from-name" value={form.fromName} onChange={(e) => updateForm({ fromName: e.target.value })} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="from-email">From email</Label>
              <Input id="from-email" type="email" value={form.fromEmail} onChange={(e) => updateForm({ fromEmail: e.target.value })} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="reply-to">Reply-to</Label>
              <Input id="reply-to" type="email" value={form.replyTo} onChange={(e) => updateForm({ replyTo: e.target.value })} />
            </div>

            {isSmtpProvider ? (
              <>
                <div className="grid gap-1.5">
                  <Label htmlFor="smtp-host">SMTP host</Label>
                  <Input id="smtp-host" value={form.smtpHost} onChange={(e) => updateForm({ smtpHost: e.target.value })} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="smtp-port">SMTP port</Label>
                  <Input id="smtp-port" type="number" value={form.smtpPort} onChange={(e) => updateForm({ smtpPort: e.target.value })} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="smtp-user">SMTP user</Label>
                  <Input id="smtp-user" value={form.smtpUser} onChange={(e) => updateForm({ smtpUser: e.target.value })} />
                </div>
                <MaskedSecretField
                  id="smtp-pass"
                  label="SMTP password"
                  configured={credentialsConfigured}
                  changing={changeSmtpPass}
                  onStartChange={() => setChangeSmtpPass(true)}
                  onCancelChange={() => {
                    setChangeSmtpPass(false)
                    updateForm({ smtpPass: '' })
                  }}
                  value={form.smtpPass}
                  onChange={(smtpPass) => updateForm({ smtpPass })}
                />
              </>
            ) : (
              <MaskedSecretField
                id="api-key"
                label="API key"
                configured={credentialsConfigured}
                changing={changeApiKey}
                onStartChange={() => setChangeApiKey(true)}
                onCancelChange={() => {
                  setChangeApiKey(false)
                  updateForm({ apiKey: '' })
                }}
                value={form.apiKey}
                onChange={(apiKey) => updateForm({ apiKey })}
              />
            )}

            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={form.trackingEnabled}
                onChange={(e) => updateForm({ trackingEnabled: e.target.checked })}
              />
              Tracking enabled
            </label>
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={form.domainVerified}
                onChange={(e) => updateForm({ domainVerified: e.target.checked })}
              />
              Domain verified
            </label>
            <div className="grid gap-1.5">
              <Label htmlFor="reply-mode">Reply handling mode</Label>
              <Select
                value={form.replyHandlingMode}
                onValueChange={(v) => updateForm({ replyHandlingMode: v as EmailIdentityFormState['replyHandlingMode'] })}
              >
                <SelectTrigger id="reply-mode"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="webhook">Webhook</SelectItem>
                  <SelectItem value="gmail">Gmail</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {saveError && (
              <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {saveError}
              </p>
            )}
            <div className="flex gap-2">
              <Button type="submit" disabled={pending}>
                {editingIdentity ? 'Update identity' : 'Save identity'}
              </Button>
              <Button type="button" variant="outline" onClick={openCreate}>
                New identity
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
