'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Banknote, CreditCard, SplitSquareHorizontal, Delete, Undo2, Check } from 'lucide-react'
import { PosTopBar } from '@/components/pos/pos-topbar'
import { Button } from '@/components/ui/button'
import { RefundVoidDialog } from '@/components/pos/refund-void-dialog'
import {
  initialLinesForTable,
  loadPosOrder,
  loadPosSplit,
  resolvePosContext,
  savePosSplit,
  type PosSplitPlan,
  type SplitShare,
} from '@/lib/pos-order'
import { closePaidTable } from '@/lib/table-status'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'back']

type Method = 'cash' | 'card' | 'split'

export default function PaymentPage() {
  return (
    <React.Suspense>
      <PaymentContent />
    </React.Suspense>
  )
}

function PaymentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ctx = resolvePosContext(searchParams.get('table'), searchParams.get('type'))
  const [method, setMethod] = React.useState<Method>('cash')
  const [amount, setAmount] = React.useState('0.00')
  const [voidOpen, setVoidOpen] = React.useState(false)
  const [plan, setPlan] = React.useState<PosSplitPlan | null>(null)
  const [activeId, setActiveId] = React.useState<string | null>(null)

  const fallbackTotal = React.useMemo(() => {
    const saved = typeof window === 'undefined' ? null : loadPosOrder()
    const lines =
      saved && (saved.tableId ?? null) === (ctx.table?.id ?? null) ? saved.lines : initialLinesForTable(ctx.table)
    const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0)
    const party = ctx.table?.seats ?? 1
    const discount = subtotal > 40 ? 5 : 0
    const serviceCharge = party >= 6 ? (subtotal - discount) * 0.2 : 0
    const tax = (subtotal - discount) * 0.0825
    return subtotal - discount + serviceCharge + tax
  }, [ctx.table])

  React.useEffect(() => {
    const stored = loadPosSplit()
    if (stored?.shares?.length) {
      setPlan(stored)
      const firstUnpaid = stored.shares.find((s) => !s.paid)
      setActiveId(firstUnpaid?.id ?? stored.shares[0].id)
      return
    }
    const single: PosSplitPlan = {
      mode: 'even',
      people: 1,
      lineOwners: {},
      total: fallbackTotal,
      shares: [{ id: 'share-1', label: 'Full check', amount: fallbackTotal, paid: false }],
    }
    setPlan(single)
    setActiveId('share-1')
  }, [fallbackTotal])

  const shares = plan?.shares ?? []
  const active = shares.find((s) => s.id === activeId) ?? shares[0]
  const due = active && !active.paid ? active.amount : 0
  const remaining = shares.filter((s) => !s.paid).reduce((s, x) => s + x.amount, 0)
  const paidCount = shares.filter((s) => s.paid).length

  React.useEffect(() => {
    setAmount(due > 0 ? Math.ceil(due).toFixed(2) : '0.00')
  }, [due, activeId])

  const tendered = Number.parseFloat(amount || '0')
  const change = Math.max(0, tendered - due)

  function press(key: string) {
    if (key === 'back') return setAmount((a) => a.slice(0, -1))
    setAmount((a) => (a === '0.00' ? key : (a + key).slice(0, 8)))
  }

  function markPaid(label: string) {
    if (!plan || !active || active.paid) return
    if (method === 'cash' && tendered + 0.001 < due) {
      toast.error('Not enough cash', { description: `Need $${due.toFixed(2)} for ${active.label}.` })
      return
    }
    const nextShares = plan.shares.map((s) => (s.id === active.id ? { ...s, paid: true } : s))
    const nextPlan = { ...plan, shares: nextShares }
    setPlan(nextPlan)
    savePosSplit(nextPlan)
    toast.success(`${active.label} paid`, {
      description: `${label} · $${due.toFixed(2)}${method === 'cash' && change > 0 ? ` · change $${change.toFixed(2)}` : ''}`,
    })
    const nextUnpaid = nextShares.find((s) => !s.paid)
    if (!nextUnpaid) {
      if (ctx.table) closePaidTable(ctx.table.id)
      toast.success('Check closed', {
        description: ctx.table
          ? `${ctx.table.label} needs bussing · set by Maria Alvarez`
          : 'All shares collected.',
      })
      setTimeout(() => router.push(ctx.table ? '/pos/floor-plan' : '/pos'), 700)
      return
    }
    setActiveId(nextUnpaid.id)
  }

  return (
    <div className="pos-canvas flex h-dvh flex-col font-sans">
      <PosTopBar
        title={`Payment — ${ctx.title}`}
        backHref={`/pos/checkout?${ctx.query}`}
        right={
          <Button variant="ghost" size="sm" className="hidden gap-1.5 text-muted-foreground md:inline-flex" onClick={() => setVoidOpen(true)}>
            <Undo2 className="size-3.5" />
            Void a Transaction
          </Button>
        }
      />

      <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 lg:flex-row lg:overflow-hidden lg:p-6">
        <div className="flex w-full shrink-0 flex-col gap-3 lg:max-w-sm">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Who is paying now</p>
            <div className="mt-3 space-y-2">
              {shares.map((share) => (
                <ShareButton key={share.id} share={share} active={share.id === activeId} onClick={() => !share.paid && setActiveId(share.id)} />
              ))}
            </div>
            <div className="mt-3 flex justify-between border-t border-border pt-3 text-sm">
              <span className="text-muted-foreground">Still due</span>
              <span className="font-mono font-bold tabular-nums text-foreground">${remaining.toFixed(2)}</span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {paidCount} of {shares.length} people paid
            </p>
          </div>

          <MethodButton icon={Banknote} label="Cash" active={method === 'cash'} onClick={() => setMethod('cash')} />
          <MethodButton icon={CreditCard} label="Card — External Terminal" active={method === 'card'} onClick={() => setMethod('card')} />
          <MethodButton icon={SplitSquareHorizontal} label="Cash + card for this person" active={method === 'split'} onClick={() => setMethod('split')} />
        </div>

        <div className="min-w-0 flex-1 overflow-y-auto rounded-2xl border border-border bg-card p-4 md:p-6">
          {active?.paid ? (
            <p className="py-16 text-center text-sm text-muted-foreground">This share is already paid. Pick the next person.</p>
          ) : (
            <>
              {method === 'cash' && (
                <div className="mx-auto flex max-w-sm flex-col gap-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">{active?.label} · cash</p>
                    <p className="font-mono text-4xl font-bold tabular-nums text-foreground">${tendered.toFixed(2)}</p>
                    <p className="mt-1 text-sm text-muted-foreground">Amount due ${due.toFixed(2)}</p>
                    <p className={cn('mt-1 text-sm font-medium', change > 0 ? 'text-success' : 'text-muted-foreground')}>
                      Change Due: ${change.toFixed(2)}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {KEYS.map((k) => (
                      <button
                        key={k}
                        onClick={() => press(k)}
                        className="flex h-16 items-center justify-center rounded-xl border border-border bg-secondary/50 text-xl font-semibold text-foreground transition-colors active:bg-secondary"
                      >
                        {k === 'back' ? <Delete className="size-5" /> : k}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-4 gap-2 sm:flex sm:gap-3">
                    {[20, 50, 100, 200].map((bill) => (
                      <button
                        key={bill}
                        onClick={() => setAmount(bill.toFixed(2))}
                        className="flex-1 rounded-lg border border-border py-2 text-sm font-medium text-foreground hover:bg-secondary"
                      >
                        ${bill}
                      </button>
                    ))}
                  </div>
                  <Button size="lg" className="w-full" onClick={() => markPaid('Cash')}>
                    Take cash for {active?.label}
                  </Button>
                </div>
              )}

              {method === 'card' && (
                <div className="mx-auto flex max-w-sm flex-col items-center gap-4 py-10 text-center">
                  <div className="flex size-16 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <CreditCard className="size-8" />
                  </div>
                  <p className="text-lg font-semibold text-foreground">Waiting for Terminal</p>
                  <p className="text-sm text-muted-foreground">
                    Charge {active?.label} ${due.toFixed(2)} on the connected card terminal.
                  </p>
                  <Button size="lg" className="mt-4 w-full" onClick={() => markPaid('Card')}>
                    Simulate approved
                  </Button>
                </div>
              )}

              {method === 'split' && (
                <div className="mx-auto flex max-w-md flex-col gap-4">
                  <p className="text-sm font-semibold text-foreground">
                    {active?.label} wants to mix cash and card for their ${due.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">This is not the table split. It is one person using two tenders.</p>
                  <Button size="lg" className="w-full" onClick={() => markPaid('Cash + card')}>
                    Mark {active?.label} paid
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <RefundVoidDialog open={voidOpen} onOpenChange={setVoidOpen} />
    </div>
  )
}

function ShareButton({ share, active, onClick }: { share: SplitShare; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={share.paid}
      className={cn(
        'flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm',
        share.paid && 'border-success/30 bg-success/10 text-success',
        !share.paid && active && 'border-primary bg-accent',
        !share.paid && !active && 'border-border hover:bg-secondary/60',
      )}
    >
      <span className="flex items-center gap-2 font-medium">
        {share.paid && <Check className="size-3.5" />}
        {share.label}
      </span>
      <span className="font-mono tabular-nums">${share.amount.toFixed(2)}</span>
    </button>
  )
}

function MethodButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ElementType
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-xl border p-4 text-left transition-colors',
        active ? 'border-primary bg-accent' : 'border-border bg-card hover:bg-secondary/50',
      )}
    >
      <span className={cn('flex size-10 items-center justify-center rounded-lg', active ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground')}>
        <Icon className="size-5" />
      </span>
      <span className="text-sm font-semibold text-foreground">{label}</span>
    </button>
  )
}
