'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tag, Mail, ArrowRight, Utensils, Minus, Plus } from 'lucide-react'
import { PosTopBar } from '@/components/pos/pos-topbar'
import { Button } from '@/components/ui/button'
import { discountsCatalog } from '@/lib/mock-data'
import {
  buildSplitShares,
  initialLinesForTable,
  loadPosOrder,
  resolvePosContext,
  savePosSplit,
  type PosCartLine,
  type SplitMode,
} from '@/lib/pos-order'
import { printGuestCheck } from '@/lib/table-status'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const splitOptions: { id: SplitMode; label: string; hint: string }[] = [
  { id: 'even', label: 'Split evenly', hint: 'Same amount each. Who ate what does not matter.' },
  { id: 'seat', label: 'Split by seat', hint: 'Each table seat pays only their dishes.' },
  { id: 'item', label: 'Split by item', hint: 'Assign each dish to a person.' },
]

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
  const dineIn = Boolean(ctx.table)
  const defaultPeople = Math.max(2, ctx.table?.seats ?? 2)

  const [split, setSplit] = React.useState<SplitMode>(dineIn ? 'seat' : 'even')
  const [people, setPeople] = React.useState(defaultPeople)
  const [lines, setLines] = React.useState<PosCartLine[]>([])
  const [discountId, setDiscountId] = React.useState<string | null>('d-4')
  const [lineOwners, setLineOwners] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    const saved = loadPosOrder()
    const nextLines =
      saved && (saved.tableId ?? null) === (ctx.table?.id ?? null) ? saved.lines : initialLinesForTable(ctx.table)
    setLines(nextLines)
    setLineOwners(defaultOwners(nextLines, defaultPeople))
    setPeople(defaultPeople)
    setSplit(dineIn ? 'seat' : 'even')
  }, [ctx.table, ctx.table?.id, defaultPeople, dineIn])

  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0)
  const party = ctx.table?.seats ?? people
  const applied = discountsCatalog.find((d) => d.id === discountId)
  const discount =
    applied?.type === 'Amount' && applied.value.startsWith('$')
      ? Number.parseFloat(applied.value.slice(1))
      : applied?.type === 'Percent' && applied.value.endsWith('%')
        ? subtotal * (Number.parseFloat(applied.value) / 100)
        : 0
  const serviceCharge = party >= 6 ? (subtotal - discount) * 0.2 : 0
  const tax = Math.round((subtotal - discount) * 0.0825 * 100) / 100
  const total = subtotal - discount + serviceCharge + tax

  const labels = Array.from({ length: people }, (_, i) =>
    split === 'seat' ? (dineIn ? `Seat ${i + 1}` : `Guest ${i + 1}`) : `Person ${i + 1}`,
  )
  const shares = buildSplitShares({ mode: split, people, lines, total, lineOwners, labels })

  function changePeople(next: number) {
    const count = Math.min(8, Math.max(2, next))
    setPeople(count)
    setLineOwners((prev) => {
      const updated = { ...prev }
      for (const line of lines) {
        const current = Number((updated[line.id] ?? 'share-1').replace('share-', ''))
        if (current > count) updated[line.id] = 'share-1'
      }
      return updated
    })
  }

  function goPay() {
    savePosSplit({ mode: split, people, lineOwners, shares, total })
    if (ctx.table) printGuestCheck(ctx.table.id)
    toast.success(`${shares.length} payments ready`, {
      description: shares.map((s) => `${s.label} $${s.amount.toFixed(2)}`).join(' · '),
    })
    router.push(`/pos/payment?${ctx.query}`)
  }

  return (
    <div className="pos-canvas flex h-dvh flex-col font-sans">
      <PosTopBar title={`${ctx.title} — Check Review`} backHref={`/pos/order?${ctx.query}`} />

      <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 lg:flex-row lg:overflow-hidden lg:p-6">
        <div className="min-w-0 flex-1 overflow-y-auto rounded-2xl border border-border bg-card p-4 md:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {ctx.table ? `${ctx.title.replace(' — ', ' · ')} · Party of ${ctx.table.seats}` : `${ctx.title} · Counter`}
              </h2>
              <p className="text-sm text-muted-foreground">
                {ctx.table?.server ? `Server: ${ctx.table.server}` : 'Guest is at the counter or collecting later'}
                {ctx.table?.elapsed ? ` · Opened ${ctx.table.elapsed} ago` : ''}
              </p>
            </div>
            {discount > 0 && applied && (
              <span className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                <Tag className="size-3.5" />
                {applied.name} — Applied
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {lines.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">No items on this check yet.</p>
            ) : (
              lines.map((item) => (
                <div key={item.id} className="flex flex-col gap-2 border-b border-border/70 py-2.5 last:border-0 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm text-foreground">
                      {item.name} <span className="text-muted-foreground">×{item.qty}</span>
                    </p>
                    {item.modifiers && <p className="text-xs text-muted-foreground">{item.modifiers}</p>}
                    {item.note && <p className="text-xs italic text-muted-foreground">&ldquo;{item.note}&rdquo;</p>}
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                    <span className="font-mono text-sm tabular-nums text-foreground">${(item.unitPrice * item.qty).toFixed(2)}</span>
                    {split !== 'even' && (
                      <select
                        value={lineOwners[item.id] ?? 'share-1'}
                        onChange={(e) => setLineOwners((prev) => ({ ...prev, [item.id]: e.target.value }))}
                        className="rounded-md border border-border bg-background px-2 py-1 text-xs font-medium outline-none focus:ring-2 focus:ring-ring"
                      >
                        {labels.map((label, i) => (
                          <option key={label} value={`share-${i + 1}`}>
                            {label} pays this
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col overflow-y-auto rounded-2xl border border-border bg-card p-4 md:p-6 lg:w-[400px]">
          <h3 className="mb-3 text-sm font-semibold text-foreground">Discount</h3>
          <div className="mb-5 flex flex-wrap gap-1.5">
            <button
              onClick={() => setDiscountId(null)}
              className={cn('rounded-full px-2.5 py-1 text-xs font-medium', !discountId ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}
            >
              None
            </button>
            {discountsCatalog.map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  setDiscountId(d.id)
                  toast.success(`${d.name} applied`, { description: d.managerPin ? 'Manager PIN captured on audit log.' : d.code })
                }}
                className={cn(
                  'rounded-full px-2.5 py-1 text-xs font-medium',
                  discountId === d.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                )}
              >
                {d.name}
              </button>
            ))}
          </div>

          <h3 className="mb-1 text-sm font-semibold text-foreground">Split check</h3>
          <p className="mb-3 text-xs text-muted-foreground">One bill, more than one person paying. Each person pays only their share.</p>
          <div className="mb-3 flex flex-col gap-1.5">
            {splitOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSplit(opt.id)}
                className={cn(
                  'rounded-lg border px-3 py-2 text-left transition-colors',
                  split === opt.id ? 'border-primary bg-accent' : 'border-border hover:bg-secondary/60',
                )}
              >
                <p className="text-sm font-semibold text-foreground">{opt.label}</p>
                <p className="text-[11px] leading-snug text-muted-foreground">{opt.hint}</p>
              </button>
            ))}
          </div>

          {split === 'seat' && !dineIn && (
            <p className="mb-3 rounded-md bg-warning/10 px-3 py-2 text-xs text-foreground">
              This is a counter / pickup order, so “seats” means Guest 1, Guest 2… not table chairs.
            </p>
          )}

          <div className="mb-3 flex items-center justify-between rounded-lg border border-border px-3 py-2">
            <span className="text-xs font-medium text-muted-foreground">{split === 'seat' ? 'How many seats / guests?' : 'How many people pay?'}</span>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => changePeople(people - 1)} className="flex size-7 items-center justify-center rounded-full border border-border hover:bg-secondary">
                <Minus className="size-3.5" />
              </button>
              <span className="w-6 text-center font-mono text-sm font-semibold">{people}</span>
              <button type="button" onClick={() => changePeople(people + 1)} className="flex size-7 items-center justify-center rounded-full border border-border hover:bg-secondary">
                <Plus className="size-3.5" />
              </button>
            </div>
          </div>

          <div className="mb-4 space-y-1.5 rounded-lg bg-muted/60 p-3">
            {shares.map((share) => (
              <div key={share.id} className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{share.label}</span>
                <span className="font-mono font-semibold tabular-nums">${share.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <Row label="Subtotal" value={subtotal} />
            {discount > 0 && applied && <Row label={`Discount — ${applied.name}`} value={-discount} tone="success" />}
            {serviceCharge > 0 && <Row label="Service Charge (20%, party of 6+)" value={serviceCharge} />}
            <Row label="Sales tax (8.25%)" value={tax} />
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="text-base font-semibold text-foreground">Total Due</span>
            <span className="font-mono text-xl font-bold tabular-nums text-foreground">${total.toFixed(2)}</span>
          </div>

          <div className="mt-6 flex flex-col gap-2.5">
            <Button
              variant="outline"
              size="lg"
              className="w-full gap-2 bg-transparent"
              onClick={() => toast.success('Courses fired', { description: 'Apps sent. Entrees held until you fire.' })}
            >
              <Utensils className="size-4" />
              Fire apps / hold entrees
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full gap-2 bg-transparent"
              onClick={() => {
                if (ctx.table) printGuestCheck(ctx.table.id)
                toast.success('Check printed', {
                  description: ctx.table
                    ? `${ctx.table.label} is now Check Printed · Maria Alvarez`
                    : 'Receipt sent to Register 2.',
                })
                router.push('/pos/print')
              }}
            >
              <Mail className="size-4" />
              Send / print receipt
            </Button>
            <Button size="lg" className="w-full gap-2" onClick={goPay}>
              Collect {shares.length} payment{shares.length === 1 ? '' : 's'}
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

function defaultOwners(lines: PosCartLine[], people: number) {
  const owners: Record<string, string> = {}
  lines.forEach((line, i) => {
    owners[line.id] = `share-${(i % people) + 1}`
  })
  return owners
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
