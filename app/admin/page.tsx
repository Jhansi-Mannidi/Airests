'use client'

import { AdminTopbar } from '@/components/admin/admin-topbar'
import { KpiCard } from '@/components/admin/kpi-card'
import { SalesTrendChart } from '@/components/admin/sales-trend-chart'
import { ConnectivityChip } from '@/components/shared/status-pill'
import { brand, failedEvents, topItems } from '@/lib/mock-data'
import { formatUsd, formatUsNumber } from '@/lib/us-format'
import { DollarSign, ShoppingBag, TrendingUp, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { Stagger, StaggerItem } from '@/components/motion/primitives'

function locationShortName(name: string) {
  const parts = name.split('—')
  return parts[1]?.trim() ?? name
}

export default function AdminDashboardPage() {
  const totalSales = brand.locations.reduce((sum, l) => sum + l.salesToday, 0)
  const totalOrders = brand.locations.reduce((sum, l) => sum + l.orders, 0)

  return (
    <>
      <AdminTopbar title="Dashboard" />
      <main className="flex-1 overflow-y-auto p-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:p-6">
        <div className="w-full space-y-5 md:space-y-6">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            <KpiCard
              label="Sales Today"
              value={formatUsd(totalSales)}
              delta="+8.2% vs. last Tue"
              icon={DollarSign}
            />
            <KpiCard
              label="Orders Today"
              value={formatUsNumber(totalOrders)}
              delta="+3.4% vs. last Tue"
              icon={ShoppingBag}
            />
            <KpiCard
              label="Avg. Check"
              value={formatUsd(totalSales / totalOrders)}
              delta="+1.1%"
              icon={TrendingUp}
            />
            <KpiCard
              label="Open Exceptions"
              value={String(failedEvents.length)}
              delta="Needs review"
              deltaTone="danger"
              icon={AlertTriangle}
            />
          </div>

          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="font-sans text-sm font-semibold text-foreground">Locations</h2>
              <Link
                href="/admin/locations"
                className="inline-flex h-9 items-center text-sm font-medium text-primary hover:underline"
              >
                View all
              </Link>
            </div>
            <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5" delay={0.05}>
              {brand.locations.map((loc) => (
                <StaggerItem key={loc.id} hover>
                  <div className="h-full rounded-2xl border border-border bg-card p-4 shadow-surface hover:shadow-hover">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold leading-snug text-foreground sm:hidden">
                          {locationShortName(loc.name)}
                        </p>
                        <p className="hidden text-sm font-medium leading-tight text-foreground sm:block">{loc.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{loc.city}</p>
                      </div>
                      <ConnectivityChip state={loc.connectivity} className="shrink-0" />
                    </div>
                    <div className="mt-3 flex items-baseline justify-between gap-3">
                      <p className="font-mono text-lg font-semibold tabular-nums text-foreground">
                        {formatUsd(loc.salesToday)}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatUsNumber(loc.orders)} orders</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </section>

          <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-surface lg:col-span-2">
              <div className="mb-2">
                <h2 className="font-sans text-sm font-semibold text-foreground">Sales Trend</h2>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </div>
              <SalesTrendChart />
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 shadow-surface">
              <h2 className="mb-3 font-sans text-sm font-semibold text-foreground">Top Items This Week</h2>
              <ul className="space-y-3">
                {topItems.map((item, i) => (
                  <li key={item.name} className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{formatUsNumber(item.qty)} sold</p>
                      </div>
                    </div>
                    <span className="shrink-0 font-mono text-sm font-medium tabular-nums text-foreground">
                      {formatUsd(item.sales)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <section className="rounded-2xl border border-border bg-card shadow-surface">
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
              <h2 className="min-w-0 font-sans text-sm font-semibold leading-snug text-foreground">
                Orders Needing Attention
              </h2>
              <Link
                href="/admin/integrations"
                className="inline-flex h-9 shrink-0 items-center text-sm font-medium text-primary hover:underline"
              >
                Open console
              </Link>
            </div>

            <ul className="divide-y divide-border md:hidden">
              {failedEvents.slice(0, 3).map((ev) => (
                <li key={ev.id} className="px-4 py-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 text-sm font-semibold leading-snug text-foreground">{ev.type}</p>
                    <p className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">{ev.retries} retries</p>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{ev.reason}</p>
                  <p className="mt-1.5 text-[11px] text-muted-foreground">{ev.timestamp}</p>
                </li>
              ))}
            </ul>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="whitespace-nowrap px-4 py-2.5 font-medium">Type</th>
                    <th className="whitespace-nowrap px-4 py-2.5 font-medium">Timestamp</th>
                    <th className="whitespace-nowrap px-4 py-2.5 font-medium">Reason</th>
                    <th className="whitespace-nowrap px-4 py-2.5 font-medium">Retries</th>
                  </tr>
                </thead>
                <tbody>
                  {failedEvents.slice(0, 3).map((ev) => (
                    <tr key={ev.id} className="border-b border-border/60 last:border-0">
                      <td className="whitespace-nowrap px-4 py-2.5 font-medium text-foreground">{ev.type}</td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-muted-foreground">{ev.timestamp}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{ev.reason}</td>
                      <td className="px-4 py-2.5 font-mono tabular-nums text-foreground">{ev.retries}</td>
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
