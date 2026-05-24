import { useEffect, useState } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useCategories } from '@/hooks/useCategories'
import { useExportReport, useReportsApiMode } from '@/hooks/useReports'
import { ApiError } from '@/lib/api-client'
import { toDateInputValue } from '@/lib/lead-utils'
import {
  REPORT_LIMIT_OPTIONS,
  type ReportLimitValue,
} from '@/types/api-report'

interface ReportExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ALL_CATEGORIES = 'all'

function defaultDateRange() {
  const dateTo = new Date()
  const dateFrom = new Date(dateTo)
  dateFrom.setDate(dateFrom.getDate() - 30)
  return {
    dateFrom: toDateInputValue(dateFrom),
    dateTo: toDateInputValue(dateTo),
  }
}

export function ReportExportDialog({ open, onOpenChange }: ReportExportDialogProps) {
  const apiMode = useReportsApiMode()
  const exportReport = useExportReport()
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    refetch: refetchCategories,
  } = useCategories()

  const [categoryId, setCategoryId] = useState(ALL_CATEGORIES)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [limit, setLimit] = useState<ReportLimitValue>('20')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      void refetchCategories()
      const range = defaultDateRange()
      setDateFrom(range.dateFrom)
      setDateTo(range.dateTo)
      setCategoryId(ALL_CATEGORIES)
      setLimit('20')
      setError(null)
    }
  }, [open, refetchCategories])

  const handleGenerate = async () => {
    setError(null)

    if (!dateFrom || !dateTo) {
      setError('Choose a start and end date.')
      return
    }
    if (dateFrom > dateTo) {
      setError('Start date must be on or before end date.')
      return
    }

    try {
      await exportReport.mutateAsync({
        categoryId: categoryId === ALL_CATEGORIES ? null : categoryId,
        dateFrom,
        dateTo,
        limit,
      })
      onOpenChange(false)
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Report export failed'
      setError(message)
    }
  }

  const canGenerate = apiMode && !exportReport.isPending && Boolean(dateFrom && dateTo)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate leads report</DialogTitle>
          <DialogDescription>
            Filter by category and date range, then download an Excel report with scores,
            engagement, and AI summaries.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="report-category">Category</Label>
            {categoriesLoading ? (
              <Skeleton className="h-9 w-full" />
            ) : (
              <Select
                value={categoryId}
                onValueChange={setCategoryId}
                disabled={exportReport.isPending}
              >
                <SelectTrigger id="report-category" className="w-full">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_CATEGORIES}>All categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id} className="truncate">
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="report-date-from">From</Label>
              <Input
                id="report-date-from"
                type="date"
                value={dateFrom}
                max={dateTo || undefined}
                disabled={exportReport.isPending}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="report-date-to">To</Label>
              <Input
                id="report-date-to"
                type="date"
                value={dateTo}
                min={dateFrom || undefined}
                disabled={exportReport.isPending}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="report-limit">Row limit</Label>
            <Select
              value={limit}
              onValueChange={(v) => setLimit(v as ReportLimitValue)}
              disabled={exportReport.isPending}
            >
              <SelectTrigger id="report-limit" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REPORT_LIMIT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!apiMode && (
            <p className="text-xs text-destructive">
              Set <code className="rounded bg-muted px-1">VITE_API_BASE_URL</code> to
              generate reports from the API.
            </p>
          )}

          {error && (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={exportReport.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!canGenerate}
            onClick={() => void handleGenerate()}
          >
            {exportReport.isPending ? 'Generating…' : 'Generate report'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
