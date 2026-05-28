import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoutes from '@/core/guards/ProtectedRoutes'
import GuestOnlyRoute from '@/core/guards/GuestOnlyRoute'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { SettingsLayout } from '@/components/settings/SettingsLayout'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DASHBOARD_BASE,
  SETTINGS_PATH,
} from '@/constants/routes'

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const VerifyEmailPage = lazy(() => import('@/pages/auth/VerifyEmailPage'))
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'))

const LeadsDashboard = lazy(() => import('@/pages/dashboard/LeadsDashboard'))
const LeadDetailPage = lazy(() => import('@/pages/dashboard/LeadDetailPage'))
const PipelineAnalyticsPage = lazy(
  () => import('@/pages/dashboard/PipelineAnalyticsPage'),
)
const ROIDashboardPage = lazy(() => import('@/pages/dashboard/ROIDashboardPage'))
const CategoriesPage = lazy(() => import('@/pages/categories/CategoriesPage'))
const OutreachPage = lazy(() => import('@/pages/dashboard/OutreachPage'))
const SettingsProfileTab = lazy(() => import('@/pages/settings/SettingsProfileTab'))
const SettingsEmailIdentityTab = lazy(
  () => import('@/pages/settings/SettingsEmailIdentityTab'),
)
const SettingsNotificationsTab = lazy(
  () => import('@/pages/settings/SettingsNotificationsTab'),
)

function PageLoader() {
  return (
    <div className="space-y-3 p-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<GuestOnlyRoute />}>
            <Route index element={<LoginPage />} />
            <Route path="verify-email" element={<VerifyEmailPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
          </Route>

          <Route element={<ProtectedRoutes />}>
            <Route path={DASHBOARD_BASE} element={<DashboardLayout />}>
              <Route index element={<LeadsDashboard />} />
              <Route path="leads/:id" element={<LeadDetailPage />} />
              <Route path="outreach" element={<OutreachPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="analytics/pipeline" element={<PipelineAnalyticsPage />} />
              <Route path="analytics/roi" element={<ROIDashboardPage />} />
            </Route>

            <Route path={SETTINGS_PATH} element={<DashboardLayout />}>
              <Route element={<SettingsLayout />}>
                <Route index element={<Navigate to="profile" replace />} />
                <Route path="profile" element={<SettingsProfileTab />} />
                <Route path="email-identity" element={<SettingsEmailIdentityTab />} />
                <Route path="notifications" element={<SettingsNotificationsTab />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
