import type { LeadStatus, UploadedDatePreset } from '@/types/lead'

/** Format a Date as YYYY-MM-DD for date inputs */
export function toDateInputValue(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function startOfDayFromInput(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d, 0, 0, 0, 0)
}

export function endOfDayFromInput(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d, 23, 59, 59, 999)
}

export function getUploadedDateRange(
  preset: UploadedDatePreset,
  from: string,
  to: string,
): { from: string; to: string } {
  const today = new Date()
  const todayStr = toDateInputValue(today)

  if (preset === 'all') {
    return { from: '', to: '' }
  }

  if (preset === 'custom') {
    return { from, to }
  }

  const start = new Date(today)
  const days =
    preset === '7d' ? 7 : preset === '30d' ? 30 : preset === '90d' ? 90 : 0
  start.setDate(start.getDate() - days)

  return { from: toDateInputValue(start), to: todayStr }
}

export function isWithinUploadedRange(
  createdAt: string,
  from: string,
  to: string,
): boolean {
  const created = new Date(createdAt).getTime()
  if (from && created < startOfDayFromInput(from).getTime()) return false
  if (to && created > endOfDayFromInput(to).getTime()) return false
  return true
}

export function scoreToStatus(score: number): LeadStatus {
  if (score >= 80) return 'hot'
  if (score >= 50) return 'warm'
  return 'cold'
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(iso))
}
