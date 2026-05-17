import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Metric {
  label: string
  value: string
  hint?: string
}

export function MetricCards({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label} size="sm">
          <CardHeader className="pb-0">
            <CardTitle className="text-xs font-normal text-muted-foreground">
              {metric.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold tracking-tight sm:text-2xl">
              {metric.value}
            </p>
            {metric.hint && (
              <p className="mt-1 text-[0.625rem] text-muted-foreground">{metric.hint}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
