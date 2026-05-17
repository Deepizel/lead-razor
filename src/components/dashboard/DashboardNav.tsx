import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

export const dashboardNavItems = [
  { to: '/', label: 'Leads', end: true },
  { to: '/categories', label: 'Categories' },
  { to: '/analytics/pipeline', label: 'Pipeline' },
  { to: '/analytics/roi', label: 'ROI' },
] as const

interface DashboardNavProps {
  onNavigate?: () => void
  className?: string
}

export function DashboardNav({ onNavigate, className }: DashboardNavProps) {
  return (
    <nav className={cn('flex flex-col gap-1', className)}>
      {dashboardNavItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={'end' in item ? item.end : undefined}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'rounded-md px-3 py-2.5 text-sm font-medium transition-colors md:py-2 md:text-xs',
              isActive
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground',
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
