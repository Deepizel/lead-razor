export interface Category {
  id: string
  name: string
  offering: string
  statement: string
  createdAt?: string
  updatedAt?: string
}

export interface CategoryInput {
  name: string
  offering: string
  statement: string
}
