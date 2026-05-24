import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate } from '@/lib/lead-utils'
import type { PipelineUploadRow } from '@/types/api-pipeline'

interface UploadsHistoryTableProps {
  uploads: PipelineUploadRow[]
}

function formatTierSummary(counts: PipelineUploadRow['tierCounts']): string {
  const parts: string[] = []
  if (counts.hot) parts.push(`${counts.hot} hot`)
  if (counts.warm) parts.push(`${counts.warm} warm`)
  if (counts.cold) parts.push(`${counts.cold} cold`)
  return parts.length > 0 ? parts.join(', ') : '—'
}

export function UploadsHistoryTable({ uploads }: UploadsHistoryTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload history</CardTitle>
        <p className="text-xs text-muted-foreground">
          Excel batches, row counts, and tier breakdown per upload
        </p>
      </CardHeader>
      <CardContent>
        {uploads.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No uploads in this period. Use Upload leads on the dashboard.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Rows</TableHead>
                <TableHead className="text-right">Created</TableHead>
                <TableHead className="text-right">Updated</TableHead>
                <TableHead className="text-right">Errors</TableHead>
                <TableHead>Tiers</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {uploads.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(row.createdAt)}
                  </TableCell>
                  <TableCell className="max-w-[160px] truncate">
                    {row.sourceLabel?.trim() ||
                      (row.leadSources.length > 0
                        ? row.leadSources.join(', ')
                        : '—')}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{row.rowCount}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {row.createdCount}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {row.updatedCount}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {row.errorCount > 0 ? (
                      <span className="text-destructive">{row.errorCount}</span>
                    ) : (
                      row.errorCount
                    )}
                  </TableCell>
                  <TableCell className="max-w-[180px] truncate text-muted-foreground">
                    {formatTierSummary(row.tierCounts)}
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
