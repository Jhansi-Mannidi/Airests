'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  UtensilsCrossed,
  ShoppingBag,
  Store,
  Bike,
  Timer,
  Banknote,
  ArrowLeftRight,
  Clock3,
  Printer,
  ChevronRight,
  Users,
  AlertTriangle,
  MapPin,
  Search,
} from 'lucide-react'
import { PosTopBar, OfflineBanner } from '@/components/pos/pos-topbar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { brand, openChecks } from '@/lib/mock-data'
import { useLiveTables } from '@/lib/table-status'
import { ageMinutes, labelForOnlineOrder, useOnlineOrders } from '@/lib/online-orders'
import { formatUsd } from '@/lib/us-format'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Stagger, StaggerItem } from '@/components/motion/primitives'

const orderTypes = [
  { label: 'Takeout', icon: ShoppingBag, href: '/pos/order?type=takeout', desc: 'Guest is already at the counter' },
  { label: 'Pickup', icon: Store, href: '/pos/order?type=pickup', desc: 'Named bag, call-ahead ticket' },
  { label: 'Delivery', icon: Bike, href: '/pos/order?type=delivery', desc: 'In-house driver or third-party' },
]

const shiftOps = [
  { href: '/pos/cash-drawer', label: 'Cash Drawer', hint: 'Paid-in / paid-out', icon: Banknote },
  { href: '/pos/transfer', label: 'Transfers', hint: 'Move or merge checks', icon: ArrowLeftRight },
  { href: '/pos/clock', label: 'Time Clock', hint: 'Punch in or out', icon: Clock3 },
  { href: '/pos/print', label: 'Print / KOT', hint: 'Receipts and tickets', icon: Printer },
]

function elapsedMinutes(elapsed: string) {
  const value = Number.parseInt(elapsed, 10)
  return Number.isFinite(value) ? value : 0
}

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function periodLabel() {
  const hour = new Date().getHours()
  if (hour < 11) return 'Breakfast'
  if (hour < 15) return 'Lunch'
  if (hour < 17) return 'Afternoon'
  return 'Dinner'
}

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
}

