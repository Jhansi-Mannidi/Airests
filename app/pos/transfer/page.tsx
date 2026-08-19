'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { PosTopBar } from '@/components/pos/pos-topbar'
import { staff, openChecks } from '@/lib/mock-data'
import { transferParty, useLiveTables } from '@/lib/table-status'
import { cn } from '@/lib/utils'

export default function TransferPage() {
  const liveTables = useLiveTables()
  const seated = liveTables.filter((t) => t.status === 'seated' || t.status === 'check-printed')
  const open = liveTables.filter((t) => t.status === 'open')
  const servers = staff.filter((s) => s.role === 'Server' || s.role === 'Bartender')
  const [fromTable, setFromTable] = React.useState(seated[0]?.id ?? '')
  const [toTable, setToTable] = React.useState(open[0]?.id ?? '')
  const [server, setServer] = React.useState(servers[1]?.id ?? '')
  const [mergeInto, setMergeInto] = React.useState(openChecks[1]?.id ?? '')

  const from = seated.find((t) => t.id === fromTable)

  return (
    <div className="pos-canvas flex h-dvh flex-col">
      <PosTopBar title="Table & Server Transfers" backHref="/pos" />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 overflow-y-auto p-4 md:p-6">
        <section className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-sm font-semibold text-foreground">Move a party to another table</h2>
          <p className="mt-1 text-xs text-muted-foreground">Keeps the open check, items, and kitchen tickets with the guests.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="From">
              <select value={fromTable} onChange={(e) => setFromTable(e.target.value)} className={selectClass}>
                {seated.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label} · {t.server} · {t.room}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="To (open tables)">
              <select value={toTable} onChange={(e) => setToTable(e.target.value)} className={selectClass}>
                {open.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label} · {t.seats} seats · {t.room}
                    </option>
                  ))}
              </select>
            </Field>
          </div>
          <button
            onClick={() => {
              const dest = liveTables.find((t) => t.id === toTable)
              transferParty(fromTable, toTable)
              toast.success(`Transferred ${from?.label} → ${dest?.label}`, {
                description: 'Maria Alvarez moved the party. Floor status updated.',
              })
            }}
            className="mt-4 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Transfer table
          </button>
        </section>

        <section className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-sm font-semibold text-foreground">Reassign server</h2>
          <p className="mt-1 text-xs text-muted-foreground">Tips and server reports follow the new owner after the transfer.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Check / table">
              <select value={fromTable} onChange={(e) => setFromTable(e.target.value)} className={selectClass}>
                {seated.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label} currently {t.server}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="New server">
              <select value={server} onChange={(e) => setServer(e.target.value)} className={selectClass}>
                {servers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <button
            onClick={() => toast.success('Server reassigned', { description: `${servers.find((s) => s.id === server)?.name} now owns this check.` })}
            className="mt-4 w-full rounded-lg border border-border py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
          >
            Transfer server
          </button>
        </section>

        <section className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-sm font-semibold text-foreground">Merge checks</h2>
          <p className="mt-1 text-xs text-muted-foreground">Combine two open checks onto one bill. Items stay itemized.</p>
          <Field label="Merge into">
            <select value={mergeInto} onChange={(e) => setMergeInto(e.target.value)} className={cn(selectClass, 'mt-2')}>
              {openChecks.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label} · {c.server} · ${c.total.toFixed(2)}
                </option>
              ))}
            </select>
          </Field>
          <button
            onClick={() => toast.success('Checks merged', { description: `${from?.label} folded into ${openChecks.find((c) => c.id === mergeInto)?.label}.` })}
            className="mt-4 w-full rounded-lg border border-border py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
          >
            Merge {from?.label} into selected check
          </button>
        </section>
      </main>
    </div>
  )
}

const selectClass =
  'w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium text-muted-foreground">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  )
}
