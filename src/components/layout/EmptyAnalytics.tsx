import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface EmptyAnalyticsProps {
  title: string
  description: string
}

export function EmptyAnalytics({ title, description }: EmptyAnalyticsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="py-10 text-center text-sm text-muted-foreground">
        {description}
      </CardContent>
    </Card>
  )
}
