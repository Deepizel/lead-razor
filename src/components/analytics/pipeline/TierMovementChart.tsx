import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPeriodLabel } from '@/lib/pipeline-analytics'
import type { PipelineTierMovementPeriod } from '@/types/api-pipeline'

interface TierMovementChartProps {
  movement: PipelineTierMovementPeriod[]
  days: number
}

export function TierMovementChart({ movement, days }: TierMovementChartProps) {
  const chartData = movement.map((row) => {
    const transitionTotal = Object.values(row.transitions).reduce(
      (sum, n) => sum + n,
      0,
    )
    return {
      period: formatPeriodLabel(row.periodStart),
      netHotDelta: row.netHotDelta,
      transitions: transitionTotal,
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tier movement</CardTitle>
        <p className="text-xs text-muted-foreground">
          Net hot-tier change and tier transitions over the last {days} days
        </p>
      </CardHeader>
      <CardContent className="h-[260px] sm:h-[300px]">
        {chartData.length === 0 ? (
          <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No tier changes recorded in this window.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 8%)" />
              <XAxis
                dataKey="period"
                tick={{ fill: 'oklch(0.708 0 0)', fontSize: 10 }}
              />
              <YAxis
                yAxisId="left"
                tick={{ fill: 'oklch(0.708 0 0)', fontSize: 10 }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
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
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar
                yAxisId="right"
                dataKey="transitions"
                name="Tier transitions"
                fill="oklch(0.488 0.243 264.376 / 60%)"
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="netHotDelta"
                name="Net hot Δ"
                stroke="oklch(0.696 0.17 162.48)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
