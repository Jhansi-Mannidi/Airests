'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Search } from 'lucide-react'
import { AdminTopbar } from '@/components/admin/admin-topbar'
import { registers as seedRegisters } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const locationFilters = ['All', ...Array.from(new Set(seedRegisters.map((r) => r.location)))]

export default function DevicesPage() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('All')
  const [devices, setDevices] = useState(() => seedRegisters.map((r) => ({ ...r })))

  const rows = devices.filter((device) => {
    if (location !== 'All' && device.location !== location) return false
    const q = query.trim().toLowerCase()
    if (!q) return true
    return `${device.name} ${device.location} ${device.version}`.toLowerCase().includes(q)
  })

  return (
    <>
      <AdminTopbar title="Devices & Registers" />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Tenant → location → register pairing. Last-good config rollback is available on each bound device.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search devices…"
                className="w-full rounded-md border border-border bg-background py-1.5 pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring sm:w-52"
              />
            </div>
            {locationFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setLocation(filter)}
                className={cn(location === filter ? 'chip chip-active' : 'chip chip-muted')}
              >
                {filter}
              </button>
            ))}
            <button
              onClick={() => toast.success('Pairing code created', { description: 'Enter RG-1943 on the new Windows POS within 10 minutes.' })}
              className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Pair new register
            </button>
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Device</th>
                <th className="px-4 py-2.5 font-medium">Location</th>
                <th className="px-4 py-2.5 font-medium">Bound</th>
                <th className="hidden px-4 py-2.5 font-medium sm:table-cell">Last seen</th>
                <th className="hidden px-4 py-2.5 font-medium md:table-cell">Version</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-2.5 font-medium text-foreground">{r.name}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{r.location}</td>
                  <td className="px-4 py-2.5">
                    <span className={cn('text-xs font-semibold', r.bound ? 'text-success' : 'text-warning')}>
                      {r.bound ? 'Paired' : 'Unbound'}
                    </span>
                  </td>
                  <td className="hidden px-4 py-2.5 text-muted-foreground sm:table-cell">{r.lastSeen}</td>
                  <td className="hidden px-4 py-2.5 text-muted-foreground md:table-cell">{r.version}</td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      onClick={() => {
                        if (!r.bound) {
                          setDevices((prev) =>
                            prev.map((d) => (d.id === r.id ? { ...d, bound: true, lastSeen: 'Just now', version: 'POS 1.4.2' } : d)),
                          )
                          toast.success('Device bound', { description: r.name })
                          return
                        }
                        toast.success('Rollback queued', { description: r.name })
                      }}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      {r.bound ? 'Rollback config' : 'Bind now'}
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    No devices match this filter.
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
