'use client'

import { UtensilsCrossed, ShoppingBag, Bike, Check, RotateCcw } from 'lucide-react'
import type { KitchenTicket } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { m } from 'framer-motion'

const orderTypeIcon = {
  'dine-in': UtensilsCrossed,
  takeout: ShoppingBag,
  delivery: Bike,
} as const

export function TicketCard({
  ticket,
  onBump,
  onHold,
  onFire,
  onRecall,
  held,
}: {
  ticket: KitchenTicket
  onBump?: () => void
  onHold?: () => void
  onFire?: () => void
  onRecall?: () => void
  held?: boolean
}) {
  const Icon = orderTypeIcon[ticket.orderType]
  const escalation =
    ticket.ageMinutes > 10 ? 'danger' : ticket.ageMinutes >= 5 ? 'warning' : 'success'

  return (
    <m.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: held ? 0.7 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -2 }}
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
          <span className="shrink-0 font-mono text-sm font-bold tabular-nums text-foreground">{ticket.orderNumber}</span>
          <span className="truncate text-sm text-muted-foreground">{ticket.tableOrName}</span>
        </div>
        <span
          className={cn(
            'flex shrink-0 items-center justify-center rounded-full px-2.5 py-1 font-mono text-sm font-bold tabular-nums',
            escalation === 'danger' && 'bg-danger/15 text-danger',
            escalation === 'warning' && 'bg-warning/15 text-warning',
            escalation === 'success' && 'bg-success/15 text-success',
          )}
        >
          {ticket.ageMinutes}:00
        </span>
      </div>

      <ul className="min-h-0 flex-1 px-4 py-3">
        {ticket.items.map((item, i) => (
          <li key={i} className="border-b border-border/60 py-1.5 text-sm last:border-0">
            <p className="font-medium leading-snug text-foreground">{item.name}</p>
            {item.modifiers && item.modifiers.length > 0 && (
              <p className="text-xs leading-snug text-muted-foreground">{item.modifiers.join(', ')}</p>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-auto grid shrink-0 grid-cols-[1fr_auto_auto] items-stretch gap-2 border-t border-border/80 p-2.5">
        {onRecall ? (
          <button
            type="button"
            onClick={onRecall}
            className="col-span-3 flex h-11 items-center justify-center gap-1.5 rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <RotateCcw className="size-4" />
            Reopen
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={onBump}
              className="flex h-11 items-center justify-center gap-1.5 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Check className="size-4" />
              Bump
            </button>
            <button
              type="button"
              onClick={onHold}
              className="flex h-11 min-w-14 items-center justify-center rounded-lg border border-border px-3 text-xs font-semibold text-muted-foreground hover:bg-secondary"
            >
              {held ? 'Release' : 'Hold'}
            </button>
            <button
              type="button"
              onClick={onFire}
              aria-label="Re-fire"
              className="flex size-11 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-secondary"
            >
              <RotateCcw className="size-4" />
            </button>
          </>
        )}
      </div>
    </m.div>
  )
}
