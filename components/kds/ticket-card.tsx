'use client'

import { UtensilsCrossed, ShoppingBag, Bike, Check, RotateCcw } from 'lucide-react'
import type { KitchenTicket } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const orderTypeIcon = {
  'dine-in': UtensilsCrossed,
  takeout: ShoppingBag,
  delivery: Bike,
} as const

export function TicketCard({ ticket, onBump }: { ticket: KitchenTicket; onBump?: () => void }) {
  const Icon = orderTypeIcon[ticket.orderType]
  const escalation =
    ticket.ageMinutes > 10 ? 'danger' : ticket.ageMinutes >= 5 ? 'warning' : 'success'

  return (
    <div
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
          <span className="font-mono text-sm font-bold tabular-nums text-foreground">{ticket.orderNumber}</span>
          <span className="text-sm text-muted-foreground">{ticket.tableOrName}</span>
        </div>
        <span
          className={cn(
            'flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-sm font-bold tabular-nums',
            escalation === 'danger' && 'bg-danger/15 text-danger',
            escalation === 'warning' && 'bg-warning/15 text-warning',
            escalation === 'success' && 'bg-success/15 text-success',
          )}
        >
          {ticket.ageMinutes}:00
        </span>
      </div>

      <ul className="flex-1 px-4 py-3">
        {ticket.items.map((item, i) => (
          <li key={i} className="border-b border-border/60 py-1.5 text-sm last:border-0">
            <p className="font-medium text-foreground">{item.name}</p>
            {item.modifiers && item.modifiers.length > 0 && (
              <p className="text-xs text-muted-foreground">{item.modifiers.join(', ')}</p>
            )}
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2 border-t border-border/80 p-2.5">
        <button
          onClick={onBump}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Check className="size-4" />
          Bump
        </button>
        <button
          aria-label="Recall"
          className="flex size-10 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-secondary"
        >
          <RotateCcw className="size-4" />
        </button>
      </div>
    </div>
  )
}
