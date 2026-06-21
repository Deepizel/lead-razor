import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CategorySelect } from '@/components/dashboard/CategorySelect'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import {
  emptyLeadManualForm,
  LEAD_TEMPLATE_COLUMNS,
  type LeadManualFormValues,
} from '@/constants/lead-form'
import { useCategories } from '@/hooks/useCategories'
import { useCreateLead, useLeadsApiMode } from '@/hooks/useLeads'
import { ApiError } from '@/lib/api-client'
import { notify } from '@/stores/toastStore'

interface CreateLeadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function validateForm(form: LeadManualFormValues): string | null {
  if (!form.categoryId) return 'Select a category.'
  if (!form.firstName.trim()) return 'First name is required.'
  if (!form.email.trim()) return 'Email is required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    return 'Enter a valid email address.'
  }
  return null
}

export function CreateLeadDialog({ open, onOpenChange }: CreateLeadDialogProps) {
  const apiMode = useLeadsApiMode()
  const create = useCreateLead()
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
    error: categoriesFetchError,
    refetch: refetchCategories,
  } = useCategories()

  const [form, setForm] = useState<LeadManualFormValues>(emptyLeadManualForm)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      void refetchCategories()
      setForm(emptyLeadManualForm)
      setError(null)
    }
  }, [open, refetchCategories])

  const setField = <K extends keyof LeadManualFormValues>(
    key: K,
    value: LeadManualFormValues[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const validationError = validateForm(form)
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      await create.mutateAsync({
        categoryId: form.categoryId,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim() || undefined,
        email: form.email.trim(),
        company: form.company.trim() || undefined,
        jobTitle: form.jobTitle.trim() || undefined,
        phone: form.phone.trim() || undefined,
        source: form.source.trim() || undefined,
        initialMessage: form.initialMessage.trim() || undefined,
      })
      onOpenChange(false)
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Could not create lead'
      setError(message)
      if (!(err instanceof ApiError)) {
        notify.error(message)
      }
    }
  }

  const canSubmit =
    apiMode &&
    !create.isPending &&
    categories.length > 0 &&
    Boolean(form.categoryId) &&
    Boolean(form.firstName.trim()) &&
    Boolean(form.email.trim())

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add lead details</DialogTitle>
          <DialogDescription>
            Enter the same fields as the upload spreadsheet — one lead at a time.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={(e) => void handleSubmit(e)} className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="create-lead-category">
              Category <span className="text-destructive">*</span>
            </Label>
            {categoriesLoading ? (
              <Skeleton className="h-9 w-full" />
            ) : categoriesError ? (
              <p className="text-xs text-destructive">
                {categoriesFetchError instanceof Error
                  ? categoriesFetchError.message
                  : 'Could not load categories.'}
              </p>
            ) : categories.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No categories yet.{' '}
                <Link
                  to="/dashboard/categories"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Create a category
                </Link>{' '}
                first.
              </p>
            ) : (
              <CategorySelect
                value={form.categoryId || undefined}
                onValueChange={(v) => setField('categoryId', v)}
                disabled={create.isPending}
              />
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {LEAD_TEMPLATE_COLUMNS.map((col) => {
              const id = `create-lead-${col.key}`
              const value = form[col.key as keyof LeadManualFormValues]
              const isRequired = col.required

              if ('multiline' in col && col.multiline) {
                return (
                  <div key={col.key} className="grid gap-1.5 sm:col-span-2">
                    <Label htmlFor={id}>
                      {col.label}
                      {isRequired && <span className="text-destructive"> *</span>}
                    </Label>
                    <Textarea
                      id={id}
                      className="min-h-[88px] resize-y"
                      value={String(value)}
                      disabled={create.isPending}
                      onChange={(e) =>
                        setField(col.key as keyof LeadManualFormValues, e.target.value)
                      }
                    />
                  </div>
                )
              }

              return (
                <div key={col.key} className="grid gap-1.5">
                  <Label htmlFor={id}>
                    {col.label}
                    {isRequired && <span className="text-destructive"> *</span>}
                  </Label>
                  <Input
                    id={id}
                    type={col.key === 'email' ? 'email' : col.key === 'phone' ? 'tel' : 'text'}
                    value={String(value)}
                    disabled={create.isPending}
                    onChange={(e) =>
                      setField(col.key as keyof LeadManualFormValues, e.target.value)
                    }
                  />
                </div>
              )
            })}
          </div>

          {!apiMode && (
            <p className="text-xs text-destructive">
              Set <code className="rounded bg-muted px-1">VITE_API_BASE_URL</code> to create
              leads via the API.
            </p>
          )}

          {error && (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </p>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={create.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              {create.isPending ? 'Saving…' : 'Add lead'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
