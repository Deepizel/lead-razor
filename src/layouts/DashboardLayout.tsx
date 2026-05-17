import { Outlet } from 'react-router-dom'
import { ChatPanel } from '@/components/dashboard/ChatPanel'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { MobileNavSheet } from '@/components/dashboard/MobileNavSheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useUiStore } from '@/stores/uiStore'

export function DashboardLayout() {
  const toggleChat = useUiStore((s) => s.toggleChat)
  const setNavOpen = useUiStore((s) => s.setNavOpen)

  return (
    <div className="flex min-h-svh bg-background">
      <DashboardSidebar />
      <MobileNavSheet />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-3 sm:h-12 sm:px-4 md:px-6">
          <Button
            variant="outline"
            size="icon-sm"
            className="md:hidden"
            onClick={() => setNavOpen(true)}
            aria-label="Open navigation menu"
          >
            <MenuIcon />
          </Button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium sm:text-xs sm:font-normal sm:text-muted-foreground">
              <span className="md:hidden">LeadRazor</span>
              <span className="hidden md:inline">
                AI decision layer on your lead pipeline
              </span>
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={toggleChat}
          >
            <span className="hidden sm:inline">Open agent chat</span>
            <span className="sm:hidden">Chat</span>
          </Button>
        </header>
        <Separator className="hidden sm:block" />
        <main className="flex-1 overflow-auto p-4 pb-20 sm:p-5 sm:pb-5 md:p-6 md:pb-6">
          <Outlet />
        </main>
      </div>
      <ChatPanel />
    </div>
  )
}

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}