export default function PosHomePage() {
  const liveTables = useLiveTables()
  const { orders: onlineOrders, now } = useOnlineOrders()
  const seenOnlineIds = React.useRef<Set<string> | null>(null)
  const [showOffline, setShowOffline] = React.useState(false)
  const [checkFilter, setCheckFilter] = React.useState('All')
  const [checkQuery, setCheckQuery] = React.useState('')
  const [hello, setHello] = React.useState('Hello')
  const [period, setPeriod] = React.useState('Service')

  React.useEffect(() => {
    setHello(greeting())
    setPeriod(periodLabel())
  }, [])

  React.useEffect(() => {
    const ids = new Set(onlineOrders.map((order) => order.id))
    if (seenOnlineIds.current === null) {
      seenOnlineIds.current = ids
      return
    }
    for (const order of onlineOrders) {
      if (!seenOnlineIds.current.has(order.id)) {
        toast.success(`Online order ${order.orderNumber}`, {
          description: `${labelForOnlineOrder(order)} · sent to kitchen`,
        })
      }
    }
    seenOnlineIds.current = ids
  }, [onlineOrders])

  const onlineChecks = onlineOrders.map((order) => ({
    id: order.id,
    label: `${order.fulfillment === 'delivery' ? 'Delivery' : order.tableNumber ? `Table ${order.tableNumber}` : 'Pickup'} ${order.orderNumber}`,
    tableId: null as string | null,
    orderType: (order.tableNumber ? 'dine-in' : order.fulfillment === 'delivery' ? 'delivery' : 'pickup') as const,
    server: order.guestName || 'Online',
    elapsed: `${ageMinutes(order.placedAt, now)}m`,
    total: order.total,
    type: 'Online',
    href: `/pos/online/${order.id}`,
  }))
  const allChecks = [...onlineChecks, ...openChecks]
  const checkTypes = ['All', ...Array.from(new Set(allChecks.map((c) => c.type)))]
  const visibleChecks = allChecks
    .filter((c) => checkFilter === 'All' || c.type === checkFilter)
    .filter((c) => {
      const q = checkQuery.trim().toLowerCase()
      if (!q) return true
      return `${c.label} ${c.server} ${c.type} ${c.id}`.toLowerCase().includes(q)
    })
    .slice()
    .sort((a, b) => elapsedMinutes(b.elapsed) - elapsedMinutes(a.elapsed))

  const openTableCount = liveTables.filter((t) => t.status === 'open').length
  const agingCount = allChecks.filter((c) => elapsedMinutes(c.elapsed) >= 30).length
  const openTotal = allChecks.reduce((sum, c) => sum + c.total, 0)
  const downtown = brand.locations[0]
  const takeoutOpen = openChecks.filter((c) => c.type === 'Takeout').length
  const pickupOpen = openChecks.filter((c) => c.type === 'Pickup').length
  const onlineOpen = onlineOrders.filter((order) => order.status === 'in-kitchen').length

  const orderMeta: Record<string, string> = {
    Takeout: takeoutOpen === 1 ? '1 check open' : `${takeoutOpen} checks open`,
    Pickup: pickupOpen === 1 ? '1 waiting' : `${pickupOpen} waiting`,
    Delivery: 'No live runs',
  }

  return (
    <div className="pos-canvas flex h-dvh flex-col font-sans">
      <PosTopBar
        connectivity={showOffline ? 'offline' : 'online'}
        pendingSync={showOffline ? 3 : undefined}
        right={
          <Button
            variant="ghost"
            size="sm"
            className="hidden h-8 text-xs text-muted-foreground sm:inline-flex"
            onClick={() => setShowOffline((v) => !v)}
          >
            {showOffline ? 'Back online' : 'Simulate offline'}
          </Button>
        }
      />
      {showOffline && <OfflineBanner />}

      <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 md:flex-row md:gap-6 md:overflow-hidden md:p-6">
        <section className="flex w-full min-w-0 flex-col gap-4 md:min-h-0 md:flex-1 md:gap-5 md:overflow-y-auto">
          <header className="shrink-0">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/80 px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-sm">
                <span className="size-1.5 rounded-full bg-success" />
                {period} service
                <span className="text-border">|</span>
                <MapPin className="size-3" />
                Downtown
              </div>
              <h1 className="font-sans text-2xl font-semibold tracking-[-0.03em] text-foreground md:text-[2rem]">
                {hello}, Maria
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {brand.registerName}
                <span className="mx-1.5 text-border">·</span>
                Riverside Grill — Downtown
              </p>
            </div>
          </header>

          <div className="shrink-0 overflow-hidden rounded-2xl bg-card shadow-surface ring-1 ring-border/70">
            <div className="grid grid-cols-2 divide-border sm:grid-cols-4 sm:divide-x">
              <Kpi label="Location sales" value={formatUsd(downtown.salesToday, 0)} hint={`${downtown.orders} orders today`} />
              <Kpi label="Open checks" value={String(allChecks.length)} hint={`$${openTotal.toFixed(0)} on the floor`} />
              <Kpi label="Tables open" value={String(openTableCount)} hint={`${liveTables.length} on the floor plan`} />
              <Kpi label="Aging" value={String(agingCount)} hint="Open longer than 30 min" tone={agingCount > 0 ? 'warning' : 'default'} />
            </div>
          </div>

          <div className="relative z-0 shrink-0">
            <div className="mb-3">
              <h2 className="text-sm font-semibold tracking-tight text-foreground">Start an order</h2>
              <p className="text-xs text-muted-foreground">Choose how the guest is served</p>
            </div>

            <div className="relative isolate grid grid-cols-1 gap-3 overflow-hidden lg:grid-cols-[1.2fr_1fr] lg:gap-4">
              <Link
                href="/pos/floor-plan"
                className="pos-ink group relative z-0 flex flex-col justify-between overflow-hidden rounded-2xl p-4 shadow-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-6 md:transition-transform md:duration-200 md:hover:-translate-y-0.5 lg:min-h-[22rem] lg:p-7"
              >
                <div className="pointer-events-none absolute -right-8 -top-10 size-44 rounded-full bg-primary/25 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-16 left-10 size-52 rounded-full bg-primary/10 blur-3xl" />
                <div className="relative flex items-start justify-between">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm sm:size-12">
                    <UtensilsCrossed className="size-5" />
                  </span>
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white/80">
                    Most used
                  </span>
                </div>
                <div className="relative mt-4">
                  <p className="text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">Dine-In</p>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/70">
                    Seat the party on Main Dining, Patio, or Bar, then build the check at the table.
                  </p>
                  <div className="mt-4 flex items-center justify-between gap-3 sm:mt-5">
                    <p className="text-sm font-medium text-white/80">{openTableCount} tables ready to seat</p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      Open floor
                      <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>

              <Stagger className="relative z-0 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1" delay={0.06}>
                {orderTypes.map(({ label, icon: Icon, href, desc }) => (
                  <StaggerItem key={label}>
                    <Link
                      href={href}
                      className="group relative z-0 flex items-center gap-4 overflow-hidden rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border/70 transition-colors hover:shadow-surface hover:ring-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                      <Icon className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-[15px] font-semibold tracking-tight text-foreground">{label}</span>
                        <ChevronRight className="size-4 text-muted-foreground/70 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">{desc}</span>
                      <span className="mt-1.5 inline-flex rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {orderMeta[label]}
                      </span>
                    </span>
                    </Link>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </div>

          <div className="relative z-0 shrink-0">
            <h2 className="mb-3 text-sm font-semibold tracking-tight text-foreground">Shift operations</h2>
            <div className="grid grid-cols-2 overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border/70 sm:grid-cols-4">
              {shiftOps.map(({ href, label, hint, icon: Icon }, index) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-3.5 transition-colors hover:bg-secondary/80 sm:px-4 sm:py-4',
                    index % 2 === 1 && 'border-l border-border/80',
                    index >= 2 && 'border-t border-border/80',
                    index > 0 && 'sm:border-l',
                    'sm:border-t-0',
                  )}
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-background text-foreground">
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-foreground">{label}</span>
                    <span className="block truncate text-xs text-muted-foreground">{hint}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <aside className="relative z-10 isolate mb-[max(0.75rem,env(safe-area-inset-bottom))] flex w-full flex-col rounded-2xl bg-card shadow-surface ring-1 ring-border/70 md:mb-0 md:min-h-0 md:w-[400px] md:overflow-hidden">
          <div className="border-b border-border/80 px-4 py-4 sm:px-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold tracking-tight text-foreground">Open checks</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {onlineOpen > 0 ? `${onlineOpen} online · tap to open` : 'Oldest first · tap to resume'}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-base font-semibold tabular-nums tracking-tight text-foreground">
                  ${openTotal.toFixed(2)}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {visibleChecks.length} of {allChecks.length}
                </p>
              </div>
            </div>
            <div className="mt-3 flex gap-1 overflow-x-auto no-scrollbar rounded-lg bg-secondary p-1">
              {checkTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setCheckFilter(type)}
                  className={cn(
                    'shrink-0 rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors',
                    checkFilter === type
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="relative mt-3">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={checkQuery}
                onChange={(e) => setCheckQuery(e.target.value)}
                placeholder="Search table, server, or check…"
                className="w-full rounded-md border border-border bg-background py-1.5 pl-8 pr-3 text-xs outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="bg-card md:min-h-0 md:flex-1 md:overflow-y-auto">
            {visibleChecks.map((chk, index) => {
              const minutes = elapsedMinutes(chk.elapsed)
              const aging = minutes >= 45
              const watch = minutes >= 30 && !aging
              const table = chk.tableId ? liveTables.find((t) => t.id === chk.tableId) : undefined
              const href =
                'href' in chk && typeof chk.href === 'string'
                  ? chk.href
                  : chk.tableId
                    ? `/pos/order?table=${chk.tableId}&type=${chk.orderType}`
                    : `/pos/order?type=${chk.orderType}`

              return (
                <Link
                  key={chk.id}
                  href={href}
                  className={cn(
                    'relative z-0 flex gap-0 bg-card transition-colors hover:bg-secondary/60',
                    index !== 0 && 'border-t border-border/70',
                  )}
                >
                  <span className={cn('w-[3px] shrink-0', aging ? 'bg-danger' : watch ? 'bg-warning' : 'bg-success')} />
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-3 px-4 py-3.5">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar size="sm" className="bg-secondary">
                        <AvatarFallback className="bg-secondary text-[10px] font-semibold text-muted-foreground">
                          {initials(chk.server)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold tracking-tight text-foreground">{chk.label}</p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <span className="truncate">{chk.server.split(' ')[0]}</span>
                          <span className="text-border">·</span>
                          <span>{chk.type}</span>
                          {table && (
                            <>
                              <span className="text-border">·</span>
                              <span className="inline-flex items-center gap-0.5">
                                <Users className="size-3" />
                                {table.seats}
                              </span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-0.5">
                      <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
                        ${chk.total.toFixed(2)}
                      </span>
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 text-[11px] font-medium',
                          aging ? 'text-danger' : watch ? 'text-warning' : 'text-muted-foreground',
                        )}
                      >
                        {aging ? <AlertTriangle className="size-3" /> : <Timer className="size-3" />}
                        {chk.elapsed}
                        {aging ? ' close' : ''}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
            {visibleChecks.length === 0 && (
              <p className="py-16 text-center text-sm text-muted-foreground">
                No {checkQuery ? 'checks match this search' : `${checkFilter.toLowerCase()} checks open`}.
              </p>
            )}
          </div>
        </aside>
      </main>
    </div>
  )
}

function Kpi({
  label,
  value,
  hint,
  tone = 'default',
}: {
  label: string
  value: string
  hint: string
  tone?: 'default' | 'warning'
}) {
  return (
    <div className="border-b border-border px-4 py-3.5 sm:border-b-0 sm:px-5 sm:py-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <p
        className={cn(
          'mt-1.5 font-mono text-[1.35rem] font-semibold tabular-nums tracking-tight',
          tone === 'warning' ? 'text-warning' : 'text-foreground',
        )}
      >
        {value}
      </p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p>
    </div>
  )
}
