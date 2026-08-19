'use client'

import { useState } from 'react'
import { AdminTopbar } from '@/components/admin/admin-topbar'
import { failedEvents } from '@/lib/mock-data'
import { toast } from 'sonner'
import { RotateCw, Wrench, Sparkles, CheckCircle2, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = ['Payment Adapter', 'Delivery Aggregator Adapter'] as const

const healthByTab: Record<(typeof tabs)[number], { status: string; tone: string; lastWebhook: string; errorRate: string; provider: string }> = {
  'Payment Adapter': { status: 'Connected — Live', tone: 'success', lastWebhook: 'Today, 12:41 PM', errorRate: '0.8%', provider: 'Stripe Terminal · Sandbox off' },
  'Delivery Aggregator Adapter': { status: 'Connected — Mock', tone: 'warning', lastWebhook: 'Today, 11:58 AM', errorRate: '2.1%', provider: 'DoorDash + Uber Eats' },
}

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('Payment Adapter')
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set())
  const [query, setQuery] = useState('')
  const [testing, setTesting] = useState(false)
  const eventType = activeTab === 'Payment Adapter' ? 'Payment Webhook' : 'Delivery Adapter'
  const events = failedEvents.filter((e) => {
    if (e.type !== eventType || resolvedIds.has(e.id)) return false
    const q = query.trim().toLowerCase()
    if (!q) return true
    return `${e.type} ${e.reason} ${e.timestamp}`.toLowerCase().includes(q)
  })
  const health = healthByTab[activeTab]

  return (
    <>
      <AdminTopbar title="Integrations" />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="w-full space-y-6">
          <div className="flex gap-1 rounded-lg bg-muted p-1 sm:w-fit">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors sm:flex-initial',
                  activeTab === tab ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Health card */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className={cn('size-2 rounded-full', health.tone === 'success' ? 'bg-success' : 'bg-warning')} />
                  <h2 className="text-base font-semibold text-foreground">{health.status}</h2>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{health.provider}</p>
              </div>
              <button
                onClick={() => {
                  setTesting(true)
                  window.setTimeout(() => {
                    setTesting(false)
                    toast.success('Connection healthy', { description: health.provider })
                  }, 600)
                }}
                className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-secondary"
              >
                <RotateCw className={cn('size-3.5', testing && 'animate-spin')} />
                {testing ? 'Testing…' : 'Test Connection'}
              </button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Last Successful Webhook</p>
                <p className="mt-0.5 text-sm font-medium text-foreground">{health.lastWebhook}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Error Rate (24h)</p>
                <p className="mt-0.5 font-mono text-sm font-medium tabular-nums text-foreground">{health.errorRate}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Environment</p>
                <p className="mt-0.5 text-sm font-medium text-foreground">Production</p>
              </div>
            </div>
          </div>

          {/* Exceptions table */}
          <section className="rounded-xl border border-border bg-card">
            <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Exceptions Needing Manual Review</h2>
                <p className="text-xs text-muted-foreground">{events.length} open exception{events.length === 1 ? '' : 's'}</p>
              </div>
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search exceptions…"
                  className="w-full rounded-md border border-border bg-background py-1.5 pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring sm:w-56"
                />
              </div>
            </div>

            {events.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
                <CheckCircle2 className="size-10 text-success" />
                <p className="text-sm font-medium text-foreground">No exceptions — all systems healthy</p>
                <p className="text-xs text-muted-foreground">We&apos;ll notify you if anything needs attention.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-muted-foreground">
                      <th className="px-4 py-2.5 font-medium">Event</th>
                      <th className="hidden px-4 py-2.5 font-medium sm:table-cell">Timestamp</th>
                      <th className="px-4 py-2.5 font-medium">Reason</th>
                      <th className="hidden px-4 py-2.5 font-medium md:table-cell">Retries</th>
                      <th className="px-4 py-2.5 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((ev) => (
                      <tr key={ev.id} className="border-b border-border/60 last:border-0">
                        <td className="px-4 py-2.5 font-medium text-foreground">{ev.type}</td>
                        <td className="hidden px-4 py-2.5 text-muted-foreground sm:table-cell">{ev.timestamp}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{ev.reason}</td>
                        <td className="hidden px-4 py-2.5 font-mono tabular-nums text-foreground md:table-cell">{ev.retries}</td>
                        <td className="px-4 py-2.5">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                toast.success('Retry queued', { description: ev.reason })
                                setResolvedIds((prev) => new Set(prev).add(ev.id))
                              }}
                              className="flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-secondary"
                            >
                              <RotateCw className="size-3.5" />
                              Retry
                            </button>
                            <button
                              onClick={() => setResolvedIds((prev) => new Set(prev).add(ev.id))}
                              className="flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-secondary"
                            >
                              <Wrench className="size-3.5" />
                              Resolve
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <div className="flex items-start gap-2 rounded-lg border border-info/30 bg-info/10 p-3 text-sm text-foreground">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-info" />
            <p>Exceptions older than 24 hours are automatically escalated to your integration support queue.</p>
          </div>
        </div>
      </main>
    </>
  )
}
