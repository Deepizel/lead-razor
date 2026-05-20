export interface ApiCategory {
  id: string
  name: string
  offering: string
  statement: string
  created_at?: string
  updated_at?: string
}

export interface ApiCategoryInput {
  name: string
  offering: string
  statement: string
}
