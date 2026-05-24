import type { ReportTierDefinition, ReportTiersResponse } from '@/types/api-report'

function mapTier(raw: unknown): ReportTierDefinition | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>

  const id = String(o.id ?? o.key ?? o.tier ?? '').trim()
  const label = String(o.label ?? o.name ?? id).trim()
  if (!id || !label) return null

  const minRaw = o.min_score ?? o.minScore ?? o.min
  const maxRaw = o.max_score ?? o.maxScore ?? o.max

  return {
    id,
    label,
    min_score: typeof minRaw === 'number' ? minRaw : Number(minRaw) || 0,
    max_score:
      maxRaw == null || maxRaw === ''
        ? null
        : typeof maxRaw === 'number'
          ? maxRaw
          : Number(maxRaw) || null,
  }
}

export function normalizeReportTiers(raw: ReportTiersResponse): ReportTierDefinition[] {
  const list = Array.isArray(raw) ? raw : raw.tiers
  if (!Array.isArray(list)) return []
  return list.map(mapTier).filter((tier): tier is ReportTierDefinition => tier != null)
}

/** e.g. Hot (80+) or Warm (50–79) */
export function formatReportTierLabel(tier: ReportTierDefinition): string {
  const threshold =
    tier.max_score != null
      ? `${tier.min_score}–${tier.max_score}`
      : `${tier.min_score}+`
  return `${tier.label} (${threshold})`
}
