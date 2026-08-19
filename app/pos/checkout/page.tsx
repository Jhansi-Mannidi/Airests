'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tag, Mail, ArrowRight } from 'lucide-react'
import { PosTopBar } from '@/components/pos/pos-topbar'
import { Button } from '@/components/ui/button'
import { initialLinesForTable, loadPosOrder, resolvePosContext, type PosCartLine } from '@/lib/pos-order'
import { cn } from '@/lib/utils'

const splitOptions = ['Split Evenly', 'Split by Seat', 'Split by Item'] as const

export default function CheckoutPage() {
  return (
    <React.Suspense>
      <CheckoutContent />
    </React.Suspense>
  )
}

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ctx = resolvePosContext(searchParams.get('table'), searchParams.get('type'))
  const [split, setSplit] = React.useState<typeof splitOptions[number]>('Split by Seat')
  const [lines, setLines] = React.useState<PosCartLine[]>([])

  React.useEffect(() => {
    const saved = loadPosOrder()
    if (saved && (saved.tableId ?? null) === (ctx.table?.id ?? null)) {
      setLines(saved.lines)
    } else {
      setLines(initialLinesForTable(ctx.table))
    }
  }, [ctx.table, ctx.table?.id])

  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0)
  const party = ctx.table?.seats ?? 1
  const discount = subtotal > 40 ? 5 : 0
  const serviceCharge = party >= 6 ? (subtotal - discount) * 0.2 : 0
  const tax = (subtotal - discount) * 0.0825
  const total = subtotal - discount + serviceCharge + tax

  return (
    <div className="flex h-dvh flex-col bg-background font-sans">
      <PosTopBar title={`${ctx.title} — Check Review`} backHref={`/pos/order?${ctx.query}`} />

      <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 lg:flex-row lg:overflow-hidden lg:p-6">
        <div className="min-w-0 flex-1 overflow-y-auto rounded-2xl border border-border bg-card p-4 md:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {ctx.table ? `${ctx.title.replace(' — ', ' · ')} · Party of ${party}` : ctx.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                {ctx.table?.server ? `Server: ${ctx.table.server}` : 'Counter order'}
                {ctx.table?.elapsed ? ` · Opened ${ctx.table.elapsed} ago` : ''}
              </p>
            </div>
            {discount > 0 && (
              <span className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                <Tag className="size-3.5" />
                Loyalty Discount — Applied
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {lines.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">No items on this check yet.</p>
            ) : (
              lines.map((item) => (
                <div key={item.id} className="flex items-start justify-between border-b border-border/70 py-2 text-sm last:border-0">
                  <div>
                    <p className="text-foreground">
                      {item.name} <span className="text-muted-foreground">×{item.qty}</span>
                    </p>
                    {item.modifiers && <p className="text-xs text-muted-foreground">{item.modifiers}</p>}
                    {item.note && <p className="text-xs italic text-muted-foreground">&ldquo;{item.note}&rdquo;</p>}
                  </div>
                  <span className="font-mono tabular-nums text-foreground">${(item.unitPrice * item.qty).toFixed(2)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col rounded-2xl border border-border bg-card p-4 md:p-6 lg:w-[380px]">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Split Check</h3>
          <div className="mb-6 flex rounded-lg border border-border bg-secondary p-1">
            {splitOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setSplit(opt)}
                className={cn(
                  'flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors',
                  split === opt ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground',
                )}
              >
                {opt}
              </button>
            ))}
          </div>
          <p className="mb-4 text-xs text-muted-foreground">
            {split === 'Split Evenly' && party > 1
              ? `${party} ways · $${(total / party).toFixed(2)} each`
              : split === 'Split by Item'
                ? 'Guests pay for selected items'
                : 'Each seat pays their own items'}
          </p>

          <div className="flex flex-col gap-2 text-sm">
            <Row label="Subtotal" value={subtotal} />
            {discount > 0 && <Row label="Discount — Loyalty Reward" value={-discount} tone="success" />}
            {serviceCharge > 0 && <Row label="Service Charge (20%, party of 6+)" value={serviceCharge} />}
            <Row label="Tax (8.25%)" value={tax} />
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="text-base font-semibold text-foreground">Total Due</span>
            <span className="font-mono text-xl font-bold tabular-nums text-foreground">${total.toFixed(2)}</span>
          </div>

          <div className="mt-6 flex flex-col gap-2.5">
            <Button variant="outline" size="lg" className="w-full gap-2 bg-transparent">
              <Mail className="size-4" />
              Send Receipt
            </Button>
            <Button size="lg" className="w-full gap-2" onClick={() => router.push(`/pos/payment?${ctx.query}`)}>
              Proceed to Payment
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

function Row({ label, value, tone }: { label: string; value: number; tone?: 'success' }) {
  return (
    <div className="flex items-center justify-between text-muted-foreground">
      <span>{label}</span>
      <span className={cn('font-mono tabular-nums', tone === 'success' && 'text-success')}>
        {value < 0 ? '-' : ''}${Math.abs(value).toFixed(2)}
      </span>
    </div>
  )
}
