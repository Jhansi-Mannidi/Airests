import { useEffect, useState } from 'react'
import { floorTables, type FloorTable, type TableStatus } from '@/lib/mock-data'

export type TableStatusEvent = {
  id: string
  tableId: string
  from: TableStatus
  to: TableStatus
  by: string
  initials: string
  at: string
  reason: string
}

export type LiveTable = FloorTable & {
  lastChange?: TableStatusEvent
}

export const POS_ACTOR = { name: 'Maria Alvarez', initials: 'MA' }

const STORAGE_KEY = 'airests-floor-live'
const listeners = new Set<() => void>()

type FloorStore = {
  tables: Record<string, LiveTable>
  events: TableStatusEvent[]
}

let cached: FloorStore | null = null

function emit() {
  listeners.forEach((listener) => listener())
}

export function subscribeFloor(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function stamp() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function seedStore(): FloorStore {
  const tables: Record<string, LiveTable> = {}
  for (const table of floorTables) {
    tables[table.id] = { ...table }
  }
  return { tables, events: [] }
}

function loadStore(): FloorStore {
  if (typeof window === 'undefined') return seedStore()
  if (cached) return cached
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) {
      cached = seedStore()
      return cached
    }
    const parsed = JSON.parse(raw) as FloorStore
    if (!parsed?.tables) {
      cached = seedStore()
      return cached
    }
    cached = parsed
    return cached
  } catch {
    cached = seedStore()
    return cached
  }
}

function saveStore(store: FloorStore) {
  cached = store
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  }
  emit()
}

export function getLiveTables(): LiveTable[] {
  const store = loadStore()
  return floorTables.map((base) => store.tables[base.id] ?? { ...base })
}

export function getLiveTable(id: string | null | undefined): LiveTable | null {
  if (!id) return null
  return getLiveTables().find((t) => t.id === id) ?? null
}

export function getTableEvents(tableId: string) {
  return loadStore().events.filter((e) => e.tableId === tableId)
}

export function statusLabel(status: TableStatus) {
  if (status === 'needs-bussing') return 'Needs Bussing'
  if (status === 'check-printed') return 'Check Printed'
  if (status === 'seated') return 'Seated'
  return 'Open'
}

export function setTableStatus(
  tableId: string,
  to: TableStatus,
  reason: string,
  actor: { name: string; initials: string } = POS_ACTOR,
) {
  const store = loadStore()
  const current = store.tables[tableId] ?? floorTables.find((t) => t.id === tableId)
  if (!current) return
  if (current.status === to) return

  const event: TableStatusEvent = {
    id: `ev-${Date.now()}`,
    tableId,
    from: current.status,
    to,
    by: actor.name,
    initials: actor.initials,
    at: stamp(),
    reason,
  }

  const next: LiveTable = {
    ...current,
    status: to,
    lastChange: event,
  }

  if (to === 'open') {
    next.server = undefined
    next.elapsed = undefined
    next.total = 0
  }
  if (to === 'seated') {
    next.server = actor.initials
    next.elapsed = next.elapsed && next.elapsed !== '—' ? next.elapsed : 'just now'
  }
  if (to === 'needs-bussing') {
    next.elapsed = '—'
  }

  saveStore({
    tables: { ...store.tables, [tableId]: next },
    events: [event, ...store.events].slice(0, 40),
  })
}

export function seatTable(tableId: string) {
  const table = getLiveTable(tableId)
  if (!table || table.status === 'seated' || table.status === 'check-printed') return
  setTableStatus(tableId, 'seated', 'Guests seated — check opened on POS')
}

export function printGuestCheck(tableId: string) {
  const table = getLiveTable(tableId)
  if (!table || table.status === 'needs-bussing' || table.status === 'open') return
  setTableStatus(tableId, 'check-printed', 'Guest check printed / presented')
}

export function closePaidTable(tableId: string) {
  const table = getLiveTable(tableId)
  if (!table) return
  setTableStatus(tableId, 'needs-bussing', 'Check paid in full — guests left, table dirty')
}

export function markTableBussed(tableId: string) {
  setTableStatus(tableId, 'open', 'Table cleared and reset — ready to seat')
}

export function transferParty(fromId: string, toId: string) {
  const store = loadStore()
  const from = store.tables[fromId]
  const to = store.tables[toId]
  if (!from || !to) return
  setTableStatus(fromId, 'open', `Party moved to ${to.label}`)
  setTableStatus(toId, 'seated', `Party transferred from ${from.label}`)
  const latest = loadStore()
  const dest = latest.tables[toId]
  if (dest) {
    dest.server = from.server ?? POS_ACTOR.initials
    dest.elapsed = from.elapsed
    dest.total = from.total
    saveStore(latest)
  }
}

export function useLiveTables() {
  const [tables, setTables] = useState<LiveTable[]>(() => getLiveTables())

  useEffect(() => {
    const refresh = () => setTables(getLiveTables())
    refresh()
    return subscribeFloor(refresh)
  }, [])

  return tables
}

export function useLiveTable(id: string | null | undefined) {
  const tables = useLiveTables()
  if (!id) return null
  return tables.find((t) => t.id === id) ?? null
}
