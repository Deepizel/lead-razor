import { useMemo, useState } from 'react'
import {
  LeadTablePagination,
  type LeadPageSize,
} from '@/components/dashboard/LeadTablePagination'
import { EmailDetailDialog } from '@/components/outreach/EmailDetailDialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { useEmailsList } from '@/hooks/useEmails'
import { formatTrackingYesNo } from '@/lib/map-email'
import { formatDate } from '@/lib/lead-utils'
import type { ApiLeadTier } from '@/types/api-lead'

const tierFilterOptions: { label: string; value: ApiLeadTier | 'all' }[] = [
  { label: 'All tiers', value: 'all' },
  { label: 'Hot', value: 'hot' },
  { label: 'Warm', value: 'warm' },
  { label: 'Cold', value: 'cold' },
]

export function SentEmailsTab() {
  const [tier, setTier] = useState<ApiLeadTier | 'all'>('all')
  const [openedFilter, setOpenedFilter] = useState<'all' | 'yes' | 'no'>('all')
  const [repliedFilter, setRepliedFilter] = useState<'all' | 'yes' | 'no'>('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<LeadPageSize>(20)
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null)

  const listParams = useMemo(
    () => ({
      tier: tier === 'all' ? undefined : tier,
      opened: openedFilter === 'all' ? undefined : openedFilter === 'yes',
      replied: repliedFilter === 'all' ? undefined : repliedFilter === 'yes',
      limit: pageSize,
      offset: (page - 1) * pageSize,
    }),
    [tier, openedFilter, repliedFilter, page, pageSize],
  )

  const { data, isLoading, isError, error, refetch } = useEmailsList(listParams)
  const emails = data?.emails ?? []
  const total = data?.total ?? emails.length

  const handlePageSizeChange = (size: LeadPageSize) => {
    setPageSize(size)
    setPage(1)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="sent-tier" className="text-xs text-muted-foreground">
            Tier
          </Label>
          <Select value={tier} onValueChange={(v) => { setTier(v as ApiLeadTier | 'all'); setPage(1) }}>
            <SelectTrigger id="sent-tier" className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tierFilterOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sent-opened" className="text-xs text-muted-foreground">
            Opened
          </Label>
          <Select
            value={openedFilter}
            onValueChange={(v) => {
              setOpenedFilter(v as 'all' | 'yes' | 'no')
              setPage(1)
            }}
          >
            <SelectTrigger id="sent-opened" className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sent-replied" className="text-xs text-muted-foreground">
            Replied
          </Label>
          <Select
            value={repliedFilter}
            onValueChange={(v) => {
              setRepliedFilter(v as 'all' | 'yes' | 'no')
              setPage(1)
            }}
          >
            <SelectTrigger id="sent-replied" className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => void refetch()}>
          Refresh
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : 'Failed to load sent emails.'}
        </p>
      )}

      {!isLoading && !isError && emails.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No sent emails yet. Use Compose / Send to reach your leads.
        </p>
      )}

      {!isLoading && !isError && emails.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Opened</TableHead>
                <TableHead>Clicked</TableHead>
                <TableHead>Replied</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {emails.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/40"
                  onClick={() => setSelectedEmailId(row.id)}
                >
                  <TableCell className="font-medium">{row.leadName}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{row.subject}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {formatDate(row.sentAt)}
                  </TableCell>
                  <TableCell className="text-xs">
                    {formatTrackingYesNo(row.opened, row.openedAt)}
                  </TableCell>
                  <TableCell className="text-xs">
                    {formatTrackingYesNo(row.clicked, row.clickedAt)}
                  </TableCell>
                  <TableCell className="text-xs">
                    {formatTrackingYesNo(row.replied, row.repliedAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <LeadTablePagination
            page={page}
            pageSize={pageSize}
            totalItems={total}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      )}

      <EmailDetailDialog
        emailId={selectedEmailId}
        onOpenChange={(open) => {
          if (!open) setSelectedEmailId(null)
        }}
      />
    </div>
  )
}
