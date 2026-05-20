import type { ApiCategory } from '@/types/api-category'
import type { Category } from '@/types/category'

export function mapApiCategoryToUi(category: ApiCategory): Category {
  return {
    id: category.id,
    name: category.name,
    offering: category.offering,
    statement: category.statement,
    createdAt: category.created_at,
    updatedAt: category.updated_at,
  }
}
