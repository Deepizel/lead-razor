import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { DashboardNav } from '@/components/dashboard/DashboardNav'
import { useUiStore } from '@/stores/uiStore'

export function MobileNavSheet() {
  const navOpen = useUiStore((s) => s.navOpen)
  const setNavOpen = useUiStore((s) => s.setNavOpen)

  return (
    <Sheet open={navOpen} onOpenChange={setNavOpen}>
      <SheetContent
        side="left"
        className="flex w-[min(100%,280px)] flex-col gap-0 p-0 sm:max-w-xs"
      >
        <SheetHeader className="border-b border-border px-4 py-5 text-left">
          <SheetTitle className="text-sm">LeadRazor</SheetTitle>
          <SheetDescription>AI Lead Qualifier</SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col p-3">
          <DashboardNav onNavigate={() => setNavOpen(false)} />
        </div>
        <p className="border-t border-border p-4 text-[0.625rem] text-muted-foreground">
          AI SDR co-pilot
        </p>
      </SheetContent>
    </Sheet>
  )
}
