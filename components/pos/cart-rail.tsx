'use client'

import { Minus, Plus, X, Send, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type CartLine = {
  id: string
  name: string
  unitPrice: number
  qty: number
  modifiers?: string
  note?: string
}

const TAX_RATE = 0.0825

export function CartRail({
  lines,
  onInc,
  onDec,
  onRemove,
  onSend,
  onPay,
  className,
}: {
  lines: CartLine[]
  onInc: (id: string) => void
  onDec: (id: string) => void
  onRemove: (id: string) => void
  onSend?: () => void
  onPay?: () => void
  className?: string
}) {
  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0)
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax

  return (
    <aside className={cn('flex min-h-0 w-full flex-col border-border bg-card lg:w-[380px] lg:shrink-0 lg:border-l', className)}>
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="text-sm font-semibold text-foreground">Current Order</h2>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
          {lines.reduce((s, l) => s + l.qty, 0)} items
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-3">
        {lines.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
            <p>No items yet.</p>
            <p>Tap a menu item to add it to this order.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {lines.map((l) => (
              <li key={l.id} className="flex gap-3">
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-tight text-foreground">{l.name}</p>
                    <button onClick={() => onRemove(l.id)} className="text-muted-foreground hover:text-danger" aria-label="Remove item">
                      <X className="size-3.5" />
                    </button>
                  </div>
                  {l.modifiers && <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{l.modifiers}</p>}
                  {l.note && <p className="mt-0.5 text-xs italic leading-snug text-muted-foreground">&ldquo;{l.note}&rdquo;</p>}
                  <div className="mt-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-2 rounded-md border border-border p-0.5">
                      <button onClick={() => onDec(l.id)} className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-secondary">
                        <Minus className="size-3" />
                      </button>
                      <span className="w-4 text-center font-mono text-xs tabular-nums">{l.qty}</span>
                      <button onClick={() => onInc(l.id)} className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-secondary">
                        <Plus className="size-3" />
                      </button>
                    </div>
                    <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
                      ${(l.unitPrice * l.qty).toFixed(2)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col gap-1.5 border-t border-border px-5 py-4 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Tax (8.25%)</span>
          <span className="font-mono tabular-nums">${tax.toFixed(2)}</span>
        </div>
        <div className="mt-1 flex justify-between border-t border-border pt-2 text-base font-semibold text-foreground">
          <span>Total</span>
          <span className="font-mono tabular-nums">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:flex-row sm:px-5 sm:pb-5">
        <Button variant="outline" size="lg" className="h-11 flex-1 gap-2 bg-transparent" disabled={lines.length === 0} onClick={onSend}>
          <Send className="size-4" />
          Send
        </Button>
        <Button size="lg" className="h-11 flex-1 gap-2" disabled={lines.length === 0} onClick={onPay}>
          <CreditCard className="size-4" />
          Pay
        </Button>
      </div>
    </aside>
  )
}
