'use client'

import { useState } from 'react'
import { AdminTopbar } from '@/components/admin/admin-topbar'
import { ConnectivityChip } from '@/components/shared/status-pill'
import { brand, type ConnectivityState } from '@/lib/mock-data'
import { MoreVertical, User, Phone, Users, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

const connectivityFilters: Array<ConnectivityState | 'all'> = ['all', 'online', 'syncing', 'offline']

export default function LocationsPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<ConnectivityState | 'all'>('all')

  const locations = brand.locations.filter((loc) => {
    if (status !== 'all' && loc.connectivity !== status) return false
    const q = query.trim().toLowerCase()
    if (!q) return true
    return (
      loc.name.toLowerCase().includes(q) ||
      loc.city.toLowerCase().includes(q) ||
      loc.manager.toLowerCase().includes(q) ||
      loc.address.toLowerCase().includes(q)
    )
  })

  return (
    <>
      <AdminTopbar title="Locations" />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="w-full">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {locations.length} of {brand.locations.length} locations under {brand.tenantName}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search locations…"
                  className="w-full rounded-md border border-border bg-background py-1.5 pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring sm:w-56"
                />
              </div>
              {connectivityFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatus(filter)}
                  className={cn(
                    'rounded-full px-2.5 py-1 text-xs font-medium capitalize transition-colors',
                    status === filter ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground',
                  )}
                >
                  {filter}
                </button>
              ))}
              <button className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
                + Add Location
              </button>
            </div>
          </div>
          {locations.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
              No locations match this filter.
            </p>
          ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {locations.map((loc) => (
              <div key={loc.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{loc.name}</p>
                    <p className="text-xs text-muted-foreground">{loc.address}</p>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground">
                    <MoreVertical className="size-4" />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <ConnectivityChip state={loc.connectivity} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Sales Today</p>
                    <p className="font-mono text-sm font-semibold tabular-nums text-foreground">
                      ${loc.salesToday.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Orders</p>
                    <p className="font-mono text-sm font-semibold tabular-nums text-foreground">{loc.orders}</p>
                  </div>
                </div>
                <div className="mt-3 space-y-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <User className="size-3.5 shrink-0" />
                    <span className="truncate">Manager: <span className="text-foreground">{loc.manager}</span></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="size-3.5 shrink-0" />
                    {loc.phone}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="size-3.5 shrink-0" />
                    {loc.staffCount} staff members
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </main>
    </>
  )
}
