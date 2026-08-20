'use client'

import { toast } from 'sonner'
import { PosTopBar } from '@/components/pos/pos-topbar'
import { printQueue } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export default function PrintCenterPage() {
  return (
    <div className="pos-canvas flex h-dvh flex-col">
      <PosTopBar title="Receipts & Kitchen Tickets" backHref="/pos" />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 overflow-y-auto p-4 md:p-6">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Guest receipt preview</p>
          <div className="mt-3 rounded-lg border border-dashed border-border bg-background px-6 py-5 font-mono text-xs leading-relaxed text-foreground">
            <p className="text-center text-sm font-bold">RIVERSIDE GRILL</p>
            <p className="text-center">412 Colorado St · Downtown</p>
            <p className="text-center">Register 2 · Maria Alvarez</p>
            <p className="my-3 border-t border-dashed border-border" />
            <p>Smash Burger ×1 ............ $12.50</p>
            <p className="text-muted-foreground">  American, Medium</p>
            <p>Sales tax 8.25% .................... $1.03</p>
            <p className="font-bold">Total ....................... $13.53</p>
            <p className="my-3 border-t border-dashed border-border" />
            <p className="text-center">Tip line: __________</p>
            <p className="text-center">Thank you — airests.app</p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                window.print()
                toast.success('Print dialog opened', { description: 'Choose the Register 2 printer or Save as PDF.' })
              }}
              className="rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Print receipt
            </button>
            <button
              onClick={() => toast.success('Receipt emailed', { description: 'Sent to jamie.rodriguez@email.com' })}
              className="rounded-lg border border-border py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
            >
              Email receipt
            </button>
          </div>
        </div>

        <section className="rounded-xl border border-border bg-card">
          <div className="border-b border-border p-4">
            <h2 className="text-sm font-semibold text-foreground">Print queue (KOT + receipts)</h2>
            <p className="text-xs text-muted-foreground">Failed jobs retry automatically, then wait here for a reprint.</p>
          </div>
          <ul>
            {printQueue.map((job) => (
              <li key={job.id} className="flex items-center justify-between border-b border-border/60 px-4 py-3 last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {job.type} · {job.check}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {job.target} · {job.time}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize',
                      job.status === 'printed' && 'bg-success/15 text-success',
                      job.status === 'retry' && 'bg-warning/15 text-warning',
                      job.status === 'queued' && 'bg-muted text-muted-foreground',
                    )}
                  >
                    {job.status}
                  </span>
                  <button
                    onClick={() => toast.success(`Reprinted ${job.type}`, { description: job.target })}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Reprint
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}
