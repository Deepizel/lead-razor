import type { TierCounts } from '@/types/api-pipeline'
import type { LeadStatus } from '@/types/lead'

export const TIER_CHART_COLORS: Record<LeadStatus, string> = {
  hot: 'oklch(0.696 0.17 162.48)',
  warm: 'oklch(0.769 0.188 70.08)',
  cold: 'oklch(0.55 0 0)',
}

export const TIER_LABELS: Record<LeadStatus, string> = {
  hot: 'Hot',
  warm: 'Warm',
  cold: 'Cold',
}

/** Format API rate (0–1) as a percentage label */
export function formatRate(rate: number | null | undefined): string {
  if (rate == null || Number.isNaN(rate)) return '—'
  return `${(rate * 100).toFixed(1)}%`
}

export function tierDistributionTotal(dist: TierCounts): number {
  return dist.hot + dist.warm + dist.cold
}

export function tierCountsToChartData(dist: TierCounts) {
  return (['hot', 'warm', 'cold'] as const).map((tier) => ({
    tier,
    name: TIER_LABELS[tier],
    value: dist[tier],
    fill: TIER_CHART_COLORS[tier],
  }))
}

/** e.g. cold_to_warm → Cold → Warm */
export function formatTransitionKey(key: string): string {
  return key
    .split('_to_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' → ')
}

export function formatPeriodLabel(isoDate: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(isoDate))
}

export function weekOverWeekDelta(
  current: number,
  previous: number,
): { delta: number; percent: number | null } {
  const delta = current - previous
  const percent =
    previous > 0 ? Math.round((delta / previous) * 100) : null
  return { delta, percent }
}
