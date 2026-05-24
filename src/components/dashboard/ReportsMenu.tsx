import { useState } from 'react'
import { ReportExportDialog } from '@/components/dashboard/ReportExportDialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChartBarStackedIcon, ArrowDown01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

export function ReportsMenu() {
  const [reportOpen, setReportOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="w-full shrink-0 sm:w-auto">
            <HugeiconsIcon icon={ChartBarStackedIcon} strokeWidth={2} className="size-3.5" />
            Report
            <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} data-icon="inline-end" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[168px]">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault()
              setReportOpen(true)
            }}
          >
            Generate report…
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ReportExportDialog open={reportOpen} onOpenChange={setReportOpen} />
    </>
  )
}
