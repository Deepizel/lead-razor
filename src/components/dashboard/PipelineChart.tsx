import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { PipelineStage } from '@/types/lead'

export function PipelineChart({ data }: { data: PipelineStage[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pipeline funnel</CardTitle>
        <p className="text-xs text-muted-foreground">
          New → Qualified → Contacted → Meeting → Closed
        </p>
      </CardHeader>
      <CardContent className="h-[260px] sm:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 4, right: 8, top: 4, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 8%)" />
            <XAxis
              type="number"
              tick={{ fill: 'oklch(0.708 0 0)', fontSize: 10 }}
            />
            <YAxis
              type="category"
              dataKey="stage"
              width={80}
              tick={{ fill: 'oklch(0.708 0 0)', fontSize: 10 }}
            />
            <Tooltip
              contentStyle={{
                background: 'oklch(0.205 0 0)',
                border: '1px solid oklch(1 0 0 / 10%)',
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Bar dataKey="count" fill="oklch(0.488 0.243 264.376)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
