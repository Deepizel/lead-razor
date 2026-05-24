import { ApiStatusBanner } from '@/components/layout/ApiStatusBanner'
import { ComposeSendTab } from '@/components/outreach/ComposeSendTab'
import { OutreachConfigBanner } from '@/components/outreach/OutreachConfigBanner'
import { SentEmailsTab } from '@/components/outreach/SentEmailsTab'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEmailsApiMode } from '@/hooks/useEmails'

export default function OutreachPage() {
  const apiMode = useEmailsApiMode()

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Email outreach</h1>
        <p className="text-xs text-muted-foreground">
          Compose and send to leads, then track opens, clicks, and replies across your
          pipeline
        </p>
      </div>

      <ApiStatusBanner />
      <OutreachConfigBanner />

      {!apiMode && (
        <p className="text-sm text-muted-foreground">
          Configure <code className="rounded bg-muted px-1">VITE_API_BASE_URL</code> and
          outreach email env on the backend to use the sending hub.
        </p>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Outreach hub</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="compose">
            <TabsList>
              <TabsTrigger value="compose">Compose / Send</TabsTrigger>
              <TabsTrigger value="sent">Sent emails</TabsTrigger>
            </TabsList>
            <TabsContent value="compose" className="mt-4">
              <ComposeSendTab />
            </TabsContent>
            <TabsContent value="sent" className="mt-4">
              <SentEmailsTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
