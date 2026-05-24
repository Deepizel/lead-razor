import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusChip } from '@/components/dashboard/StatusChip'
import type { PipelineCategoryRow } from '@/types/api-pipeline'

interface CategoryLeaderboardProps {
  rows: PipelineCategoryRow[]
}

export function CategoryLeaderboard({ rows }: CategoryLeaderboardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>By category</CardTitle>
        <p className="text-xs text-muted-foreground">
          Tier mix and totals per active category
        </p>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No category breakdown available yet.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Hot</TableHead>
                <TableHead className="text-right">Warm</TableHead>
                <TableHead className="text-right">Cold</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.categoryId}>
                  <TableCell className="max-w-[200px] truncate font-medium">
                    {row.categoryName}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    <span className="inline-flex items-center justify-end gap-1.5">
                      {row.hot}
                      <StatusChip status="hot" className="hidden sm:inline-flex" />
                    </span>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{row.warm}</TableCell>
                  <TableCell className="text-right tabular-nums">{row.cold}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {row.total}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
