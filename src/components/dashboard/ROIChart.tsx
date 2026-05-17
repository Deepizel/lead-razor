import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ROIMetric } from '@/types/lead'

export function ROIChart({ data }: { data: ROIMetric[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance over time</CardTitle>
        <p className="text-xs text-muted-foreground">
          Revenue, conversion, and lead quality trends
        </p>
      </CardHeader>
      <CardContent className="h-[260px] sm:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 8%)" />
            <XAxis dataKey="month" tick={{ fill: 'oklch(0.708 0 0)', fontSize: 11 }} />
            <YAxis yAxisId="left" tick={{ fill: 'oklch(0.708 0 0)', fontSize: 11 }} />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: 'oklch(0.708 0 0)', fontSize: 11 }}
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
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              name="Revenue ($)"
              stroke="oklch(0.696 0.17 162.48)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="conversionRate"
              name="Conversion %"
              stroke="oklch(0.488 0.243 264.376)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="emailToMeeting"
              name="Email → Meeting %"
              stroke="oklch(0.769 0.188 70.08)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="avgScore"
              name="Avg score"
              stroke="oklch(0.708 0 0)"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
