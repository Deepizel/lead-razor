import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  tierCountsToChartData,
  tierDistributionTotal,
} from '@/lib/pipeline-analytics'
import type { TierCounts } from '@/types/api-pipeline'

interface TierDistributionChartProps {
  distribution: TierCounts
}

export function TierDistributionChart({
  distribution,
}: TierDistributionChartProps) {
  const data = tierCountsToChartData(distribution)
  const total = tierDistributionTotal(distribution)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tier distribution</CardTitle>
        <p className="text-xs text-muted-foreground">
          Hot, warm, and cold mix across the pipeline ({total} leads)
        </p>
      </CardHeader>
      <CardContent className="h-[260px] sm:h-[300px]">
        {total === 0 ? (
          <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No leads in this period yet.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="52%"
                outerRadius="78%"
                paddingAngle={2}
              >
                {data.map((entry) => (
                  <Cell key={entry.tier} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'oklch(0.205 0 0)',
                  border: '1px solid oklch(1 0 0 / 10%)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(value, name) => {
                  const n = typeof value === 'number' ? value : Number(value ?? 0)
                  return [
                    `${n} (${total > 0 ? Math.round((n / total) * 100) : 0}%)`,
                    String(name ?? ''),
                  ]
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
