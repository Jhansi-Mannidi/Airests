'use client'

import { useState } from 'react'
import { Download, Search } from 'lucide-react'
import { AdminTopbar } from '@/components/admin/admin-topbar'
import { customers as seedCustomers } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { downloadCsv, fileStamp, printPdf } from '@/lib/export'

const visitFilters = ['All', 'Today', 'Yesterday', 'Earlier'] as const

export default function CustomersPage() {
  const [query, setQuery] = useState('')
  const [visit, setVisit] = useState<(typeof visitFilters)[number]>('All')

  const rows = seedCustomers.filter((customer) => {
    if (visit === 'Today' && customer.lastVisit !== 'Today') return false
    if (visit === 'Yesterday' && customer.lastVisit !== 'Yesterday') return false
    if (visit === 'Earlier' && (customer.lastVisit === 'Today' || customer.lastVisit === 'Yesterday')) return false
    const q = query.trim().toLowerCase()
    if (!q) return true
    return `${customer.name} ${customer.phone} ${customer.email}`.toLowerCase().includes(q)
  })

  const headers = ['Name', 'Phone', 'Email', 'Orders', 'Spend', 'Last visit']
  const exportRows = rows.map((customer) => [
    customer.name,
    customer.phone,
    customer.email,
    customer.orders,
    customer.spend.toFixed(2),
    customer.lastVisit,
  ])

  return (
    <>
      <AdminTopbar title="Customer Profiles" />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Basic V1: contact + receipt history for direct online orders. Full CRM is post-launch.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, phone, or email…"
                className="w-full rounded-md border border-border bg-background py-2 pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring sm:w-64"
              />
            </div>
            {visitFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setVisit(filter)}
                className={cn(visit === filter ? 'chip chip-active' : 'chip chip-muted')}
              >
                {filter}
              </button>
            ))}
            <button
              onClick={() => downloadCsv(`airests-customers-${fileStamp()}`, headers, exportRows)}
              className="flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
            >
              <Download className="size-4" />
              Export CSV
            </button>
            <button
              onClick={() => printPdf('Customer Profiles', headers, exportRows)}
              className="flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
            >
              <Download className="size-4" />
              Export PDF
            </button>
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Name</th>
                <th className="px-4 py-2.5 font-medium">Phone</th>
                <th className="hidden px-4 py-2.5 font-medium sm:table-cell">Email</th>
                <th className="px-4 py-2.5 text-right font-medium">Orders</th>
                <th className="px-4 py-2.5 text-right font-medium">Spend</th>
                <th className="hidden px-4 py-2.5 font-medium md:table-cell">Last visit</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-2.5 font-medium text-foreground">{c.name}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{c.phone}</td>
                  <td className="hidden px-4 py-2.5 text-muted-foreground sm:table-cell">{c.email}</td>
                  <td className="px-4 py-2.5 text-right font-mono tabular-nums">{c.orders}</td>
                  <td className="px-4 py-2.5 text-right font-mono tabular-nums">${c.spend.toFixed(2)}</td>
                  <td className="hidden px-4 py-2.5 text-muted-foreground md:table-cell">{c.lastVisit}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    No customers match this search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  )
}
