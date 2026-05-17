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
import { leadSources } from '@/data/mockLeads'
import { getUploadedDateRange } from '@/lib/lead-utils'
import { useUiStore } from '@/stores/uiStore'
import type { LeadStatus, UploadedDatePreset } from '@/types/lead'

const statusOptions: { label: string; value: LeadStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Hot', value: 'hot' },
  { label: 'Warm', value: 'warm' },
  { label: 'Cold', value: 'cold' },
]

const uploadedPresetOptions: { label: string; value: UploadedDatePreset }[] = [
  { label: 'All uploads', value: 'all' },
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'Custom range', value: 'custom' },
]

export function LeadsFilters() {
  const filters = useUiStore((s) => s.filters)
  const setFilters = useUiStore((s) => s.setFilters)
  const resetFilters = useUiStore((s) => s.resetFilters)

  const showCustomDates = filters.uploadedPreset === 'custom'

  const handlePresetChange = (preset: UploadedDatePreset) => {
    const range = getUploadedDateRange(preset, filters.uploadedFrom, filters.uploadedTo)
    setFilters({
      uploadedPreset: preset,
      uploadedFrom: range.from,
      uploadedTo: range.to,
    })
  }

  return (
    <div className="grid gap-4 rounded-lg border border-border/60 bg-card/50 p-4 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-end">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="filter-status">Status</Label>
        <Select
          value={filters.status}
          onValueChange={(value) =>
            setFilters({ status: value as LeadStatus | 'all' })
          }
        >
          <SelectTrigger id="filter-status" className="w-full lg:min-w-[120px]" size="sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="filter-source">Source</Label>
        <Select
          value={filters.source}
          onValueChange={(value) => setFilters({ source: value })}
        >
          <SelectTrigger id="filter-source" className="w-full lg:min-w-[140px]" size="sm">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            {leadSources.map((source) => (
              <SelectItem key={source} value={source}>
                {source}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="filter-min">Min score</Label>
        <Input
          id="filter-min"
          type="number"
          min={0}
          max={100}
          className="h-8 w-full lg:w-20"
          value={filters.minScore}
          onChange={(e) => setFilters({ minScore: Number(e.target.value) })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="filter-max">Max score</Label>
        <Input
          id="filter-max"
          type="number"
          min={0}
          max={100}
          className="h-8 w-full lg:w-20"
          value={filters.maxScore}
          onChange={(e) => setFilters({ maxScore: Number(e.target.value) })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="filter-uploaded-preset">Uploaded</Label>
        <Select
          value={filters.uploadedPreset}
          onValueChange={(value) => handlePresetChange(value as UploadedDatePreset)}
        >
          <SelectTrigger id="filter-uploaded-preset" className="w-full lg:min-w-[140px]" size="sm">
            <SelectValue placeholder="Upload date" />
          </SelectTrigger>
          <SelectContent>
            {uploadedPresetOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showCustomDates && (
        <>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="filter-uploaded-from">From</Label>
            <Input
              id="filter-uploaded-from"
              type="date"
              className="h-8 w-full lg:w-[140px]"
              value={filters.uploadedFrom}
              max={filters.uploadedTo || undefined}
              onChange={(e) =>
                setFilters({
                  uploadedPreset: 'custom',
                  uploadedFrom: e.target.value,
                })
              }
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="filter-uploaded-to">To</Label>
            <Input
              id="filter-uploaded-to"
              type="date"
              className="h-8 w-full lg:w-[140px]"
              value={filters.uploadedTo}
              min={filters.uploadedFrom || undefined}
              onChange={(e) =>
                setFilters({
                  uploadedPreset: 'custom',
                  uploadedTo: e.target.value,
                })
              }
            />
          </div>
        </>
      )}

      <Button
        variant="outline"
        size="sm"
        className="w-full sm:col-span-2 lg:mb-0.5 lg:w-auto"
        onClick={resetFilters}
      >
        Reset filters
      </Button>
    </div>
  )
}
