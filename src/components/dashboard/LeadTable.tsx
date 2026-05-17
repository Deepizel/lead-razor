import { Link } from 'react-router-dom'
import { LeadCard } from '@/components/dashboard/LeadCard'
import { ScoreBadge } from '@/components/dashboard/ScoreBadge'
import { StatusChip } from '@/components/dashboard/StatusChip'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate } from '@/lib/lead-utils'
import type { Lead } from '@/types/lead'

interface LeadTableProps {
  leads: Lead[]
  onRescore?: (id: string) => void
}

export function LeadTable({ leads, onRescore }: LeadTableProps) {
  return (
    <>
      {/* Mobile: card list */}
      <ul className="flex flex-col gap-3 md:hidden">
        {leads.map((lead) => (
          <li key={lead.id}>
            <LeadCard lead={lead} onRescore={onRescore} />
          </li>
        ))}
      </ul>

      {/* Tablet+: scrollable table */}
      <div className="hidden overflow-x-auto md:block">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 z-10 bg-card">Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="hidden lg:table-cell">Email</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden xl:table-cell">Source</TableHead>
              <TableHead className="hidden lg:table-cell">Last action</TableHead>
              <TableHead className="hidden xl:table-cell">Created</TableHead>
              <TableHead className="sticky right-0 z-10 bg-card text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="sticky left-0 z-10 bg-card font-medium">
                  {lead.name}
                </TableCell>
                <TableCell>{lead.company}</TableCell>
                <TableCell className="hidden text-muted-foreground lg:table-cell">
                  {lead.email}
                </TableCell>
                <TableCell>
                  <ScoreBadge score={lead.score} status={lead.status} />
                </TableCell>
                <TableCell>
                  <StatusChip status={lead.status} />
                </TableCell>
                <TableCell className="hidden xl:table-cell">{lead.source}</TableCell>
                <TableCell className="hidden max-w-[160px] truncate text-muted-foreground lg:table-cell">
                  {lead.lastAction}
                </TableCell>
                <TableCell className="hidden text-muted-foreground xl:table-cell">
                  {formatDate(lead.createdAt)}
                </TableCell>
                <TableCell className="sticky right-0 z-10 bg-card text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="xs" asChild>
                      <Link to={`/leads/${lead.id}`}>View</Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => onRescore?.(lead.id)}
                    >
                      Re-score
                    </Button>
                    <Button variant="secondary" size="xs" className="hidden sm:inline-flex">
                      Email
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
