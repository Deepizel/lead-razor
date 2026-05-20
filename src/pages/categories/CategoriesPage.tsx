import { useState } from 'react'
import { ApiStatusBanner } from '@/components/layout/ApiStatusBanner'
import { CategoriesTable } from '@/components/categories/CategoriesTable'
import { CategoryFormDialog } from '@/components/categories/CategoryFormDialog'
import { DeleteCategoryDialog } from '@/components/categories/DeleteCategoryDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ApiError } from '@/lib/api-client'
import { useCategories } from '@/hooks/useCategories'
import { useLeadsApiMode } from '@/hooks/useLeads'
import type { Category } from '@/types/category'

export default function CategoriesPage() {
  const apiMode = useLeadsApiMode()
  const { data: categories, isLoading, isError, error } = useCategories()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [deleting, setDeleting] = useState<Category | null>(null)

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (category: Category) => {
    setEditing(category)
    setFormOpen(true)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold tracking-tight">Categories</h1>
          <p className="text-xs text-muted-foreground">
            Define ICP segments — offering feeds the AI prompt; statement drives fit
            scoring
          </p>
        </div>
        <Button size="sm" className="w-full shrink-0 sm:w-auto" onClick={openCreate}>
          Add category
        </Button>
      </div>

      <ApiStatusBanner />

      <Card>
        <CardHeader>
          <CardTitle>All categories</CardTitle>
        </CardHeader>
        <CardContent>
          {!apiMode && (
            <p className="text-sm text-muted-foreground">
              Configure <code className="rounded bg-muted px-1">VITE_API_BASE_URL</code> to
              manage categories via the API.
            </p>
          )}
          {isLoading && (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          )}
          {apiMode && isError && (
            <p className="text-sm text-destructive">
              {error instanceof ApiError
                ? error.message
                : error instanceof Error
                  ? error.message
                  : 'Failed to load categories.'}
              {error instanceof ApiError && error.status === 404 && (
                <span className="mt-1 block text-xs text-muted-foreground">
                  GET /api/categories is not available on this backend yet.
                </span>
              )}
            </p>
          )}
          {categories && categories.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No categories yet. Create one to guide AI lead qualification.
            </p>
          )}
          {categories && categories.length > 0 && (
            <CategoriesTable
              categories={categories}
              onEdit={openEdit}
              onDelete={setDeleting}
            />
          )}
        </CardContent>
      </Card>

      <CategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editing}
      />

      <DeleteCategoryDialog
        category={deleting}
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
      />
    </div>
  )
}
