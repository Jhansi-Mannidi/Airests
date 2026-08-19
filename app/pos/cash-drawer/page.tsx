'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { Banknote, ArrowDownToLine, ArrowUpFromLine, Lock } from 'lucide-react'
import { PosTopBar } from '@/components/pos/pos-topbar'
import { cashDrawer } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export default function CashDrawerPage() {
  const [open, setOpen] = React.useState(false)
  const [counted, setCounted] = React.useState(String(cashDrawer.expected))
  const variance = Number.parseFloat(counted || '0') - cashDrawer.expected

  return (
    <div className="pos-canvas flex h-dvh flex-col">
      <PosTopBar title="Cash Drawer" backHref="/pos" />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 overflow-y-auto p-4 md:p-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ['Starting float', cashDrawer.startingFloat],
            ['Cash sales', cashDrawer.cashSales],
            ['Paid in / out', cashDrawer.paidIn - cashDrawer.paidOut],
            ['Expected', cashDrawer.expected],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-xl border border-border bg-card p-3">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-foreground">${Number(value).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Action
            icon={Lock}
            label={open ? 'Drawer open' : 'Open drawer'}
            onClick={() => {
              setOpen(true)
              toast.success('Cash drawer kicked', { description: 'No sale — drawer opened for change.' })
            }}
          />
          <Action
            icon={ArrowDownToLine}
            label="Paid in $40"
            onClick={() => toast.success('Paid in recorded', { description: '$40 added to drawer with reason: Change fund.' })}
          />
          <Action
            icon={ArrowUpFromLine}
            label="Paid out $15"
            onClick={() => toast.success('Paid out recorded', { description: '$15 petty cash — produce run.' })}
          />
          <Action
            icon={Banknote}
            label="Safe drop $200"
            onClick={() => toast.success('Drop recorded', { description: '$200 moved to safe. Drawer expected updated.' })}
          />
        </div>

        <section className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-sm font-semibold text-foreground">Shift count / reconciliation</h2>
          <p className="mt-1 text-xs text-muted-foreground">Count cash at the end of the shift. Variance must be explained before Z close.</p>
          <label className="mt-4 block text-xs font-medium text-muted-foreground">Counted cash</label>
          <input
            value={counted}
            onChange={(e) => setCounted(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <p className={cn('mt-3 text-sm font-semibold', Math.abs(variance) < 0.01 ? 'text-success' : 'text-danger')}>
            Variance {variance >= 0 ? '+' : ''}${variance.toFixed(2)}
          </p>
          <button
            onClick={() => toast.success('Drawer counted', { description: 'X report snapshot saved. Ready for Z close.' })}
            className="mt-4 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Save count
          </button>
        </section>
      </main>
    </div>
  )
}

function Action({ icon: Icon, label, onClick }: { icon: typeof Lock; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start gap-2 rounded-xl border border-border bg-card p-3 text-left hover:border-primary/40"
    >
      <Icon className="size-4 text-primary" />
      <span className="text-sm font-medium text-foreground">{label}</span>
    </button>
  )
}
