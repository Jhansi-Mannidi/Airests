'use client'

import { toast } from 'sonner'
import { AdminTopbar } from '@/components/admin/admin-topbar'
import { deviceHeartbeats } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export default function ReliabilityPage() {
  return (
    <>
      <AdminTopbar title="Backups & Monitoring" />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground">Backups</h2>
            <p className="mt-1 text-xs text-muted-foreground">Last snapshot: Today 2:00 AM · Tenant isolated · Restore drill last run Aug 12.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => toast.success('Backup started')} className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">
                Run backup now
              </button>
              <button onClick={() => toast.success('Restore drill queued', { description: 'Staging tenant only — production untouched.' })} className="rounded-md border border-border px-3 py-2 text-sm font-semibold">
                Restore drill
              </button>
            </div>
          </section>
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground">Alerts</h2>
            <ul className="mt-3 space-y-2 text-sm text-foreground">
              <li>Printer latency &gt; 500 ms — Grill printer</li>
              <li>Offline queue depth 0</li>
              <li>No Sev-1 open</li>
            </ul>
          </section>
          <section className="rounded-xl border border-border bg-card xl:col-span-2">
            <div className="border-b border-border p-4">
              <h2 className="text-sm font-semibold text-foreground">Store / device heartbeats</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-4 py-2.5 font-medium">Device</th>
                  <th className="px-4 py-2.5 font-medium">Kind</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 font-medium">Latency</th>
                </tr>
              </thead>
              <tbody>
                {deviceHeartbeats.map((d) => (
                  <tr key={d.name} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-2.5 font-medium">{d.name}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{d.kind}</td>
                    <td className={cn('px-4 py-2.5 text-xs font-semibold capitalize', d.status === 'online' ? 'text-success' : 'text-warning')}>
                      {d.status}
                    </td>
                    <td className="px-4 py-2.5 font-mono tabular-nums">{d.latency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </main>
    </>
  )
}
