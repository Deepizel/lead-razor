import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Lead } from '@/types/lead'

interface ActionButtonGroupProps {
  lead: Lead
}

export function ActionButtonGroup({ lead }: ActionButtonGroupProps) {
  const [draft, setDraft] = useState(lead.draftEmail)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Actions</CardTitle>
        <p className="text-xs text-muted-foreground">
          AI-drafted — edit before sending
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="draft-email">Draft email</Label>
          <Textarea
            id="draft-email"
            className="min-h-[180px] resize-y"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
        </div>
        <Button className="w-full">Send email</Button>
        <Button variant="outline" className="w-full">
          Generate follow-up
        </Button>
        <Button variant="secondary" className="w-full">
          Push to CRM
        </Button>
        <Button variant="ghost" className="w-full">
          Schedule meeting
        </Button>
      </CardContent>
    </Card>
  )
}
