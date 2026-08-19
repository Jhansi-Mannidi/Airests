'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { AdminTopbar } from '@/components/admin/admin-topbar'
import { floorTables, type FloorTable } from '@/lib/mock-data'
import { TableStatusPill } from '@/components/shared/status-pill'
import { cn } from '@/lib/utils'
import { m } from 'framer-motion'
import { Stagger, StaggerItem } from '@/components/motion/primitives'
import { Search } from 'lucide-react'

const rooms = ['Main Dining', 'Patio', 'Bar'] as const

export default function FloorSetupPage() {
  const [tables, setTables] = useState<FloorTable[]>(() => floorTables.map((table) => ({ ...table })))
  const [query, setQuery] = useState('')
  const [roomFilter, setRoomFilter] = useState<(typeof rooms)[number] | 'All'>('All')

  function addTable(room: (typeof rooms)[number]) {
    const inRoom = tables.filter((table) => table.room === room)
    const nextNumber = inRoom.length + 1
    const prefix = room === 'Patio' ? 'P' : room === 'Bar' ? 'B' : 'T'
    const table: FloorTable = {
      id: `new-${Date.now()}`,
      label: `${prefix}${nextNumber}`,
      seats: 4,
      shape: 'square',
      room,
      status: 'open',
      x: 8,
      y: 8,
      w: 3,
      h: 3,
    }
    setTables((prev) => [...prev, table])
    toast.success(`Table ${table.label} added to ${room}`)
  }

  const visible = tables.filter((table) => {
    if (roomFilter !== 'All' && table.room !== roomFilter) return false
    const q = query.trim().toLowerCase()
    if (!q) return true
    return `${table.label} ${table.room} ${table.shape} ${table.status}`.toLowerCase().includes(q)
  })

  return (
    <>
      <AdminTopbar title="Floor & Tables" />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Full-service floor layout. QSR mode can hide this screen. Seats, shape, and room drive POS table selection.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tables…"
                className="w-full rounded-md border border-border bg-background py-1.5 pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring sm:w-48"
              />
            </div>
            {(['All', ...rooms] as const).map((room) => (
              <button
                key={room}
                onClick={() => setRoomFilter(room)}
                className={cn(roomFilter === room ? 'chip chip-active' : 'chip chip-muted')}
              >
                {room}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          {(roomFilter === 'All' ? rooms : [roomFilter]).map((room) => (
            <section key={room} className="rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <h2 className="text-sm font-semibold text-foreground">{room}</h2>
                <button
                  onClick={() => addTable(room)}
                  className="text-xs font-semibold text-primary transition-colors hover:text-primary-hover"
                >
                  + Add table
                </button>
              </div>
              <Stagger className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 lg:grid-cols-4" delay={0.03}>
                {visible
                  .filter((t) => t.room === room)
                  .map((t) => (
                    <StaggerItem key={t.id} hover>
                      <m.button
                        type="button"
                        onClick={() => toast.message(`${t.label} settings`, { description: `${t.seats} seats · ${t.shape} · ${t.room}` })}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          'w-full rounded-xl border border-border bg-background p-3.5 text-left hover:border-primary/40 hover:shadow-hover',
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-foreground">{t.label}</p>
                          <TableStatusPill status={t.status} />
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {t.seats} seats · {t.shape}
                        </p>
                      </m.button>
                    </StaggerItem>
                  ))}
              </Stagger>
            </section>
          ))}
        </div>
      </main>
    </>
  )
}
