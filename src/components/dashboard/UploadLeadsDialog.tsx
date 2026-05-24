import { Download01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useEffect, useRef, useState } from 'react'
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
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useCategories } from '@/hooks/useCategories'
import { useDownloadLeadTemplate, useLeadsApiMode, useUploadLeads } from '@/hooks/useLeads'
import { ApiError } from '@/lib/api-client'
import { notify } from '@/stores/toastStore'
import { cn } from '@/lib/utils'

interface UploadLeadsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ACCEPT = '.xlsx,.xls,.csv'

function resetFormState(
  setFile: (f: File | null) => void,
  setCategoryId: (id: string) => void,
  setError: (e: string | null) => void,
  setSuccess: (s: string | null) => void,
  inputRef: React.RefObject<HTMLInputElement | null>,
) {
  setFile(null)
  setCategoryId('')
  setError(null)
  setSuccess(null)
  if (inputRef.current) inputRef.current.value = ''
}

export function UploadLeadsDialog({ open, onOpenChange }: UploadLeadsDialogProps) {
  const apiMode = useLeadsApiMode()
  const upload = useUploadLeads()
  const downloadTemplate = useDownloadLeadTemplate()
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
    error: categoriesFetchError,
    refetch: refetchCategories,
  } = useCategories()

  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [categoryId, setCategoryId] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      void refetchCategories()
      setError(null)
      setSuccess(null)
    } else {
      resetFormState(setFile, setCategoryId, setError, setSuccess, inputRef)
    }
  }, [open, refetchCategories])

  const handleOpenChange = (next: boolean) => {
    if (!next && !upload.isPending) {
      resetFormState(setFile, setCategoryId, setError, setSuccess, inputRef)
    }
    onOpenChange(next)
  }

  const handleUpload = async () => {
    setError(null)
    setSuccess(null)

    if (!categoryId) {
      setError('Select an active category for this upload.')
      return
    }
    if (!file) {
      setError('Choose an Excel file (.xlsx, .xls, or .csv).')
      return
    }

    try {
      const result = await upload.mutateAsync({ file, categoryId })
      const uploadRef = result.uploadId ?? result.id
      const leadCount = result.leadsCreated ?? result.count
      const countNote =
        leadCount != null ? ` ${leadCount} lead(s) queued.` : ''
      const successMsg =
        result.message ??
        `Upload sent to the server.${countNote}${uploadRef ? ` Job id: ${uploadRef}` : ''}`
      setSuccess(successMsg)
      notify.success('Leads uploaded', successMsg)
      setFile(null)
      setCategoryId('')
      if (inputRef.current) inputRef.current.value = ''
      window.setTimeout(() => handleOpenChange(false), 1800)
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Upload failed'
      setError(message)
      if (!(err instanceof ApiError)) {
        notify.error(message)
      }
    }
  }

  const canSubmit =
    apiMode &&
    !upload.isPending &&
    Boolean(categoryId) &&
    Boolean(file) &&
    categories.length > 0

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload leads</DialogTitle>
          <DialogDescription>
            Choose a category and an Excel file. The file and category are sent to the
            server for ingest and scoring.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="rounded-lg border border-border/60 bg-muted/15 p-3">
            <p className="text-xs font-medium text-foreground">Need the template?</p>
            <p className="mt-1 text-[0.625rem] text-muted-foreground">
              Download the latest Excel template with the correct columns, fill it in, then
              upload below.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3 gap-1.5"
              disabled={!apiMode || downloadTemplate.isPending}
              onClick={() => void downloadTemplate.mutateAsync()}
            >
              <HugeiconsIcon icon={Download01Icon} strokeWidth={2} className="size-3.5" />
              {downloadTemplate.isPending ? 'Downloading…' : 'Download template (.xlsx)'}
            </Button>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="upload-category">
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
                <Link to="/dashboard/categories" className="text-primary underline-offset-4 hover:underline">
                  Create a category
                </Link>{' '}
                before uploading leads.
              </p>
            ) : (
              <Select
                value={categoryId || undefined}
                onValueChange={setCategoryId}
                disabled={upload.isPending}
              >
                <SelectTrigger id="upload-category" className="w-full min-w-0">
                  <SelectValue placeholder="Select active category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id} className="truncate">
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="upload-file">
              Excel file <span className="text-destructive">*</span>
            </Label>
            <div
              className={cn(
                'flex flex-col gap-2 rounded-lg border border-dashed border-border/80 bg-muted/20 p-4',
                file && 'border-primary/40 bg-primary/5',
              )}
            >
              <input
                ref={inputRef}
                id="upload-file"
                type="file"
                accept={ACCEPT}
                className="sr-only"
                disabled={!apiMode || upload.isPending}
                onChange={(e) => {
                  setFile(e.target.files?.[0] ?? null)
                  setError(null)
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-fit"
                disabled={!apiMode || upload.isPending}
                onClick={() => inputRef.current?.click()}
              >
                {file ? 'Change file' : 'Choose file'}
              </Button>
              {file ? (
                <p className="text-xs text-foreground">
                  <span className="font-medium">{file.name}</span>
                  <span className="text-muted-foreground">
                    {' '}
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Supported: .xlsx, .xls, .csv
                </p>
              )}
            </div>
          </div>

          {!apiMode && (
            <p className="text-xs text-destructive">
              Set <code className="rounded bg-muted px-1">VITE_API_BASE_URL</code> in `.env`
              to upload to the database.
            </p>
          )}

          {error && (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
              {success}
            </p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={upload.isPending}
          >
            Cancel
          </Button>
          <Button onClick={() => void handleUpload()} disabled={!canSubmit}>
            {upload.isPending ? 'Uploading…' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
