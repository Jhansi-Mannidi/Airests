'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { PosTopBar } from '@/components/pos/pos-topbar'
import { TableStatusPill } from '@/components/shared/status-pill'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { type TableStatus } from '@/lib/mock-data'
import {
  getTableEvents,
  markTableBussed,
  seatTable,
  statusLabel,
  useLiveTables,
  type LiveTable,
} from '@/lib/table-status'
import { cn } from '@/lib/utils'
import { m } from 'framer-motion'

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
  const liveTables = useLiveTables()
  const [room, setRoom] = React.useState<(typeof rooms)[number]>('Main Dining')
  const [status, setStatus] = React.useState<TableStatus | 'all'>('all')
  const [query, setQuery] = React.useState('')
  const [bussing, setBussing] = React.useState<LiveTable | null>(null)

  const tables = liveTables.filter((t) => {
    if (t.room !== room) return false
    if (status !== 'all' && t.status !== status) return false
    const q = query.trim().toLowerCase()
    if (!q) return true
    return t.label.toLowerCase().includes(q) || (t.server?.toLowerCase().includes(q) ?? false)
  })

  function openTable(table: LiveTable) {
    if (table.status === 'needs-bussing') {
      setBussing(table)
      return
    }
    if (table.status === 'open') {
      seatTable(table.id)
      toast.success(`${table.label} seated`, { description: 'Maria Alvarez opened this check.' })
    }
    router.push(`/pos/order?table=${table.id}&type=dine-in`)
  }

  function confirmBussed() {
    if (!bussing) return
    markTableBussed(bussing.id)
    toast.success(`${bussing.label} is open`, { description: 'Maria Alvarez marked the table bussed.' })
    setBussing(null)
  }

  const dirty = liveTables.filter((t) => t.status === 'needs-bussing' && t.room === room)

  return (
    <div className="pos-canvas flex h-dvh flex-col font-sans">
      <PosTopBar title="Select a Table" backHref="/pos" />

      <div className="flex flex-wrap items-center gap-2 overflow-x-auto no-scrollbar border-b border-border bg-card px-3 py-2.5 md:px-6 md:py-3">
        {rooms.map((r) => (
          <button
            key={r}
            onClick={() => setRoom(r)}
            className={cn(
              room === r ? 'chip chip-active px-4 py-1.5 text-sm' : 'chip chip-muted px-4 py-1.5 text-sm',
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

      {dirty.length > 0 && status === 'all' && (
        <p className="border-b border-danger/20 bg-danger/10 px-4 py-2 text-xs text-foreground md:px-6">
          {dirty.map((t) => t.label).join(', ')} {dirty.length === 1 ? 'needs' : 'need'} bussing. Tap the pink table, then
          <span className="font-semibold"> Mark as bussed</span> after it is wiped.
        </p>
      )}

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
              )}
            >
              <span className="text-base font-bold text-foreground">{t.label}</span>
              <span className="text-[11px] text-muted-foreground">{t.seats} seats</span>
              {t.status !== 'open' && <TableStatusPill status={t.status} />}
              {t.lastChange && (
                <span className="text-[10px] text-muted-foreground">
                  {t.lastChange.initials} · {t.lastChange.at}
                </span>
              )}
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

      <Dialog open={!!bussing} onOpenChange={(open) => !open && setBussing(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{bussing?.label} needs bussing</DialogTitle>
            <DialogDescription>
              Guests have paid and left. Do not seat anyone until plates are cleared.
            </DialogDescription>
          </DialogHeader>
          {bussing && (
            <div className="rounded-lg bg-muted/70 px-3 py-2.5 text-sm">
              <p className="font-medium text-foreground">{statusLabel(bussing.status)}</p>
              {bussing.lastChange ? (
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Set by <span className="font-semibold text-foreground">{bussing.lastChange.by}</span> at {bussing.lastChange.at}.{' '}
                  {bussing.lastChange.reason}.
                </p>
              ) : (
                <p className="mt-1 text-xs text-muted-foreground">
                  Sample dirty table from the start of this demo. Mark it bussed after you wipe it.
                </p>
              )}
              {getTableEvents(bussing.id)
                .slice(0, 3)
                .map((event) => (
                  <p key={event.id} className="mt-1 text-[11px] text-muted-foreground">
                    {event.at} · {event.by} · {statusLabel(event.from)} → {statusLabel(event.to)}
                  </p>
                ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setBussing(null)}>
              Leave dirty
            </Button>
            <Button onClick={confirmBussed}>Table is clean — mark as bussed</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function TableTile({ table, onClick }: { table: LiveTable; onClick: () => void }) {
  const isOccupied = table.status !== 'open'
  return (
    <m.button
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      style={{
        left: `${table.x}%`,
        top: `${table.y}%`,
        width: `${table.w * 3.6}%`,
        height: `${Math.max(table.h * 5.5, 14)}%`,
      }}
      className={cn(
        'absolute flex flex-col items-center justify-center gap-1 rounded-xl border-2 p-2 text-center shadow-sm',
        table.shape === 'round' && 'rounded-full',
        statusRing[table.status],
      )}
    >
      <span className="text-base font-bold text-foreground">{table.label}</span>
      <span className="text-[11px] text-muted-foreground">{table.seats} seats</span>
      {isOccupied && (
        <div className="mt-0.5 flex flex-col items-center gap-0.5">
          <TableStatusPill status={table.status} />
          {table.server && (
            <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
              {table.server} · {table.elapsed}
              {table.total ? ` · $${table.total.toFixed(2)}` : ''}
            </span>
          )}
          {table.lastChange && (
            <span className="text-[10px] leading-tight text-muted-foreground">
              by {table.lastChange.initials} {table.lastChange.at}
            </span>
          )}
        </div>
      )}
    </m.button>
  )
}
