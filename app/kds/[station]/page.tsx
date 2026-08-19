'use client'

import { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { KdsTopbar } from '@/components/kds/kds-topbar'
import { TicketCard } from '@/components/kds/ticket-card'
import { kitchenTickets, type Station, type KitchenTicket } from '@/lib/mock-data'
import { toast } from 'sonner'
import { Search } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import { Stagger, StaggerItem } from '@/components/motion/primitives'

const stationLabels: Record<string, Station> = {
  grill: 'Grill',
  fry: 'Fry',
  salad: 'Salad',
  bar: 'Bar',
}

export default function KdsStationPage() {
  const params = useParams<{ station: string }>()
  const stationKey = params.station
  const stationName = stationLabels[stationKey] ?? 'Grill'

  const [bumped, setBumped] = useState<Set<string>>(new Set())
  const [held, setHeld] = useState<Set<string>>(new Set())
  const [recalled, setRecalled] = useState<KitchenTicket[]>([])
  const [query, setQuery] = useState('')

  const tickets = useMemo(
    () =>
      kitchenTickets.filter((t) => {
        if (t.station !== stationName || bumped.has(t.id)) return false
        const q = query.trim().toLowerCase()
        if (!q) return true
        return `${t.orderNumber} ${t.tableOrName} ${t.items.map((i) => i.name).join(' ')}`.toLowerCase().includes(q)
      }),
    [stationName, bumped, query],
  )

  function handleBump(id: string, orderNumber: string) {
    const ticket = kitchenTickets.find((t) => t.id === id)
    setBumped((prev) => new Set(prev).add(id))
    if (ticket) setRecalled((prev) => [ticket, ...prev.filter((t) => t.id !== id)])
    toast.success(`Ticket ${orderNumber} bumped`, { description: `${stationName} station` })
  }

  return (
    <div className="flex h-dvh flex-col bg-background page-canvas">
      <KdsTopbar active={stationKey} />

      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3 md:px-6">
        <div>
          <h1 className="font-sans text-lg font-semibold tracking-tight text-foreground">{stationName} Station</h1>
          <p className="text-sm text-muted-foreground">{tickets.length} active tickets</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tickets…"
              className="w-full rounded-md border border-border bg-background py-1.5 pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring sm:w-48"
            />
          </div>
          <div className="hidden items-center gap-4 text-xs text-muted-foreground sm:flex">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-success" /> On time
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-warning" /> 5–10 min
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-danger" /> 10+ min
          </span>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        {tickets.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <p className="text-lg font-medium text-foreground">{query ? 'No matches' : 'All caught up'}</p>
            <p className="text-sm text-muted-foreground">
              {query ? `No tickets match “${query}”.` : `No active tickets for ${stationName}.`}
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
          <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" delay={0.04}>
            {tickets.map((ticket) => (
              <StaggerItem key={ticket.id} hover>
              <TicketCard
                ticket={ticket}
                held={held.has(ticket.id)}
                onBump={() => handleBump(ticket.id, ticket.orderNumber)}
                onHold={() => {
                  setHeld((prev) => {
                    const next = new Set(prev)
                    next.has(ticket.id) ? next.delete(ticket.id) : next.add(ticket.id)
                    return next
                  })
                  toast.message(held.has(ticket.id) ? 'Ticket released' : 'Ticket held', { description: ticket.orderNumber })
                }}
                onFire={() => toast.success(`Re-fired ${ticket.orderNumber}`, { description: 'Sent back to printer / bump bar.' })}
              />
              </StaggerItem>
            ))}
          </Stagger>
          </AnimatePresence>
        )}
        {recalled.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Recently bumped — reopen if needed</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {recalled.slice(0, 4).map((ticket) => (
                <TicketCard
                  key={`reopen-${ticket.id}`}
                  ticket={ticket}
                  onRecall={() => {
                    setBumped((prev) => {
                      const next = new Set(prev)
                      next.delete(ticket.id)
                      return next
                    })
                    setRecalled((prev) => prev.filter((t) => t.id !== ticket.id))
                    toast.success(`Reopened ${ticket.orderNumber}`)
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
