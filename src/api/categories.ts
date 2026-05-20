import {
  createCategoryRemote,
  deleteCategoryRemote,
  fetchCategoriesRemote,
  updateCategoryRemote,
} from '@/api/categories-remote'
import { mapApiCategoryToUi } from '@/lib/map-category'
import { assertApiConfigured } from '@/lib/require-api'
import type { Category, CategoryInput } from '@/types/category'

export async function fetchCategories(): Promise<Category[]> {
  assertApiConfigured()
  const rows = await fetchCategoriesRemote()
  return rows.map(mapApiCategoryToUi).sort((a, b) => a.name.localeCompare(b.name))
}

export async function createCategory(input: CategoryInput): Promise<Category> {
  assertApiConfigured()
  const row = await createCategoryRemote(input)
  return mapApiCategoryToUi(row)
}

export async function updateCategory(id: string, input: CategoryInput): Promise<Category> {
  assertApiConfigured()
  const row = await updateCategoryRemote(id, input)
  return mapApiCategoryToUi(row)
}

export async function deleteCategory(id: string): Promise<void> {
  assertApiConfigured()
  await deleteCategoryRemote(id)
}
