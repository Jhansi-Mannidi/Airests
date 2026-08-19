import { AdminTopbar } from '@/components/admin/admin-topbar'
import { KpiCard } from '@/components/admin/kpi-card'
import { SalesTrendChart } from '@/components/admin/sales-trend-chart'
import { ConnectivityChip } from '@/components/shared/status-pill'
import { brand, failedEvents, topItems } from '@/lib/mock-data'
import { DollarSign, ShoppingBag, TrendingUp, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboardPage() {
  const totalSales = brand.locations.reduce((sum, l) => sum + l.salesToday, 0)
  const totalOrders = brand.locations.reduce((sum, l) => sum + l.orders, 0)

  return (
    <>
      <AdminTopbar title="Dashboard" />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="w-full space-y-6">
          {/* Top KPI row */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KpiCard label="Sales Today (All Locations)" value={`$${totalSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} delta="+8.2% vs. last Tue" icon={DollarSign} />
            <KpiCard label="Orders Today" value={totalOrders.toLocaleString()} delta="+3.4% vs. last Tue" icon={ShoppingBag} />
            <KpiCard label="Avg. Check" value={`$${(totalSales / totalOrders).toFixed(2)}`} delta="+1.1%" icon={TrendingUp} />
            <KpiCard label="Open Exceptions" value={String(failedEvents.length)} delta="Needs review" deltaTone="danger" icon={AlertTriangle} />
          </div>

          {/* Location cards */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-sans text-sm font-semibold text-foreground">Locations</h2>
              <Link href="/admin/locations" className="text-sm font-medium text-primary hover:underline">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {brand.locations.map((loc) => (
                <div key={loc.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-tight text-foreground">{loc.name}</p>
                    <ConnectivityChip state={loc.connectivity} />
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{loc.city}</p>
                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <p className="font-mono text-lg font-semibold tabular-nums text-foreground">
                        ${loc.salesToday.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-muted-foreground">{loc.orders} orders</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Sales trend */}
            <div className="rounded-xl border border-border bg-card p-4 lg:col-span-2">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="font-sans text-sm font-semibold text-foreground">Sales Trend — Last 7 Days</h2>
              </div>
              <SalesTrendChart />
            </div>

            {/* Top items */}
            <div className="rounded-xl border border-border bg-card p-4">
              <h2 className="mb-3 font-sans text-sm font-semibold text-foreground">Top Items This Week</h2>
              <ul className="space-y-3">
                {topItems.map((item, i) => (
                  <li key={item.name} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.qty} sold</p>
                      </div>
                    </div>
                    <span className="shrink-0 font-mono text-sm font-medium tabular-nums text-foreground">
                      ${item.sales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Orders needing attention */}
          <section className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="font-sans text-sm font-semibold text-foreground">Orders Needing Attention</h2>
              <Link href="/admin/integrations" className="text-sm font-medium text-primary hover:underline">
                Open console
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="px-4 py-2.5 font-medium">Type</th>
                    <th className="px-4 py-2.5 font-medium">Timestamp</th>
                    <th className="px-4 py-2.5 font-medium">Reason</th>
                    <th className="px-4 py-2.5 font-medium">Retries</th>
                  </tr>
                </thead>
                <tbody>
                  {failedEvents.slice(0, 3).map((ev) => (
                    <tr key={ev.id} className="border-b border-border/60 last:border-0">
                      <td className="px-4 py-2.5 font-medium text-foreground">{ev.type}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{ev.timestamp}</td>
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
