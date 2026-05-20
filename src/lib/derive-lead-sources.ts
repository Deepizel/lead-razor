import { SOURCE_FILTER_ALL } from '@/constants/filters'
import type { Lead } from '@/types/lead'

/** Unique lead sources for filter dropdown, derived from loaded leads */
export function deriveLeadSourceOptions(leads: Lead[] | undefined): string[] {
  const unique = new Set<string>()
  for (const lead of leads ?? []) {
    if (lead.source?.trim()) unique.add(lead.source.trim())
  }
  return [SOURCE_FILTER_ALL, ...[...unique].sort((a, b) => a.localeCompare(b))]
}
