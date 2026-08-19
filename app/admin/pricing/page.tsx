'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Download, Search } from 'lucide-react'
import { AdminTopbar } from '@/components/admin/admin-topbar'
import { discountsCatalog } from '@/lib/mock-data'
import { Switch } from '@/components/ui/switch'
import { downloadCsv, fileStamp } from '@/lib/export'

export default function PricingPage() {
  const [query, setQuery] = useState('')
  const discounts = discountsCatalog.filter((discount) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return `${discount.name} ${discount.type} ${discount.code}`.toLowerCase().includes(q)
  })

  return (
    <>
      <AdminTopbar title="Tax, Charges & Discounts" />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground">US tax (jurisdiction-driven)</h2>
            <p className="mt-1 text-xs text-muted-foreground">Not hard-coded to one region. Austin combined rate shown as the active profile.</p>
            <div className="mt-4 space-y-3">
              <Field label="Tax profile" defaultValue="Austin Combined — 8.25%" />
              <Field label="Inclusive / exclusive" defaultValue="Exclusive (added at tender)" />
              <Field label="Rounding" defaultValue="Half-up to $0.01 (deterministic)" />
            </div>
            <button onClick={() => toast.success('Tax profile saved')} className="mt-4 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">
              Save tax
            </button>
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground">Service charge & auto-gratuity</h2>
            <div className="mt-4 space-y-3">
              <Field label="Auto-gratuity" defaultValue="20% for parties of 6+" />
              <Field label="Service charge name on check" defaultValue="Large party gratuity" />
              <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <span className="text-sm text-foreground">Taxable service charge</span>
                <Switch defaultChecked />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5 xl:col-span-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Discount engine</h2>
                <p className="mt-1 text-xs text-muted-foreground">Open amount/percent require manager PIN. All applications write an audit reason.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search discounts…"
                    className="w-full rounded-md border border-border bg-background py-1.5 pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring sm:w-52"
                  />
                </div>
                <button
                  onClick={() =>
                    downloadCsv(
                      `airests-discounts-${fileStamp()}`,
                      ['Name', 'Type', 'Value', 'Code', 'Manager PIN'],
                      discounts.map((d) => [d.name, d.type, d.value, d.code, d.managerPin ? 'Required' : 'No']),
                    )
                  }
                  className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-secondary"
                >
                  <Download className="size-4" />
                  Export CSV
                </button>
              </div>
            </div>
            <table className="mt-4 w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="py-2 font-medium">Name</th>
                  <th className="py-2 font-medium">Type</th>
                  <th className="py-2 font-medium">Value</th>
                  <th className="py-2 font-medium">Code</th>
                  <th className="py-2 font-medium">Manager PIN</th>
                </tr>
              </thead>
              <tbody>
                {discounts.map((d) => (
                  <tr key={d.id} className="border-b border-border/60">
                    <td className="py-2.5 font-medium text-foreground">{d.name}</td>
                    <td className="py-2.5 text-muted-foreground">{d.type}</td>
                    <td className="py-2.5 font-mono tabular-nums">{d.value}</td>
                    <td className="py-2.5 font-mono">{d.code}</td>
                    <td className="py-2.5">{d.managerPin ? 'Required' : 'No'}</td>
                  </tr>
                ))}
                {discounts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                      No discounts match this search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </div>
      </main>
    </>
  )
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <label className="block text-xs font-medium text-muted-foreground">
      {label}
      <input defaultValue={defaultValue} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
    </label>
  )
}
