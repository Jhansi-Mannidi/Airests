import { WifiOff, RefreshCw, Receipt } from 'lucide-react'
import { PosTopBar, OfflineBanner } from '@/components/pos/pos-topbar'
import { openChecks } from '@/lib/mock-data'

const queue = [
  { id: 'sync-1', label: 'Table 4 — New Order', time: '12:06 PM' },
  { id: 'sync-2', label: 'Takeout #4471 — Payment (Cash)', time: '12:04 PM' },
  { id: 'sync-3', label: 'Table 6 — Item Fired to Kitchen', time: '12:01 PM' },
]

export default function OfflinePage() {
  return (
    <div className="pos-canvas flex h-dvh flex-col font-sans">
      <PosTopBar title="Start an Order" backHref="/pos" connectivity="offline" pendingSync={queue.length} />
      <OfflineBanner pendingCount={queue.length} />

      <main className="flex flex-1 flex-col gap-6 overflow-y-auto p-6 md:flex-row md:p-8">
        <section className="flex-1">
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-warning/40 bg-warning/5 p-8 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-warning/15 text-warning">
              <WifiOff className="size-7" />
            </span>
            <h2 className="text-lg font-semibold text-foreground">Register is Offline</h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              You can keep taking orders and collecting payments as usual. Everything is saved to this register and
              will sync automatically once connection returns.
            </p>
            <p className="text-xs text-muted-foreground">Card payments depend on your terminal&apos;s own connection.</p>
          </div>

          <div className="mt-6">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Open Checks</h3>
            <div className="flex flex-col gap-2">
              {openChecks.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{c.label}</p>
                    <p className="text-xs text-muted-foreground">{c.server} · {c.type}</p>
                  </div>
                  <span className="font-mono text-sm font-semibold tabular-nums text-foreground">${c.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full shrink-0 md:w-[360px]">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Sync Queue</h3>
            <span className="rounded-full bg-warning/15 px-2 py-0.5 text-xs font-semibold text-warning">{queue.length} pending</span>
          </div>
          <div className="flex flex-col gap-2">
            {queue.map((q) => (
              <div key={q.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                  <Receipt className="size-4" />
                </span>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{q.label}</p>
                  <p className="text-xs text-muted-foreground">{q.time}</p>
                </div>
                <RefreshCw className="size-3.5 shrink-0 animate-spin text-muted-foreground" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
