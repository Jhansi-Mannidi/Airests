'use client'

import { useMemo, useState } from 'react'
import { KdsTopbar } from '@/components/kds/kds-topbar'
import { kitchenTickets, type Station } from '@/lib/mock-data'
import { UtensilsCrossed, ShoppingBag, Bike, Check, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const orderTypeIcon = { 'dine-in': UtensilsCrossed, takeout: ShoppingBag, delivery: Bike } as const
const stationOrder: Station[] = ['Grill', 'Fry', 'Salad']

type StationKey = `${string}-${Station}`

export default function ExpoPage() {
  const [ready, setReady] = useState<Set<StationKey>>(new Set())
  const [sent, setSent] = useState<Set<string>>(new Set())
  const [typeFilter, setTypeFilter] = useState<'all' | 'dine-in' | 'takeout' | 'delivery'>('all')

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
      .sort((a, b) => b.ageMinutes - a.ageMinutes)
  }, [sent, typeFilter])

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
    <div className="flex h-dvh flex-col bg-background">
      <KdsTopbar active="expo" />

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 md:px-6">
        <div>
          <h1 className="font-sans text-lg font-semibold tracking-tight text-foreground">Expo — All Stations</h1>
          <p className="text-sm text-muted-foreground">{orders.length} orders in progress</p>
        </div>
        <div className="flex gap-1.5">
          {(['all', 'dine-in', 'takeout', 'delivery'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors',
                typeFilter === type ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground',
              )}
            >
              {type === 'all' ? 'All' : type.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        {orders.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">No {typeFilter === 'all' ? '' : typeFilter.replace('-', ' ')} orders in progress.</p>
        ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {orders.map((order) => {
            const Icon = orderTypeIcon[order.orderType as keyof typeof orderTypeIcon]
            const escalation = order.ageMinutes > 10 ? 'danger' : order.ageMinutes >= 5 ? 'warning' : 'success'
            const allReady = order.stations.every((s) => ready.has(`${order.orderNumber}-${s}`))

            return (
              <div
                key={order.orderNumber}
                className={cn(
                  'flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm',
                  escalation === 'danger' && 'border-danger/60 ring-1 ring-danger/30',
                  escalation === 'warning' && 'border-warning/50',
                  escalation === 'success' && 'border-border',
                )}
              >
                <div className="flex items-center justify-between border-b border-border/80 px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <Icon className="size-4 text-muted-foreground" />
                    <span className="font-mono text-sm font-bold tabular-nums text-foreground">{order.orderNumber}</span>
                    <span className="text-sm text-muted-foreground">{order.tableOrName}</span>
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

                <ul className="flex-1 space-y-1.5 px-4 py-3">
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

                <div className="border-t border-border/80 p-2.5">
                  <button
                    onClick={() => sendOrder(order.orderNumber)}
                    disabled={!allReady}
                    className={cn(
                      'flex w-full items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-semibold transition-opacity',
                      allReady
                        ? 'bg-primary text-primary-foreground hover:opacity-90'
                        : 'cursor-not-allowed bg-muted text-muted-foreground',
                    )}
                  >
                    <Send className="size-4" />
                    Send to Floor
                  </button>
                </div>
              </div>
            )
          })}
        </div>
        )}
      </main>
    </div>
  )
}
