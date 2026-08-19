'use client'

import { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { KdsTopbar } from '@/components/kds/kds-topbar'
import { TicketCard } from '@/components/kds/ticket-card'
import { kitchenTickets, type Station } from '@/lib/mock-data'
import { toast } from 'sonner'

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

  const tickets = useMemo(
    () => kitchenTickets.filter((t) => t.station === stationName && !bumped.has(t.id)),
    [stationName, bumped],
  )

  function handleBump(id: string, orderNumber: string) {
    setBumped((prev) => new Set(prev).add(id))
    toast.success(`Ticket ${orderNumber} bumped`, { description: `${stationName} station` })
  }

  return (
    <div className="flex h-dvh flex-col bg-background">
      <KdsTopbar active={stationKey} />

      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3 md:px-6">
        <div>
          <h1 className="font-sans text-lg font-semibold tracking-tight text-foreground">{stationName} Station</h1>
          <p className="text-sm text-muted-foreground">{tickets.length} active tickets</p>
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

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        {tickets.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <p className="text-lg font-medium text-foreground">All caught up</p>
            <p className="text-sm text-muted-foreground">No active tickets for {stationName}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} onBump={() => handleBump(ticket.id, ticket.orderNumber)} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
