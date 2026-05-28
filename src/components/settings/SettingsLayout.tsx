import { NavLink, Outlet } from 'react-router-dom'
import {
  SETTINGS_EMAIL_IDENTITY_PATH,
  SETTINGS_NOTIFICATIONS_PATH,
  SETTINGS_PROFILE_PATH,
} from '@/constants/routes'
import { cn } from '@/lib/utils'

const settingsTabs = [
  { to: SETTINGS_PROFILE_PATH, label: 'Profile' },
  { to: SETTINGS_EMAIL_IDENTITY_PATH, label: 'Email identities' },
  { to: SETTINGS_NOTIFICATIONS_PATH, label: 'Notifications' },
] as const

export function SettingsLayout() {
  return (
    <div className="space-y-6">
      <div className="min-w-0">
        <h1 className="text-lg font-semibold tracking-tight">Settings</h1>
        <p className="text-xs text-muted-foreground">
          Account, outreach sender identity, and notification preferences
        </p>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        <nav
          className="flex shrink-0 flex-row gap-1 overflow-x-auto border-b border-border pb-2 md:w-44 md:flex-col md:border-b-0 md:border-r md:pb-0 md:pr-4"
          aria-label="Settings sections"
        >
          {settingsTabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                cn(
                  'whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                )
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>

        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
