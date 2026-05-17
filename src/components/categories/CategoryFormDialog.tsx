import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCreateCategory, useUpdateCategory } from '@/hooks/useCategories'
import type { Category, CategoryInput } from '@/types/category'

interface CategoryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
}

const emptyForm: CategoryInput = {
  name: '',
  offering: '',
  statement: '',
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
}: CategoryFormDialogProps) {
  const isEdit = Boolean(category)
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()
  const [form, setForm] = useState<CategoryInput>(emptyForm)
  const [error, setError] = useState<string | null>(null)

  const pending = createMutation.isPending || updateMutation.isPending

  useEffect(() => {
    if (open) {
      setForm(
        category
          ? {
              name: category.name,
              offering: category.offering,
              statement: category.statement,
            }
          : emptyForm,
      )
      setError(null)
    }
  }, [open, category])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const trimmed: CategoryInput = {
      name: form.name.trim(),
      offering: form.offering.trim(),
      statement: form.statement.trim(),
    }

    if (!trimmed.name || !trimmed.offering || !trimmed.statement) {
      setError('Name, offering, and statement are required.')
      return
    }

    try {
      if (isEdit && category) {
        await updateMutation.mutateAsync({ id: category.id, input: trimmed })
      } else {
        await createMutation.mutateAsync(trimmed)
      }
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit category' : 'New category'}</DialogTitle>
            <DialogDescription>
              Categories define how the AI scores leads — offering goes into the system
              prompt; statement describes a good-fit lead.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-1.5">
              <Label htmlFor="category-name">Name</Label>
              <Input
                id="category-name"
                placeholder="Enterprise SaaS"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                disabled={pending}
              />
              <p className="text-[0.625rem] text-muted-foreground">
                Short label shown in the UI
              </p>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="category-offering">Offering</Label>
              <Textarea
                id="category-offering"
                placeholder="What your business sells…"
                className="min-h-[100px]"
                value={form.offering}
                onChange={(e) => setForm((f) => ({ ...f, offering: e.target.value }))}
                disabled={pending}
              />
              <p className="text-[0.625rem] text-muted-foreground">
                Injected verbatim into the AI system prompt
              </p>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="category-statement">Statement</Label>
              <Textarea
                id="category-statement"
                placeholder="What a good-fit lead looks like…"
                className="min-h-[100px]"
                value={form.statement}
                onChange={(e) => setForm((f) => ({ ...f, statement: e.target.value }))}
                disabled={pending}
              />
              <p className="text-[0.625rem] text-muted-foreground">
                Used by the agent for fit assessment
              </p>
            </div>

            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? 'Saving…' : isEdit ? 'Save changes' : 'Create category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
