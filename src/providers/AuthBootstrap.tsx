import { useEffect } from 'react'
import { scheduleTokenRefresh } from '@/lib/auth-session'

/** Token refresh interval only — profile sync runs in ProtectedRoutes bootstrap */
export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  useEffect(() => scheduleTokenRefresh(), [])

  return children
}
