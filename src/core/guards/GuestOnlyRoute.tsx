import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

/** Redirect authenticated users to the dashboard */
export default function GuestOnlyRoute() {
  const isAuthenticated = useAuthStore((s) => Boolean(s.refreshToken || s.accessToken))

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
