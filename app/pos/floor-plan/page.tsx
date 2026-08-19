'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { PosTopBar } from '@/components/pos/pos-topbar'
import { TableStatusPill } from '@/components/shared/status-pill'
import { floorTables, type FloorTable, type TableStatus } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const rooms = ['Main Dining', 'Patio', 'Bar'] as const
const statuses: { id: TableStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'open', label: 'Open' },
  { id: 'seated', label: 'Seated' },
  { id: 'check-printed', label: 'Check Printed' },
  { id: 'needs-bussing', label: 'Needs Bussing' },
]

const statusRing: Record<string, string> = {
  open: 'border-border bg-card',
  seated: 'border-info/50 bg-info/10',
  'check-printed': 'border-warning/50 bg-warning/10',
  'needs-bussing': 'border-danger/50 bg-danger/10',
}

export default function FloorPlanPage() {
  const router = useRouter()
  const [room, setRoom] = React.useState<typeof rooms[number]>('Main Dining')
  const [status, setStatus] = React.useState<TableStatus | 'all'>('all')
  const [query, setQuery] = React.useState('')

  const tables = floorTables.filter((t) => {
    if (t.room !== room) return false
    if (status !== 'all' && t.status !== status) return false
    const q = query.trim().toLowerCase()
    if (!q) return true
    return (
      t.label.toLowerCase().includes(q) ||
      (t.server?.toLowerCase().includes(q) ?? false)
    )
  })

  function openTable(table: FloorTable) {
    if (table.status === 'needs-bussing') return
    router.push(`/pos/order?table=${table.id}&type=dine-in`)
  }

  return (
    <div className="flex h-dvh flex-col bg-background font-sans">
      <PosTopBar title="Select a Table" backHref="/pos" />

      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-card px-3 py-2.5 md:px-6 md:py-3">
        {rooms.map((r) => (
          <button
            key={r}
            onClick={() => setRoom(r)}
            className={cn(
              'rounded-full px-3 py-1.5 text-sm font-medium transition-colors md:px-4',
              room === r ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary',
            )}
          >
            {r}
          </button>
        ))}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search table…"
          className="h-9 w-full rounded-full border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring sm:ml-2 sm:w-40"
        />
        <div className="flex w-full flex-wrap items-center gap-2 text-xs text-muted-foreground md:ml-auto md:w-auto">
          {statuses.map((s) => (
            <button
              key={s.id}
              onClick={() => setStatus(s.id)}
              className={cn(
                'rounded-full px-2.5 py-1 font-medium transition-colors',
                status === s.id ? 'bg-secondary text-foreground' : 'hover:text-foreground',
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <main className="relative flex-1 overflow-auto bg-[radial-gradient(circle_at_1px_1px,theme(colors.border)_1px,transparent_0)] [background-size:24px_24px] p-4 md:p-8">
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {tables.length === 0 && (
            <p className="col-span-2 py-10 text-center text-sm text-muted-foreground">No tables match this filter.</p>
          )}
          {tables.map((t) => (
            <button
              key={t.id}
              onClick={() => openTable(t)}
              className={cn(
                'flex min-h-[5.5rem] flex-col items-start justify-center gap-1 rounded-xl border-2 p-3 text-left',
                statusRing[t.status],
                t.status === 'needs-bussing' && 'cursor-not-allowed opacity-80',
              )}
            >
              <span className="text-base font-bold text-foreground">{t.label}</span>
              <span className="text-[11px] text-muted-foreground">{t.seats} seats</span>
              {t.status !== 'open' && <TableStatusPill status={t.status} />}
            </button>
          ))}
        </div>
        <div className="relative mx-auto hidden min-h-[36rem] max-w-5xl md:block">
          {tables.length === 0 && (
            <p className="pt-16 text-center text-sm text-muted-foreground">No tables match this filter.</p>
          )}
          {tables.map((t) => (
            <TableTile key={t.id} table={t} onClick={() => openTable(t)} />
          ))}
        </div>
      </main>
    </div>
  )
}

function TableTile({ table, onClick }: { table: FloorTable; onClick: () => void }) {
  const isOccupied = table.status !== 'open'
  return (
    <button
      onClick={onClick}
      style={{
        left: `${table.x}%`,
        top: `${table.y}%`,
        width: `${table.w * 3.6}%`,
        height: `${Math.max(table.h * 5.5, 14)}%`,
      }}
      className={cn(
        'absolute flex flex-col items-center justify-center gap-1 rounded-xl border-2 p-2 text-center shadow-sm transition-transform hover:scale-[1.03]',
        table.shape === 'round' && 'rounded-full',
        statusRing[table.status],
        table.status === 'needs-bussing' && 'cursor-not-allowed opacity-80',
      )}
    >
      <span className="text-base font-bold text-foreground">{table.label}</span>
      <span className="text-[11px] text-muted-foreground">{table.seats} seats</span>
      {isOccupied && (
        <div className="mt-0.5 flex flex-col items-center gap-0.5">
          <TableStatusPill status={table.status} />
          {table.server && (
            <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
              {table.server} · {table.elapsed}{table.total ? ` · $${table.total.toFixed(2)}` : ''}
            </span>
          )}
        </div>
      )}
    </button>
  )
}
