import { useState } from 'react'
import { UploadLeadsDialog } from '@/components/dashboard/UploadLeadsDialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowDown01Icon } from '@hugeicons/core-free-icons'

export function AddLeadMenu() {
  const [uploadOpen, setUploadOpen] = useState(false)

  const handleImport = () => {
    console.info('Import leads — not yet wired to API')
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
      <DropdownMenuContent align="end" className="min-w-[140px]">
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault()
            setUploadOpen(true)
          }}
        >
          Upload
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleImport}>Import</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <UploadLeadsDialog open={uploadOpen} onOpenChange={setUploadOpen} />
    </>
  )
}
