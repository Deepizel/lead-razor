import { DashboardNav } from '@/components/dashboard/DashboardNav'

export function DashboardSidebar() {
  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground md:flex">
      <div className="border-b border-sidebar-border px-4 py-5">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          LeadRazor
        </p>
        <h1 className="mt-1 text-sm font-semibold">AI Lead Qualifier</h1>
      </div>

      <DashboardNav className="flex-1 p-3" />

      <div className="border-t border-sidebar-border p-4 text-[0.625rem] text-muted-foreground">
        AI SDR co-pilot · mock data
      </div>
    </aside>
  )
}
