import {
  kitchenTickets,
  menuItems,
  type FloorTable,
  type OrderType,
} from '@/lib/mock-data'
import { getLiveTable, getLiveTables } from '@/lib/table-status'

export type PosCartLine = {
  id: string
  name: string
  unitPrice: number
  qty: number
  modifiers?: string
  note?: string
}

export type PosOrderType = OrderType | 'pickup' | 'bar'

export type PosOrderContext = {
  table: FloorTable | null
  orderType: PosOrderType
  title: string
  query: string
}

const SESSION_KEY = 'airests-pos-order'

export function findFloorTable(tableId: string | null | undefined) {
  if (!tableId) return null
  return getLiveTable(tableId) ?? getLiveTables().find((t) => t.id === tableId) ?? null
}

export function parseOrderType(value: string | null | undefined): PosOrderType {
  if (value === 'takeout' || value === 'pickup' || value === 'delivery' || value === 'bar' || value === 'dine-in') {
    return value
  }
  return 'dine-in'
}

export function tableDisplayName(table: FloorTable) {
  if (table.room === 'Bar') return `Bar ${table.label}`
  if (table.room === 'Patio') return `Patio ${table.label}`
  return `Table ${table.label.replace(/^T/, '')}`
}

export function resolvePosContext(tableId: string | null, typeParam: string | null): PosOrderContext {
  const table = findFloorTable(tableId)
  const orderType = table ? (table.room === 'Bar' ? 'bar' : 'dine-in') : parseOrderType(typeParam)
  const typeLabel =
    orderType === 'dine-in' ? 'Dine-In' : orderType === 'takeout' ? 'Takeout' : orderType === 'pickup' ? 'Pickup' : orderType === 'delivery' ? 'Delivery' : 'Bar'

  return {
    table,
    orderType,
    title: table ? `${tableDisplayName(table)} — ${typeLabel}` : typeLabel,
    query: table ? `table=${table.id}&type=${orderType}` : `type=${orderType}`,
  }
}

export function ticketNameForTable(table: FloorTable) {
  if (table.room === 'Bar') return `Bar ${table.label}`
  return `Table ${table.label.replace(/^T/, '')}`
}

function lookupPrice(rawName: string) {
  const name = rawName.replace(/\s+x\d+$/i, '').trim()
  const match = menuItems.find((item) => item.name === name || name.startsWith(item.name) || item.name.startsWith(name))
  return { name: match?.name ?? name, price: match?.price ?? 0 }
}

export function initialLinesForTable(table: FloorTable | null): PosCartLine[] {
  if (!table || table.status === 'open' || table.status === 'needs-bussing') return []

  const ticketName = ticketNameForTable(table)
  const tickets = kitchenTickets.filter((t) => t.tableOrName === ticketName)
  const lines: PosCartLine[] = []

  for (const ticket of tickets) {
    for (const item of ticket.items) {
      const { name, price } = lookupPrice(item.name)
      const existing = lines.find((l) => l.name === name && l.modifiers === item.modifiers?.join(', '))
      if (existing) {
        existing.qty += item.qty
      } else {
        lines.push({
          id: `${table.id}-${ticket.id}-${item.name}`,
          name,
          unitPrice: price,
          qty: item.qty,
          modifiers: item.modifiers?.join(', '),
        })
      }
    }
  }

  if (lines.length === 0 && table.total) {
    lines.push({
      id: `${table.id}-open-check`,
      name: 'Open check items',
      unitPrice: table.total,
      qty: 1,
    })
  }

  return lines
}

export function savePosOrder(payload: { tableId?: string | null; type: string; lines: PosCartLine[] }) {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload))
}

export function loadPosOrder(): { tableId?: string | null; type: string; lines: PosCartLine[] } | null {
  if (typeof window === 'undefined') return null
  const raw = sessionStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const SPLIT_KEY = 'airests-pos-split'

export type SplitMode = 'even' | 'seat' | 'item'

export type SplitShare = {
  id: string
  label: string
  amount: number
  paid: boolean
}

export type PosSplitPlan = {
  mode: SplitMode
  people: number
  lineOwners: Record<string, string>
  shares: SplitShare[]
  total: number
}

export function roundMoney(value: number) {
  return Math.round(value * 100) / 100
}

export function splitEvenAmounts(total: number, people: number) {
  const count = Math.max(1, people)
  const cents = Math.round(total * 100)
  const base = Math.floor(cents / count)
  const remainder = cents - base * count
  return Array.from({ length: count }, (_, i) => (base + (i < remainder ? 1 : 0)) / 100)
}

export function buildSplitShares(input: {
  mode: SplitMode
  people: number
  lines: PosCartLine[]
  total: number
  lineOwners: Record<string, string>
  labels?: string[]
}): SplitShare[] {
  const people = Math.max(1, input.people)
  const labels =
    input.labels ??
    (input.mode === 'seat'
      ? Array.from({ length: people }, (_, i) => `Seat ${i + 1}`)
      : Array.from({ length: people }, (_, i) => `Person ${i + 1}`))

  if (input.mode === 'even' || input.lines.length === 0) {
    return splitEvenAmounts(input.total, people).map((amount, i) => ({
      id: `share-${i + 1}`,
      label: labels[i],
      amount,
      paid: false,
    }))
  }

  const subtotal = input.lines.reduce((s, l) => s + l.unitPrice * l.qty, 0) || 1
  const raw = labels.map((_, i) => {
    const id = `share-${i + 1}`
    const shareSub = input.lines.reduce((s, line) => {
      const owner = input.lineOwners[line.id] ?? 'share-1'
      return owner === id ? s + line.unitPrice * line.qty : s
    }, 0)
    return { id, label: labels[i], amount: input.total * (shareSub / subtotal) }
  })

  const rounded = raw.map((s) => ({ ...s, amount: roundMoney(s.amount), paid: false }))
  const drift = roundMoney(input.total - rounded.reduce((s, x) => s + x.amount, 0))
  if (rounded.length) rounded[rounded.length - 1].amount = roundMoney(rounded[rounded.length - 1].amount + drift)
  return rounded.filter((s) => s.amount > 0)
}

export function savePosSplit(plan: PosSplitPlan) {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(SPLIT_KEY, JSON.stringify(plan))
}

export function loadPosSplit(): PosSplitPlan | null {
  if (typeof window === 'undefined') return null
  const raw = sessionStorage.getItem(SPLIT_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as PosSplitPlan
  } catch {
    return null
  }
}
