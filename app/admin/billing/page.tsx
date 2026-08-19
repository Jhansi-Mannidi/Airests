'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { AdminTopbar } from '@/components/admin/admin-topbar'
import { CreditCard, Download } from 'lucide-react'
import { printPdf } from '@/lib/export'

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
    toast.success('Plan updated', { description: `${next.name} · $${next.price.toFixed(2)} / month. Demo only.` })
  }

  function downloadInvoice(invoice: (typeof invoices)[number]) {
    printPdf(
      invoice.id,
      ['Field', 'Value'],
      [
        ['Invoice', invoice.id],
        ['Period', invoice.period],
        ['Amount', `$${invoice.amount.toFixed(2)}`],
        ['Status', invoice.status],
        ['Bill to', 'Riverside Hospitality Group'],
      ],
      'Airests billing',
    )
  }

  return (
    <>
      <AdminTopbar title="Billing" />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="w-full space-y-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <section className="rounded-xl border border-border bg-card p-5 xl:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Plan</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">{plan.name}</p>
                </div>
                <button
                  onClick={changePlan}
                  className="rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  Change Plan
                </button>
              </div>
              <div className="mt-4 flex items-center gap-3 rounded-lg border border-border bg-secondary/50 p-3">
                <CreditCard className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Visa ending in 4821</p>
                  <p className="text-xs text-muted-foreground">Next billing date: {plan.nextBill}</p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">This Month&apos;s Estimate</p>
              <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-foreground">${plan.price.toFixed(2)}</p>
              <p className="mt-1 text-xs text-muted-foreground">Locked in — bills {plan.nextBill}</p>
            </section>
          </div>

          <section className="rounded-xl border border-border bg-card">
            <div className="border-b border-border p-4">
              <h2 className="text-sm font-semibold text-foreground">Invoice History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="px-4 py-2.5 font-medium">Invoice</th>
                    <th className="px-4 py-2.5 font-medium">Period</th>
                    <th className="px-4 py-2.5 text-right font-medium">Amount</th>
                    <th className="px-4 py-2.5 font-medium">Status</th>
                    <th className="px-2 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="border-b border-border/60 last:border-0">
                      <td className="px-4 py-2.5 font-medium text-foreground">{inv.id}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{inv.period}</td>
                      <td className="px-4 py-2.5 text-right font-mono tabular-nums text-foreground">${inv.amount.toFixed(2)}</td>
                      <td className="px-4 py-2.5">
                        <span className="inline-flex rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-2 py-2.5 text-right">
                        <button
                          onClick={() => downloadInvoice(inv)}
                          className="text-muted-foreground hover:text-foreground"
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
