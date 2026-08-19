'use client'

import * as React from 'react'
import Link from 'next/link'
import { UtensilsCrossed, ShoppingBag, Store, Bike, Timer } from 'lucide-react'
import { PosTopBar, OfflineBanner } from '@/components/pos/pos-topbar'
import { openChecks } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const orderTypes = [
  { label: 'Dine-In', icon: UtensilsCrossed, href: '/pos/floor-plan', desc: 'Seat guests at a table' },
  { label: 'Takeout', icon: ShoppingBag, href: '/pos/order?type=takeout', desc: 'Order to go' },
  { label: 'Pickup', icon: Store, href: '/pos/order?type=pickup', desc: 'Call-ahead pickup' },
  { label: 'Delivery', icon: Bike, href: '/pos/order?type=delivery', desc: 'Third-party or in-house' },
]

export default function PosHomePage() {
  const [showOffline, setShowOffline] = React.useState(false)
  const [checkFilter, setCheckFilter] = React.useState('All')

  const checkTypes = ['All', ...Array.from(new Set(openChecks.map((c) => c.type)))]
  const visibleChecks = openChecks.filter((c) => checkFilter === 'All' || c.type === checkFilter)

  return (
    <div className="flex h-dvh flex-col bg-background font-sans">
      <PosTopBar
        connectivity={showOffline ? 'offline' : 'online'}
        pendingSync={showOffline ? 3 : undefined}
        right={
          <button
            onClick={() => setShowOffline((v) => !v)}
            className="hidden rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-secondary md:inline-block"
          >
            {showOffline ? 'Simulate: Online' : 'Simulate: Offline'}
          </button>
        }
      />
      {showOffline && <OfflineBanner />}

      <main className="flex flex-1 flex-col gap-6 overflow-y-auto p-4 md:flex-row md:gap-8 md:p-8">
        <section className="flex-1">
          <div className="mb-6">
            <h1 className="font-sans text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Start an Order</h1>
            <p className="mt-1 text-sm text-muted-foreground">Register 2 · Riverside Grill — Downtown, Austin TX</p>
          </div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Order Type</h2>
          <div className="grid grid-cols-2 gap-4">
            {orderTypes.map(({ label, icon: Icon, href, desc }) => (
              <Link
                key={label}
                href={href}
                className="group flex flex-col items-start gap-2 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/50 hover:shadow-elevated sm:gap-3 sm:p-6"
              >
                <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Icon className="size-6" />
                </span>
                <div>
                  <p className="text-lg font-semibold text-foreground">{label}</p>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="w-full shrink-0 md:w-[360px]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Open Checks</h2>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
              {visibleChecks.length} active
            </span>
          </div>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {checkTypes.map((type) => (
              <button
                key={type}
                onClick={() => setCheckFilter(type)}
                className={cn(
                  'rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
                  checkFilter === type ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground',
                )}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            {visibleChecks.map((chk) => {
              const href = chk.tableId
                ? `/pos/order?table=${chk.tableId}&type=${chk.orderType}`
                : `/pos/order?type=${chk.orderType}`
              return (
              <Link
                key={chk.id}
                href={href}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/50"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{chk.label}</p>
                  <p className="text-xs text-muted-foreground">{chk.server} · {chk.type}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-mono text-sm font-semibold tabular-nums text-foreground">${chk.total.toFixed(2)}</span>
                  <span
                    className={cn(
                      'flex items-center gap-1 text-xs',
                      Number.parseInt(chk.elapsed) >= 45 ? 'text-danger' : 'text-muted-foreground',
                    )}
                  >
                    <Timer className="size-3" />
                    {chk.elapsed}
                  </span>
                </div>
              </Link>
              )
            })}
            {visibleChecks.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">No {checkFilter.toLowerCase()} checks open.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
