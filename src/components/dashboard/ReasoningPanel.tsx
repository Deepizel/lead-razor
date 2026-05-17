import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Lead } from '@/types/lead'

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <p className="text-xs text-muted-foreground">None detected</p>
  }
  return (
    <ul className="list-disc space-y-1.5 pl-4 text-xs text-muted-foreground">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

export function ReasoningPanel({ lead }: { lead: Lead }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>AI reasoning</CardTitle>
        <p className="text-xs text-muted-foreground">
          Explainable scoring — every signal is traceable
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="score">
          <TabsList className="grid h-auto w-full grid-cols-3">
            <TabsTrigger value="score" className="flex-1">
              Score
            </TabsTrigger>
            <TabsTrigger value="intent" className="flex-1">
              Intent
            </TabsTrigger>
            <TabsTrigger value="risk" className="flex-1">
              Risks
            </TabsTrigger>
          </TabsList>
          <TabsContent value="score" className="mt-4">
            <BulletList items={lead.reasoning} />
          </TabsContent>
          <TabsContent value="intent" className="mt-4">
            <BulletList items={lead.intentSignals} />
          </TabsContent>
          <TabsContent value="risk" className="mt-4">
            <BulletList items={lead.riskFlags} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
