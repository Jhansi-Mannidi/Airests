'use client'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { salesTrend } from '@/lib/mock-data'

const chartConfig: ChartConfig = {
  sales: { label: 'Sales', color: 'var(--chart-1)' },
}

export function SalesTrendChart() {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <AreaChart data={salesTrend} margin={{ left: -16, right: 8, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
          tickFormatter={(v) => `$${v / 1000}k`}
          width={44}
        />
        <ChartTooltip
          content={<ChartTooltipContent formatter={(value) => `$${Number(value).toLocaleString()}`} />}
        />
        <Area dataKey="sales" type="monotone" stroke="var(--chart-1)" strokeWidth={2} fill="url(#salesFill)" />
      </AreaChart>
    </ChartContainer>
  )
}
