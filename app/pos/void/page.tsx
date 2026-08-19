'use client'

import * as React from 'react'
import { PosTopBar } from '@/components/pos/pos-topbar'
import { RefundVoidDialog } from '@/components/pos/refund-void-dialog'
import { Button } from '@/components/ui/button'
import { Undo2 } from 'lucide-react'

const history = [
  { id: '#4468', table: 'Table 3', server: 'Jordan Pierce', total: 96.2, time: '11:51 AM', method: 'Visa •••• 4821' },
  { id: '#4465', table: 'Table 1', server: 'Maria Alvarez', total: 34.5, time: '11:22 AM', method: 'Cash' },
  { id: '#4460', table: 'Takeout', server: 'Devon Shaw', total: 21.75, time: '10:58 AM', method: 'Mastercard •••• 0193' },
]

export default function VoidPage() {
  const [open, setOpen] = React.useState(true)

  return (
    <div className="pos-canvas flex h-dvh flex-col font-sans">
      <PosTopBar title="Transaction History" backHref="/pos/payment" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 text-sm font-semibold text-foreground">Closed Transactions — Today</h2>
          <div className="flex flex-col gap-2">
            {history.map((h) => (
              <div key={h.id} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">{h.id} · {h.table}</p>
                  <p className="text-xs text-muted-foreground">{h.server} · {h.time} · {h.method}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono tabular-nums text-foreground">${h.total.toFixed(2)}</span>
                  <Button variant="destructive" size="sm" className="gap-1.5" onClick={() => setOpen(true)}>
                    <Undo2 className="size-3.5" />
                    Void
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <RefundVoidDialog open={open} onOpenChange={setOpen} />
    </div>
  )
}
