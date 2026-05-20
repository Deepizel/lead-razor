import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { bootstrapAuthSession } from '@/lib/auth-session'
import { useAuthStore } from '@/stores/authStore'

export default function ProtectedRoutes() {
  const [ready, setReady] = useState(false)
  const isAuthenticated = useAuthStore((s) => Boolean(s.refreshToken || s.accessToken))

  useEffect(() => {
    void bootstrapAuthSession().finally(() => setReady(true))
  }, [])

  if (!ready) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm space-y-3">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
