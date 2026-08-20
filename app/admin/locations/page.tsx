'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { AdminTopbar } from '@/components/admin/admin-topbar'
import { ConnectivityChip } from '@/components/shared/status-pill'
import { brand, type ConnectivityState } from '@/lib/mock-data'
import { US_STATES, formatUsAddress } from '@/lib/us-address'
import { formatUsPhone, formatUsd } from '@/lib/us-format'
import { MoreVertical, User, Phone, Users, Search, X, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { downloadCsv, fileStamp } from '@/lib/export'

const connectivityFilters: Array<ConnectivityState | 'all'> = ['all', 'online', 'syncing', 'offline']

type LocationRow = (typeof brand.locations)[number]

const emptyForm = { name: '', street: '', city: 'Austin', state: 'TX', zip: '', manager: '', phone: '' }

export default function LocationsPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<ConnectivityState | 'all'>('all')
  const [sites, setSites] = useState<LocationRow[]>(() => brand.locations.map((loc) => ({ ...loc })))
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [menuId, setMenuId] = useState<string | null>(null)

  const locations = sites.filter((loc) => {
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

  function addLocation() {
    if (!form.name.trim() || !form.street.trim() || !form.city.trim() || !form.state.trim() || !form.zip.trim()) {
      toast.error('Name and a full U.S. address are required')
      return
    }
    const address = formatUsAddress({
      street: form.street,
      apt: '',
      city: form.city,
      state: form.state,
      zip: form.zip,
    })
    setSites((prev) => [
      ...prev,
      {
        id: `loc-${Date.now()}`,
        name: form.name.trim(),
        city: `${form.city.trim()}, ${form.state.trim()}`,
        address,
        manager: form.manager.trim() || 'Unassigned',
        phone: formatUsPhone(form.phone) || '(512) 555-0100',
        staffCount: 0,
        salesToday: 0,
        orders: 0,
        connectivity: 'offline',
      },
    ])
    toast.success('Location added', { description: 'Demo only — not saved to a server.' })
    setForm(emptyForm)
    setAddOpen(false)
  }

  return (
    <>
      <AdminTopbar title="Locations" />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="w-full">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {locations.length} of {sites.length} locations under {brand.tenantName}
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
                  className={cn(status === filter ? 'chip chip-active capitalize' : 'chip chip-muted capitalize')}
                >
                  {filter}
                </button>
              ))}
              <button
                onClick={() =>
                  downloadCsv(
                    `airests-locations-${fileStamp()}`,
                    ['Name', 'City', 'Address', 'Manager', 'Phone', 'Staff', 'Sales today', 'Orders', 'Status'],
                    locations.map((loc) => [
                      loc.name,
                      loc.city,
                      loc.address,
                      loc.manager,
                      loc.phone,
                      loc.staffCount,
                      loc.salesToday.toFixed(2),
                      loc.orders,
                      loc.connectivity,
                    ]),
                  )
                }
                className="flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
              >
                <Download className="size-4" />
                Export
              </button>
              <button
                onClick={() => setAddOpen(true)}
                className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
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
                <div key={loc.id} className="relative rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-hover">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{loc.name}</p>
                      <p className="text-xs text-muted-foreground">{loc.address}</p>
                    </div>
                    <button
                      onClick={() => setMenuId((id) => (id === loc.id ? null : loc.id))}
                      className="text-muted-foreground hover:text-foreground"
                      aria-label={`${loc.name} actions`}
                    >
                      <MoreVertical className="size-4" />
                    </button>
                  </div>
                  {menuId === loc.id && (
                    <div className="absolute right-3 top-10 z-10 w-40 rounded-lg border border-border bg-card p-1 shadow-elevated">
                      <button
                        className="w-full rounded-md px-2.5 py-1.5 text-left text-xs font-medium hover:bg-secondary"
                        onClick={() => {
                          toast.message(loc.name, { description: `${loc.manager} · ${loc.phone}` })
                          setMenuId(null)
                        }}
                      >
                        View details
                      </button>
                      <button
                        className="w-full rounded-md px-2.5 py-1.5 text-left text-xs font-medium text-danger hover:bg-secondary"
                        onClick={() => {
                          setSites((prev) => prev.filter((site) => site.id !== loc.id))
                          toast.success('Location removed from this session')
                          setMenuId(null)
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <ConnectivityChip state={loc.connectivity} />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Sales Today</p>
                      <p className="font-mono text-sm font-semibold tabular-nums text-foreground">
                        {formatUsd(loc.salesToday)}
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
                      <span className="truncate">
                        Manager: <span className="text-foreground">{loc.manager}</span>
                      </span>
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

      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-scrim p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold">Add location</h2>
              <button onClick={() => setAddOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>
            <div className="space-y-3">
              <label className="block text-xs font-medium text-muted-foreground">
                Name
                <input
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Riverside Grill — East Austin"
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <label className="block text-xs font-medium text-muted-foreground">
                Street address
                <input
                  value={form.street}
                  onChange={(e) => setForm((prev) => ({ ...prev, street: e.target.value }))}
                  placeholder="1200 E 6th St"
                  autoComplete="street-address"
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-[1fr_5.5rem_7rem]">
                <label className="col-span-2 block text-xs font-medium text-muted-foreground sm:col-span-1">
                  City
                  <input
                    value={form.city}
                    onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
                    placeholder="Austin"
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>
                <label className="block text-xs font-medium text-muted-foreground">
                  State
                  <select
                    value={form.state}
                    onChange={(e) => setForm((prev) => ({ ...prev, state: e.target.value }))}
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  >
                    {US_STATES.map((state) => (
                      <option key={state.code} value={state.code}>
                        {state.code}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-xs font-medium text-muted-foreground">
                  ZIP
                  <input
                    value={form.zip}
                    onChange={(e) => setForm((prev) => ({ ...prev, zip: e.target.value.replace(/[^\d-]/g, '').slice(0, 10) }))}
                    placeholder="78702"
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>
              </div>
              <label className="block text-xs font-medium text-muted-foreground">
                Manager
                <input
                  value={form.manager}
                  onChange={(e) => setForm((prev) => ({ ...prev, manager: e.target.value }))}
                  placeholder="Elena Cruz"
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <label className="block text-xs font-medium text-muted-foreground">
                Phone
                <input
                  value={form.phone}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: formatUsPhone(e.target.value) }))}
                  placeholder="(512) 555-0100"
                  type="tel"
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setAddOpen(false)} className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary">
                Cancel
              </button>
              <button onClick={addLocation} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                Add location
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
