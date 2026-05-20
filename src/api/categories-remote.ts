import { apiPaths } from '@/api/paths'
import { apiRequest } from '@/lib/api-client'
import type { ApiCategory, ApiCategoryInput } from '@/types/api-category'

export async function fetchCategoriesRemote(): Promise<ApiCategory[]> {
  const data = await apiRequest<ApiCategory[] | { categories: ApiCategory[] }>(
    apiPaths.categories.list,
  )
  return Array.isArray(data) ? data : data.categories
}

export async function createCategoryRemote(input: ApiCategoryInput): Promise<ApiCategory> {
  return apiRequest<ApiCategory>(apiPaths.categories.list, {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function updateCategoryRemote(
  id: string,
  input: ApiCategoryInput,
): Promise<ApiCategory> {
  return apiRequest<ApiCategory>(apiPaths.categories.detail(id), {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

export async function deleteCategoryRemote(id: string): Promise<void> {
  return apiRequest<void>(apiPaths.categories.detail(id), { method: 'DELETE' })
}
