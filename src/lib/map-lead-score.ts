import type {
  ApiLeadTier,
  LeadScoreBreakdown,
  LeadScoreBreakdownResponse,
  ScoreBreakdownItem,
} from '@/types/api-lead'

function pickString(obj: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const v = obj[key]
    if (typeof v === 'string' && v.length > 0) return v
  }
  return ''
}

function mapBreakdownItem(raw: unknown): ScoreBreakdownItem {
  const o = (raw ?? {}) as Record<string, unknown>
  return {
    signal: pickString(o, 'signal', 'label', 'name'),
    points: typeof o.points === 'number' ? o.points : Number(o.points) || 0,
    met: Boolean(o.met ?? o.passed ?? o.satisfied),
  }
}

export function normalizeLeadScoreBreakdown(
  raw: LeadScoreBreakdownResponse,
): LeadScoreBreakdown {
  const wrapped =
    raw && typeof raw === 'object' && 'scoreBreakdown' in raw
      ? (raw as { scoreBreakdown: LeadScoreBreakdown }).scoreBreakdown
      : (raw as LeadScoreBreakdown)

  const o = (wrapped ?? {}) as unknown as Record<string, unknown>
  const list = o.breakdown ?? o.items ?? o.signals ?? []
  const breakdown = Array.isArray(list) ? list.map(mapBreakdownItem) : []

  return {
    total: typeof o.total === 'number' ? o.total : Number(o.total) || 0,
    tier: (pickString(o, 'tier', 'status') || 'cold') as ApiLeadTier,
    breakdown,
  }
}
