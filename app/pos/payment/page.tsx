'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Banknote, CreditCard, SplitSquareHorizontal, Delete, Undo2 } from 'lucide-react'
import { PosTopBar } from '@/components/pos/pos-topbar'
import { Button } from '@/components/ui/button'
import { RefundVoidDialog } from '@/components/pos/refund-void-dialog'
import { initialLinesForTable, loadPosOrder, resolvePosContext } from '@/lib/pos-order'
import { cn } from '@/lib/utils'

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

  const total = React.useMemo(() => {
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
    setAmount(Math.ceil(total).toFixed(2))
  }, [total])

  const tendered = Number.parseFloat(amount || '0')
  const change = Math.max(0, tendered - total)

  function press(key: string) {
    if (key === 'back') return setAmount((a) => a.slice(0, -1))
    setAmount((a) => (a === '0.00' ? key : (a + key).slice(0, 8)))
  }

  return (
    <div className="flex h-dvh flex-col bg-background font-sans">
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
          <MethodButton icon={Banknote} label="Cash" active={method === 'cash'} onClick={() => setMethod('cash')} />
          <MethodButton icon={CreditCard} label="Card — External Terminal" active={method === 'card'} onClick={() => setMethod('card')} />
          <MethodButton icon={SplitSquareHorizontal} label="Split Tender" active={method === 'split'} onClick={() => setMethod('split')} />

          <div className="mt-4 rounded-xl border border-border bg-card p-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Amount Due</span>
              <span className="font-mono text-lg font-bold tabular-nums text-foreground">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1 overflow-y-auto rounded-2xl border border-border bg-card p-4 md:p-6">
          {method === 'cash' && (
            <div className="mx-auto flex max-w-sm flex-col gap-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Cash Tendered</p>
                <p className="font-mono text-4xl font-bold tabular-nums text-foreground">${tendered.toFixed(2)}</p>
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
              <div className="flex gap-3">
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
              <Button size="lg" className="w-full" onClick={() => router.push('/pos')}>
                Complete Payment
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
                Present the amount due, ${total.toFixed(2)}, to the connected card terminal at this register.
              </p>
              <p className="text-xs text-muted-foreground">Card payments are processed on your connected terminal.</p>
              <Button size="lg" className="mt-4 w-full" onClick={() => router.push('/pos')}>
                Simulate Approved
              </Button>
            </div>
          )}

          {method === 'split' && (
            <div className="mx-auto flex max-w-md flex-col gap-4">
              <p className="text-sm font-semibold text-foreground">Split Tender</p>
              <SplitRow label="Payment 1 — Visa •••• 4821" amount={Math.min(100, total)} status="Approved" />
              <SplitRow label="Payment 2 — Cash" amount={Math.max(0, total - 100)} status="Pending" />
              <div className="flex items-center justify-between rounded-lg border border-dashed border-border p-3 text-sm">
                <span className="text-muted-foreground">Remaining Balance</span>
                <span className="font-mono font-semibold tabular-nums text-warning">${Math.max(0, total - 100).toFixed(2)}</span>
              </div>
              <Button size="lg" className="w-full" onClick={() => router.push('/pos')}>
                Collect Remaining Balance
              </Button>
            </div>
          )}
        </div>
      </main>

      <RefundVoidDialog open={voidOpen} onOpenChange={setVoidOpen} />
    </div>
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

function SplitRow({ label, amount, status }: { label: string; amount: number; status: 'Approved' | 'Pending' }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
      <span className="text-foreground">{label}</span>
      <div className="flex items-center gap-3">
        <span className="font-mono tabular-nums text-foreground">${amount.toFixed(2)}</span>
        <span
          className={cn(
            'status-pill',
            status === 'Approved' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning',
          )}
        >
          {status}
        </span>
      </div>
    </div>
  )
}
