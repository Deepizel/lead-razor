import { useState } from 'react'
import { ApiStatusBanner } from '@/components/layout/ApiStatusBanner'
import { EmptyAnalytics } from '@/components/layout/EmptyAnalytics'
import { CategoryLeaderboard } from '@/components/analytics/pipeline/CategoryLeaderboard'
import { EngagementMetrics } from '@/components/analytics/pipeline/EngagementMetrics'
import { HotLeadsWeekCard } from '@/components/analytics/pipeline/HotLeadsWeekCard'
import { TierDistributionChart } from '@/components/analytics/pipeline/TierDistributionChart'
import { TierMovementChart } from '@/components/analytics/pipeline/TierMovementChart'
import { UploadsHistoryTable } from '@/components/analytics/pipeline/UploadsHistoryTable'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { ApiError } from '@/lib/api-client'
import { tierDistributionTotal } from '@/lib/pipeline-analytics'
import {
  usePipelineAnalytics,
  usePipelineAnalyticsApiMode,
} from '@/hooks/usePipelineAnalytics'

const LOOKBACK_OPTIONS = [
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' },
  { value: '365', label: 'Last 365 days' },
] as const

export default function PipelineAnalyticsPage() {
  const apiMode = usePipelineAnalyticsApiMode()
  const [days, setDays] = useState(30)
  const { data, isLoading, isError, error, refetch, isFetching } =
    usePipelineAnalytics(days)

  const isEmpty =
    data &&
    tierDistributionTotal(data.tierDistribution) === 0 &&
    data.uploads.length === 0

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold tracking-tight">Pipeline analytics</h1>
          <p className="text-xs text-muted-foreground">
            Tier mix, movement, engagement, categories, and upload batches
          </p>
          {data?.period && (
            <p className="mt-1 text-[0.625rem] text-muted-foreground">
              {new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }).format(new Date(data.period.from))}
              {' — '}
              {new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }).format(new Date(data.period.to))}
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-col gap-1.5">
          <Label htmlFor="pipeline-days" className="text-xs text-muted-foreground">
            Lookback
          </Label>
          <Select
            value={String(days)}
            onValueChange={(v) => setDays(Number(v))}
            disabled={!apiMode || isLoading}
          >
            <SelectTrigger id="pipeline-days" className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LOOKBACK_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ApiStatusBanner />

      {!apiMode && (
        <p className="text-sm text-muted-foreground">
          Configure <code className="rounded bg-muted px-1">VITE_API_BASE_URL</code> to
          load pipeline analytics from the API.
        </p>
      )}

      {apiMode && isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-28 w-full" />
          <div className="grid gap-4 lg:grid-cols-2">
            <Skeleton className="h-[320px] w-full" />
            <Skeleton className="h-[320px] w-full" />
          </div>
          <Skeleton className="h-48 w-full" />
        </div>
      )}

      {apiMode && isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error instanceof ApiError
            ? error.message
            : error instanceof Error
              ? error.message
              : 'Failed to load pipeline analytics.'}
          {error instanceof ApiError && error.status === 404 && (
            <p className="mt-2 text-xs text-muted-foreground">
              Run the pipeline analytics migration on the backend, then retry.
            </p>
          )}
          <button
            type="button"
            className="mt-2 text-xs underline underline-offset-4"
            onClick={() => void refetch()}
          >
            Retry
          </button>
        </div>
      )}

      {apiMode && !isLoading && !isError && data && (
        <>
          {isEmpty ? (
            <EmptyAnalytics
              title="No pipeline data yet"
              description="Upload leads and score them to populate tier distribution, movement, and upload history."
            />
          ) : (
            <>
              <HotLeadsWeekCard data={data.hotLeadsWeekOverWeek} />
              <EngagementMetrics engagement={data.engagement} />
              <div className="grid gap-4 lg:grid-cols-2">
                <TierDistributionChart distribution={data.tierDistribution} />
                <TierMovementChart movement={data.tierMovement} days={days} />
              </div>
              <CategoryLeaderboard rows={data.byCategory} />
              <UploadsHistoryTable uploads={data.uploads} />
            </>
          )}
        </>
      )}

      {apiMode && isFetching && !isLoading && data && (
        <p className="text-center text-[0.625rem] text-muted-foreground">Updating…</p>
      )}
    </div>
  )
}
