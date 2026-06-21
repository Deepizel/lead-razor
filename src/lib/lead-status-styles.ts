import type { LeadStatus } from '@/types/lead'

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  hot: 'Hot',
  warm: 'Warm',
  cold: 'Cold',
}

/** Status label chips on lead table, cards, and profile */
export const leadStatusChipClass: Record<LeadStatus, string> = {
  cold:
    'border-cyan-600/50 bg-cyan-50 text-cyan-800 shadow-[inset_0_1px_0_0_rgba(165,243,252,0.35)] hover:bg-cyan-100 dark:border-cyan-400/55 dark:bg-cyan-500/12 dark:text-cyan-100 dark:shadow-[inset_0_1px_0_0_rgba(165,243,252,0.15)] dark:hover:bg-cyan-500/18',
  warm:
    'border-orange-600/45 bg-orange-50 text-orange-800 hover:bg-orange-100 dark:border-orange-500/50 dark:bg-orange-500/12 dark:text-orange-200 dark:hover:bg-orange-500/18',
  hot:
    'border-rose-600/50 bg-rose-50 text-rose-800 shadow-[inset_0_1px_0_0_rgba(254,205,211,0.35)] hover:bg-rose-100 dark:border-rose-500/55 dark:bg-rose-500/14 dark:text-rose-200 dark:shadow-[inset_0_1px_0_0_rgba(254,205,211,0.12)] dark:hover:bg-rose-500/20',
}

/** Score badges — slightly stronger fill for numeric emphasis */
export const leadStatusScoreClass: Record<LeadStatus, string> = {
  cold:
    'border-cyan-600/50 bg-cyan-100 text-cyan-900 dark:border-cyan-400/55 dark:bg-cyan-950/50 dark:text-cyan-100',
  warm:
    'border-orange-600/45 bg-orange-100 text-orange-900 dark:border-orange-500/50 dark:bg-orange-950/45 dark:text-orange-200',
  hot:
    'border-rose-600/50 bg-rose-100 text-rose-900 dark:border-rose-500/55 dark:bg-rose-950/50 dark:text-rose-200',
}
