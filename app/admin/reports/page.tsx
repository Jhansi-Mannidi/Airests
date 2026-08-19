'use client'

import { useState } from 'react'
import { AdminTopbar } from '@/components/admin/admin-topbar'
import { staff } from '@/lib/mock-data'
import { Download, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

const reportTabs = ['Daily Sales', 'Tax Summary', 'Tips', 'Voids & Refunds', 'Server Performance', 'X Report', 'Z Report']

const kpis = [
  { label: 'Gross Sales', value: '$23,908.45' },
  { label: 'Net Sales', value: '$21,204.10' },
  { label: 'Tax Collected', value: '$1,872.30' },
  { label: 'Tips', value: '$3,614.88' },
  { label: 'Voids', value: '$284.50' },
]

// Deterministic, always-positive per-server figures derived from a simple
// spread curve rather than a linear decrement (which would go negative
// once the roster grows past a handful of servers/bartenders).
const serverRows = staff
  .filter((s) => s.role === 'Server' || s.role === 'Bartender')
  .map((s, i) => {
    const wave = Math.abs(Math.sin(i * 1.7))
    return {
      name: s.name,
      orders: Math.round(14 + wave * 26),
      sales: Math.round((620 + wave * 1450) * 100) / 100,
      tips: Math.round((85 + wave * 260) * 100) / 100,
      avgCheck: Math.round((32 + wave * 26) * 10) / 10,
      voids: i % 4 === 1 ? 2 : i % 5 === 0 ? 1 : 0,
    }
  })

const recentTransactions = [
  { id: '#4479', time: '12:11 PM', server: 'Nina Osei', type: 'Takeout', total: 18.5, tender: 'Card' },
  { id: '#4478', time: '12:09 PM', server: 'Devon Shaw', type: 'Bar Tab', total: 33.0, tender: 'Card' },
  { id: '#4477', time: '12:04 PM', server: 'Maria Alvarez', type: 'Dine-In', total: 148.75, tender: 'Split' },
  { id: '#4476', time: '11:58 PM', server: 'Chloe Dawson', type: 'Dine-In', total: 41.2, tender: 'Card' },
  { id: '#4475', time: '11:49 AM', server: 'Jordan Pierce', type: 'Delivery', total: 27.4, tender: 'Online' },
  { id: '#4474', time: '11:47 AM', server: 'Chloe Dawson', type: 'Takeout', total: 27.5, tender: 'Cash' },
  { id: '#4473', time: '11:41 AM', server: 'Maria Alvarez', type: 'Dine-In', total: 212.4, tender: 'Card' },
]

const dateRanges = ['Today', 'Yesterday', 'Last 7 Days'] as const
const rangeFactor: Record<(typeof dateRanges)[number], number> = {
  Today: 1,
  Yesterday: 0.86,
  'Last 7 Days': 6.4,
}
const rangeLabel: Record<(typeof dateRanges)[number], string> = {
  Today: 'Today — Aug 19, 2026',
  Yesterday: 'Yesterday — Aug 18, 2026',
  'Last 7 Days': 'Aug 13 – Aug 19, 2026',
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('Daily Sales')
  const [range, setRange] = useState<(typeof dateRanges)[number]>('Today')
  const factor = rangeFactor[range]

  const scaledRows = serverRows.map((row) => ({
    ...row,
    orders: Math.round(row.orders * factor),
    sales: Math.round(row.sales * factor * 100) / 100,
    tips: Math.round(row.tips * factor * 100) / 100,
    voids: Math.round(row.voids * (range === 'Last 7 Days' ? 3 : 1)),
  }))

  const visibleRows =
    activeTab === 'Voids & Refunds'
      ? scaledRows.filter((r) => r.voids > 0)
      : activeTab === 'Tips'
        ? [...scaledRows].sort((a, b) => b.tips - a.tips)
        : scaledRows

  const gross = visibleRows.reduce((s, r) => s + r.sales, 0)
  const tips = visibleRows.reduce((s, r) => s + r.tips, 0)
  const voids = visibleRows.reduce((s, r) => s + r.voids * 18.5, 0)
  const tax = gross * 0.0825
  const net = gross - tax

  const tabKpis =
    activeTab === 'Tax Summary'
      ? [
          { label: 'Taxable Sales', value: `$${gross.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
          { label: 'Tax Collected', value: `$${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
          { label: 'Exempt Sales', value: '$412.00' },
          { label: 'Rate', value: '8.25%' },
          { label: 'Locations', value: '5' },
        ]
      : activeTab === 'Tips'
        ? [
            { label: 'Tips', value: `$${tips.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
            { label: 'Tip % of Sales', value: `${((tips / Math.max(gross, 1)) * 100).toFixed(1)}%` },
            { label: 'Servers', value: String(visibleRows.length) },
            { label: 'Avg Tip / Server', value: `$${(tips / Math.max(visibleRows.length, 1)).toFixed(2)}` },
            { label: 'Cash Tips', value: `$${(tips * 0.22).toFixed(2)}` },
          ]
        : activeTab === 'Voids & Refunds'
          ? [
              { label: 'Void Count', value: String(visibleRows.reduce((s, r) => s + r.voids, 0)) },
              { label: 'Void Amount', value: `$${voids.toFixed(2)}` },
              { label: 'Refunds', value: '$96.40' },
              { label: 'Comps', value: '$42.00' },
              { label: 'Void Rate', value: '1.2%' },
            ]
          : [
              { label: 'Gross Sales', value: `$${gross.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
              { label: 'Net Sales', value: `$${net.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
              { label: 'Tax Collected', value: `$${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
              { label: 'Tips', value: `$${tips.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
              { label: 'Voids', value: `$${voids.toFixed(2)}` },
            ]

  const transactions = recentTransactions.filter((t) => {
    if (activeTab === 'Voids & Refunds') return t.tender === 'Split' || t.type === 'Delivery'
    if (activeTab === 'Tips') return t.type === 'Dine-In' || t.type === 'Bar Tab'
    return true
  })

  return (
    <>
      <AdminTopbar title="Reports" />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="w-full space-y-6">
          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto rounded-lg bg-muted p-1">
            {reportTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  activeTab === tab ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Date range + export */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-1.5">
              {dateRanges.map((option) => (
                <button
                  key={option}
                  onClick={() => setRange(option)}
                  className={cn(
                    'flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors',
                    range === option ? 'border-primary bg-accent text-accent-foreground' : 'border-border bg-card text-foreground hover:bg-secondary',
                  )}
                >
                  <Calendar className="size-4 text-muted-foreground" />
                  {option === 'Today' ? rangeLabel[option] : option}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary">
                <Download className="size-4" />
                Export CSV
              </button>
              <button className="flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary">
                <Download className="size-4" />
                Export PDF
              </button>
            </div>
          </div>

          {/* KPI row */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {tabKpis.map((k) => (
              <div key={k.label} className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">{k.label}</p>
                <p className="mt-1 font-mono text-xl font-semibold tabular-nums text-foreground">{k.value}</p>
              </div>
            ))}
          </div>

          {/* Data table */}
          <section className="rounded-xl border border-border bg-card">
            <div className="border-b border-border p-4">
              <h2 className="text-sm font-semibold text-foreground">{activeTab} — {rangeLabel[range]}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="px-4 py-2.5 font-medium">Server</th>
                    <th className="px-4 py-2.5 text-right font-medium">Orders</th>
                    <th className="px-4 py-2.5 text-right font-medium">Sales</th>
                    <th className="px-4 py-2.5 text-right font-medium">Tips</th>
                    <th className="px-4 py-2.5 text-right font-medium">Avg. Check</th>
                    <th className="px-4 py-2.5 text-right font-medium">Voids</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((row, i) => (
                    <tr key={row.name} className={cn('border-b border-border/60 last:border-0', i % 2 === 1 && 'bg-muted/30 dark:bg-transparent')}>
                      <td className="px-4 py-2.5 font-medium text-foreground">{row.name}</td>
                      <td className="px-4 py-2.5 text-right font-mono tabular-nums text-foreground">{row.orders}</td>
                      <td className="px-4 py-2.5 text-right font-mono tabular-nums text-foreground">${row.sales.toFixed(2)}</td>
                      <td className="px-4 py-2.5 text-right font-mono tabular-nums text-foreground">${row.tips.toFixed(2)}</td>
                      <td className="px-4 py-2.5 text-right font-mono tabular-nums text-foreground">${row.avgCheck.toFixed(2)}</td>
                      <td className={cn('px-4 py-2.5 text-right font-mono tabular-nums', row.voids > 0 ? 'text-danger' : 'text-muted-foreground')}>
                        {row.voids}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-border font-medium text-foreground">
                    <td className="px-4 py-2.5">Total</td>
                    <td className="px-4 py-2.5 text-right font-mono tabular-nums">{visibleRows.reduce((s, r) => s + r.orders, 0)}</td>
                    <td className="px-4 py-2.5 text-right font-mono tabular-nums">
                      ${visibleRows.reduce((s, r) => s + r.sales, 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono tabular-nums">
                      ${visibleRows.reduce((s, r) => s + r.tips, 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-2.5 text-right">—</td>
                    <td className="px-4 py-2.5 text-right font-mono tabular-nums">{visibleRows.reduce((s, r) => s + r.voids, 0)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          {/* Recent transactions */}
          <section className="rounded-xl border border-border bg-card">
            <div className="border-b border-border p-4">
              <h2 className="text-sm font-semibold text-foreground">Recent Transactions</h2>
              <p className="text-xs text-muted-foreground">Live feed of the most recent closed checks across the register</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="px-4 py-2.5 font-medium">Order</th>
                    <th className="hidden px-4 py-2.5 font-medium sm:table-cell">Time</th>
                    <th className="px-4 py-2.5 font-medium">Server</th>
                    <th className="hidden px-4 py-2.5 font-medium md:table-cell">Type</th>
                    <th className="px-4 py-2.5 font-medium">Tender</th>
                    <th className="px-4 py-2.5 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id} className="border-b border-border/60 last:border-0">
                      <td className="px-4 py-2.5 font-medium text-foreground">{t.id}</td>
                      <td className="hidden px-4 py-2.5 text-muted-foreground sm:table-cell">{t.time}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{t.server}</td>
                      <td className="hidden px-4 py-2.5 text-muted-foreground md:table-cell">{t.type}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{t.tender}</td>
                      <td className="px-4 py-2.5 text-right font-mono tabular-nums text-foreground">${t.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
