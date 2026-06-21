import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ReportExportDialog } from '@/components/dashboard/ReportExportDialog'
import {
  ChartBarStackedIcon,
  ChartIncreaseIcon,
  FileExportIcon,
  Mail01Icon,
  Settings02Icon,
  Tag01Icon,
  UserGroupIcon,
  UserMultiple02Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { DASHBOARD_BASE, OUTREACH_PATH, SETTINGS_PATH, USERS_PATH } from '@/constants/routes'
import { useIsAdmin } from '@/hooks/useIsAdmin'
import { cn } from '@/lib/utils'

type DashboardNavItem = {
  to: string
  label: string
  icon: typeof UserMultiple02Icon
  end?: boolean
  /** Shown only when the signed-in user has role admin */
  adminOnly?: boolean
}

const sidebarNavItems: DashboardNavItem[] = [
  { to: DASHBOARD_BASE, label: 'Leads', end: true, icon: UserMultiple02Icon },
  { to: USERS_PATH, label: 'Users', end: true, icon: UserGroupIcon, adminOnly: true },
  { to: OUTREACH_PATH, label: 'Outreach', icon: Mail01Icon },
  { to: `${DASHBOARD_BASE}/categories`, label: 'Categories', icon: Tag01Icon },
  {
    to: `${DASHBOARD_BASE}/analytics/pipeline`,
    label: 'Pipeline',
    icon: ChartBarStackedIcon,
  },
  {
    to: `${DASHBOARD_BASE}/analytics/roi`,
    label: 'ROI',
    icon: ChartIncreaseIcon,
  },
  { to: SETTINGS_PATH, label: 'Settings', icon: Settings02Icon, end: false },
]

interface DashboardNavProps {
  onNavigate?: () => void
  className?: string
}

export function DashboardNav({ onNavigate, className }: DashboardNavProps) {
  const [reportOpen, setReportOpen] = useState(false)
  const isAdmin = useIsAdmin()
  const visibleNavItems = sidebarNavItems.filter((item) => !item.adminOnly || isAdmin)

  const openReport = () => {
    setReportOpen(true)
    onNavigate?.()
  }

  return (
    <>
      <nav className={cn('flex flex-col gap-1', className)}>
        {visibleNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors md:py-2 md:text-xs',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground',
              )
            }
          >
            {({ isActive }) => (
              <>
                <HugeiconsIcon
                  icon={item.icon}
                  strokeWidth={2}
                  className={cn(
                    'size-4 shrink-0',
                    isActive ? 'text-sidebar-accent-foreground' : 'text-muted-foreground',
                  )}
                  aria-hidden
                />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}

        <button
          type="button"
          onClick={openReport}
          className={cn(
            'flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors md:py-2 md:text-xs',
            reportOpen
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground',
          )}
        >
          <HugeiconsIcon
            icon={FileExportIcon}
            strokeWidth={2}
            className={cn(
              'size-4 shrink-0',
              reportOpen ? 'text-sidebar-accent-foreground' : 'text-muted-foreground',
            )}
            aria-hidden
          />
          <span>Report</span>
        </button>
      </nav>

      <ReportExportDialog open={reportOpen} onOpenChange={setReportOpen} />
    </>
  )
}
