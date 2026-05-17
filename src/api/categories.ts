import { seedCategories } from '@/data/mockCategories'
import { apiRequest, hasApiBaseUrl } from '@/lib/api-client'
import type { Category, CategoryInput } from '@/types/category'

const STORAGE_KEY = 'leadrazor-categories'
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

function loadMockCategories(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Category[]
  } catch {
    /* use seed */
  }
  return structuredClone(seedCategories)
}

function saveMockCategories(categories: Category[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories))
}

function nextId(): string {
  return `cat-${crypto.randomUUID().slice(0, 8)}`
}

async function mockFetchCategories(): Promise<Category[]> {
  await delay()
  return loadMockCategories().sort((a, b) => a.name.localeCompare(b.name))
}

async function mockCreateCategory(input: CategoryInput): Promise<Category> {
  await delay()
  const now = new Date().toISOString()
  const category: Category = { id: nextId(), ...input, createdAt: now, updatedAt: now }
  const list = loadMockCategories()
  list.push(category)
  saveMockCategories(list)
  return category
}

async function mockUpdateCategory(
  id: string,
  input: CategoryInput,
): Promise<Category> {
  await delay()
  const list = loadMockCategories()
  const index = list.findIndex((c) => c.id === id)
  if (index === -1) throw new Error('Category not found')
  const updated: Category = {
    ...list[index],
    ...input,
    updatedAt: new Date().toISOString(),
  }
  list[index] = updated
  saveMockCategories(list)
  return updated
}

async function mockDeleteCategory(id: string): Promise<void> {
  await delay()
  const list = loadMockCategories().filter((c) => c.id !== id)
  if (list.length === loadMockCategories().length) {
    throw new Error('Category not found')
  }
  saveMockCategories(list)
}

export async function fetchCategories(): Promise<Category[]> {
  if (hasApiBaseUrl()) {
    return apiRequest<Category[]>('/categories')
  }
  return mockFetchCategories()
}

export async function createCategory(input: CategoryInput): Promise<Category> {
  if (hasApiBaseUrl()) {
    return apiRequest<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  }
  return mockCreateCategory(input)
}

export async function updateCategory(
  id: string,
  input: CategoryInput,
): Promise<Category> {
  if (hasApiBaseUrl()) {
    return apiRequest<Category>(`/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    })
  }
  return mockUpdateCategory(id, input)
}

export async function deleteCategory(id: string): Promise<void> {
  if (hasApiBaseUrl()) {
    return apiRequest<void>(`/categories/${id}`, { method: 'DELETE' })
  }
  return mockDeleteCategory(id)
}
