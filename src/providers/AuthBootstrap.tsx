import { useEffect } from 'react'
import { bootstrapAuthSession, scheduleTokenRefresh } from '@/lib/auth-session'

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void bootstrapAuthSession()
    return scheduleTokenRefresh()
  }, [])

  return children
}
