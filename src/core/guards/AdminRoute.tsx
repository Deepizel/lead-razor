import { Navigate, Outlet } from 'react-router-dom'
import { DASHBOARD_BASE } from '@/constants/routes'
import { useIsAdmin } from '@/hooks/useIsAdmin'

/** Only admins can access nested routes */
export default function AdminRoute() {
  const isAdmin = useIsAdmin()

  if (!isAdmin) {
    return <Navigate to={DASHBOARD_BASE} replace />
  }

  return <Outlet />
}
