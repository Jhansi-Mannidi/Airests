'use client'

import { useMemo, useState } from 'react'
import { KdsTopbar } from '@/components/kds/kds-topbar'
import { useKitchenTickets } from '@/lib/online-orders'
import { type Station } from '@/lib/mock-data'
import { UtensilsCrossed, ShoppingBag, Bike, Check, Send, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { m } from 'framer-motion'
import { Stagger, StaggerItem } from '@/components/motion/primitives'

const orderTypeIcon = { 'dine-in': UtensilsCrossed, takeout: ShoppingBag, delivery: Bike } as const
const stationOrder: Station[] = ['Grill', 'Fry', 'Salad']

type StationKey = `${string}-${Station}`

export default function ExpoPage() {
  const kitchenTickets = useKitchenTickets()
  const [ready, setReady] = useState<Set<StationKey>>(new Set())
  const [sent, setSent] = useState<Set<string>>(new Set())
  const [typeFilter, setTypeFilter] = useState<'all' | 'dine-in' | 'takeout' | 'delivery'>('all')
  const [query, setQuery] = useState('')

  const orders = useMemo(() => {
    const map = new Map<string, { orderNumber: string; orderType: string; tableOrName: string; ageMinutes: number; stations: Station[] }>()
    for (const t of kitchenTickets) {
      if (!map.has(t.orderNumber)) {
        map.set(t.orderNumber, {
          orderNumber: t.orderNumber,
          orderType: t.orderType,
          tableOrName: t.tableOrName,
          ageMinutes: t.ageMinutes,
          stations: [],
        })
      }
      map.get(t.orderNumber)!.stations.push(t.station)
    }
    return Array.from(map.values())
      .filter((o) => !sent.has(o.orderNumber))
      .filter((o) => typeFilter === 'all' || o.orderType === typeFilter)
      .filter((o) => {
        const q = query.trim().toLowerCase()
        if (!q) return true
        return `${o.orderNumber} ${o.tableOrName} ${o.orderType}`.toLowerCase().includes(q)
      })
      .sort((a, b) => b.ageMinutes - a.ageMinutes)
  }, [kitchenTickets, sent, typeFilter, query])

  function toggleStation(orderNumber: string, station: Station) {
    const key: StationKey = `${orderNumber}-${station}`
    setReady((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  function sendOrder(orderNumber: string) {
    setSent((prev) => new Set(prev).add(orderNumber))
    toast.success(`Order ${orderNumber} sent to floor`)
  }

  return (
    <div className="flex h-dvh flex-col bg-background page-canvas">
      <KdsTopbar active="expo" />

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 md:px-6">
        <div>
          <h1 className="font-sans text-lg font-semibold tracking-tight text-foreground">Expo — All Stations</h1>
          <p className="text-sm text-muted-foreground">{orders.length} orders in progress</p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ticket or table…"
              className="w-full rounded-md border border-border bg-background py-1.5 pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring sm:w-52"
            />
          </div>
          {(['all', 'dine-in', 'takeout', 'delivery'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={cn(typeFilter === type ? 'chip chip-active capitalize' : 'chip chip-muted capitalize')}
            >
              {type === 'all' ? 'All' : type.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        {orders.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No {query ? `results for “${query}”` : typeFilter === 'all' ? '' : `${typeFilter.replace('-', ' ')} `}orders in progress.
          </p>
        ) : (
        <Stagger className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" delay={0.045}>
          {orders.map((order) => {
            const Icon = orderTypeIcon[order.orderType as keyof typeof orderTypeIcon]
            const escalation = order.ageMinutes > 10 ? 'danger' : order.ageMinutes >= 5 ? 'warning' : 'success'
            const allReady = order.stations.every((s) => ready.has(`${order.orderNumber}-${s}`))

            return (
              <StaggerItem key={order.orderNumber} hover className="h-full min-h-0">
              <m.div
                className={cn(
                  'flex h-full min-h-[18rem] flex-col overflow-hidden rounded-xl border bg-card shadow-surface',
                  escalation === 'danger' && 'border-danger/60 ring-1 ring-danger/30',
                  escalation === 'warning' && 'border-warning/50',
                  escalation === 'success' && 'border-border',
                )}
              >
                <div className="grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border/80 px-4 py-2.5">
                  <div className="flex min-w-0 items-center gap-2">
                    <Icon className="size-4 shrink-0 text-muted-foreground" />
                    <span className="shrink-0 font-mono text-sm font-bold tabular-nums text-foreground">{order.orderNumber}</span>
                    <span className="truncate text-sm text-muted-foreground">{order.tableOrName}</span>
                  </div>
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-1 font-mono text-sm font-bold tabular-nums',
                      escalation === 'danger' && 'bg-danger/15 text-danger',
                      escalation === 'warning' && 'bg-warning/15 text-warning',
                      escalation === 'success' && 'bg-success/15 text-success',
                    )}
                  >
                    {order.ageMinutes}:00
                  </span>
                </div>

                <ul className="min-h-0 flex-1 space-y-1.5 px-4 py-3">
                  {order.stations.map((station) => {
                    const key: StationKey = `${order.orderNumber}-${station}`
                    const isReady = ready.has(key)
                    return (
                      <li key={station}>
                        <button
                          onClick={() => toggleStation(order.orderNumber, station)}
                          className={cn(
                            'flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors',
                            isReady
                              ? 'border-success/40 bg-success/10 text-success'
                              : 'border-border bg-muted/40 text-foreground hover:bg-muted',
                          )}
                        >
                          <span className="font-medium">{station}</span>
                          {isReady ? <Check className="size-4" /> : <span className="text-xs text-muted-foreground">Preparing</span>}
                        </button>
                      </li>
                    )
                  })}
                </ul>

                <div className="mt-auto shrink-0 border-t border-border/80 p-2.5">
                  <button
                    onClick={() => sendOrder(order.orderNumber)}
                    disabled={!allReady}
                    className={cn(
                      'flex h-11 w-full items-center justify-center gap-1.5 rounded-lg text-sm font-semibold transition-opacity',
                      allReady
                        ? 'bg-primary text-primary-foreground hover:opacity-90'
                        : 'cursor-not-allowed bg-muted text-muted-foreground',
                    )}
                  >
                    <Send className="size-4" />
                    Send to Floor
                  </button>
                </div>
              </m.div>
              </StaggerItem>
            )
          })}
        </Stagger>
        )}
      </main>
    </div>
  )
}
