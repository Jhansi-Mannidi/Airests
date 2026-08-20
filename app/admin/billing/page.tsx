'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { AdminTopbar } from '@/components/admin/admin-topbar'
import { CreditCard, Download } from 'lucide-react'
import { printPdf } from '@/lib/export'
import { formatUsd } from '@/lib/us-format'

const plans = [
  { name: 'Airests Starter — 1 Location', price: 149, nextBill: 'March 1, 2026' },
  { name: 'Airests Growth — 4 Locations', price: 429, nextBill: 'March 1, 2026' },
  { name: 'Airests Scale — 10 Locations', price: 899, nextBill: 'March 1, 2026' },
]

const invoices = [
  { id: 'INV-2026-002', period: 'Feb 1 – Feb 29, 2026', amount: 429, status: 'Paid' },
  { id: 'INV-2026-001', period: 'Jan 1 – Jan 31, 2026', amount: 429, status: 'Paid' },
  { id: 'INV-2025-012', period: 'Dec 1 – Dec 31, 2025', amount: 429, status: 'Paid' },
]

export default function BillingPage() {
  const [planIndex, setPlanIndex] = useState(1)
  const plan = plans[planIndex]

  function changePlan() {
    setPlanIndex((i) => (i + 1) % plans.length)
    const next = plans[(planIndex + 1) % plans.length]
    toast.success('Plan updated', { description: `${next.name} · ${formatUsd(next.price)} / month. Demo only.` })
  }

  function downloadInvoice(invoice: (typeof invoices)[number]) {
    printPdf(
      invoice.id,
      ['Field', 'Value'],
      [
        ['Invoice', invoice.id],
        ['Period', invoice.period],
        ['Amount', formatUsd(invoice.amount)],
        ['Status', invoice.status],
        ['Bill to', 'Riverside Hospitality Group'],
      ],
      'Airests billing',
    )
  }

  return (
    <>
      <AdminTopbar title="Billing" />
      <main className="flex-1 overflow-y-auto p-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:p-6">
        <div className="mx-auto w-full max-w-5xl space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
            <section className="rounded-2xl border border-border bg-card p-4 shadow-surface sm:p-5 lg:col-span-2">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">Current Plan</p>
                  <p className="mt-1 text-base font-semibold leading-snug text-foreground sm:text-lg">{plan.name}</p>
                </div>
                <button
                  type="button"
                  onClick={changePlan}
                  className="h-10 shrink-0 rounded-xl border border-border px-3.5 text-sm font-semibold text-foreground hover:bg-secondary"
                >
                  Change Plan
                </button>
              </div>
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-border bg-secondary/50 p-3.5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-card text-muted-foreground">
                  <CreditCard className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">Visa ending in 4821</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">Next billing date: {plan.nextBill}</p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-4 shadow-surface sm:p-5">
              <p className="text-sm text-muted-foreground">This Month&apos;s Estimate</p>
              <p className="mt-2 font-mono text-3xl font-semibold tabular-nums tracking-tight text-foreground">
                {formatUsd(plan.price)}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Locked in — bills {plan.nextBill}</p>
            </section>
          </div>

          <section className="rounded-2xl border border-border bg-card shadow-surface">
            <div className="border-b border-border px-4 py-3.5 sm:px-5">
              <h2 className="text-sm font-semibold text-foreground">Invoice History</h2>
            </div>

            <ul className="divide-y divide-border md:hidden">
              {invoices.map((inv) => (
                <li key={inv.id} className="px-4 py-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-mono text-sm font-semibold text-foreground">{inv.id}</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{inv.period}</p>
                    </div>
                    <span className="inline-flex shrink-0 rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success">
                      {inv.status}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="font-mono text-sm font-semibold tabular-nums text-foreground">{formatUsd(inv.amount)}</p>
                    <button
                      type="button"
                      onClick={() => downloadInvoice(inv)}
                      className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border px-3 text-sm font-medium text-foreground hover:bg-secondary"
                    >
                      <Download className="size-4" />
                      PDF
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="whitespace-nowrap px-5 py-3 font-medium">Invoice</th>
                    <th className="whitespace-nowrap px-5 py-3 font-medium">Period</th>
                    <th className="whitespace-nowrap px-5 py-3 text-right font-medium">Amount</th>
                    <th className="whitespace-nowrap px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="border-b border-border/60 last:border-0">
                      <td className="whitespace-nowrap px-5 py-3 font-mono font-medium text-foreground">{inv.id}</td>
                      <td className="whitespace-nowrap px-5 py-3 text-muted-foreground">{inv.period}</td>
                      <td className="whitespace-nowrap px-5 py-3 text-right font-mono tabular-nums text-foreground">
                        {formatUsd(inv.amount)}
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => downloadInvoice(inv)}
                          className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
                          aria-label={`Download ${inv.id}`}
                        >
                          <Download className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
