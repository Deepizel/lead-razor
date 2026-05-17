import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Category } from '@/types/category'

interface CategoriesTableProps {
  categories: Category[]
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
}

export function CategoriesTable({
  categories,
  onEdit,
  onDelete,
}: CategoriesTableProps) {
  return (
    <>
      <ul className="flex flex-col gap-3 md:hidden">
        {categories.map((category) => (
          <li
            key={category.id}
            className="rounded-lg border border-border/60 bg-card/50 p-4"
          >
            <p className="font-medium">{category.name}</p>
            <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Offering: </span>
              {category.offering}
            </p>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Statement: </span>
              {category.statement}
            </p>
            <div className="mt-3 flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(category)}>
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(category)}
              >
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Offering</TableHead>
              <TableHead>Statement</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="max-w-[160px] font-medium">
                  {category.name}
                </TableCell>
                <TableCell className="max-w-[280px]">
                  <p className="line-clamp-2 text-muted-foreground">
                    {category.offering}
                  </p>
                </TableCell>
                <TableCell className="max-w-[280px]">
                  <p className="line-clamp-2 text-muted-foreground">
                    {category.statement}
                  </p>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="xs" onClick={() => onEdit(category)}>
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="xs"
                      onClick={() => onDelete(category)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
