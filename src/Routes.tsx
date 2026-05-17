import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Skeleton } from '@/components/ui/skeleton'

// const Home = lazy(() => import('@/pages/landing/Home'))
// const Auth = lazy(() => import('@/pages/auth/Auth'))

const LeadsDashboard = lazy(() => import('@/pages/dashboard/LeadsDashboard'))
const LeadDetailPage = lazy(() => import('@/pages/dashboard/LeadDetailPage'))
const PipelineAnalyticsPage = lazy(
  () => import('@/pages/dashboard/PipelineAnalyticsPage'),
)
const ROIDashboardPage = lazy(() => import('@/pages/dashboard/ROIDashboardPage'))
const CategoriesPage = lazy(() => import('@/pages/categories/CategoriesPage'))

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
          {/* Marketing / auth — enable when ready
          <Route path="/landing" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          */}

          <Route element={<DashboardLayout />}>
            <Route index element={<LeadsDashboard />} />
            <Route path="leads/:id" element={<LeadDetailPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="analytics/pipeline" element={<PipelineAnalyticsPage />} />
            <Route path="analytics/roi" element={<ROIDashboardPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
