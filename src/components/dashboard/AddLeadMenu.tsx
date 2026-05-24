import { useState } from 'react'
import { CreateLeadDialog } from '@/components/dashboard/CreateLeadDialog'
import { UploadLeadsDialog } from '@/components/dashboard/UploadLeadsDialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useExportLeads } from '@/hooks/useLeads'
import { ApiError } from '@/lib/api-client'
import { notify } from '@/stores/toastStore'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowDown01Icon } from '@hugeicons/core-free-icons'

export function AddLeadMenu() {
  const [uploadOpen, setUploadOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const exportLeads = useExportLeads()

  const handleExport = async () => {
    try {
      await exportLeads.mutateAsync()
    } catch (err) {
      if (!(err instanceof ApiError)) {
        notify.error(err instanceof Error ? err.message : 'Export failed')
      }
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" className="w-full shrink-0 sm:w-auto">
            Add new
            <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} data-icon="inline-end" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[168px]">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault()
              setUploadOpen(true)
            }}
          >
            Upload spreadsheet
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault()
              setCreateOpen(true)
            }}
          >
            Add lead details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={exportLeads.isPending}
            onSelect={(e) => {
              e.preventDefault()
              void handleExport()
            }}
          >
            {exportLeads.isPending ? 'Exporting…' : 'Export all leads (.xlsx)'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UploadLeadsDialog open={uploadOpen} onOpenChange={setUploadOpen} />
      <CreateLeadDialog open={createOpen} onOpenChange={setCreateOpen} />
    </>
  )
}
