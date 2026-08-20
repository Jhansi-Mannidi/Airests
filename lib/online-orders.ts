'use client'

import { useEffect, useMemo, useState } from 'react'
import { kitchenTickets, type KitchenTicket, type OrderType, type Station } from '@/lib/mock-data'

export type OnlineOrderLine = {
  name: string
  qty: number
  unitPrice: number
  category: string
  modifiers?: string[]
  note?: string
}

export type OnlineOrder = {
  id: string
  orderNumber: string
  fulfillment: 'pickup' | 'delivery'
  tableNumber: string | null
  guestName: string
  phone: string
  email: string
  address: string
  when: 'asap' | 'schedule'
  scheduledLabel: string | null
  lines: OnlineOrderLine[]
  subtotal: number
  tax: number
  tip: number
  total: number
  placedAt: string
  status: 'in-kitchen' | 'ready' | 'completed'
}

const STORAGE_KEY = 'airests-online-orders'
const LAST_GUEST_KEY = 'airests-guest-order-id'
const START_NUMBER = 4484

const listeners = new Set<() => void>()
let storageBound = false

function notify() {
  listeners.forEach((listener) => listener())
}

export function subscribeOnlineOrders(listener: () => void) {
  listeners.add(listener)
  if (typeof window !== 'undefined' && !storageBound) {
    storageBound = true
    window.addEventListener('storage', (event) => {
      if (event.key === STORAGE_KEY) notify()
    })
  }
  return () => {
    listeners.delete(listener)
  }
}

function loadOrders(): OnlineOrder[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as OnlineOrder[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveOrders(orders: OnlineOrder[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders.slice(0, 20)))
  notify()
}

function nextOrderNumber(orders: OnlineOrder[]) {
  const max = orders.reduce((highest, order) => {
    const value = Number.parseInt(order.orderNumber.replace(/\D/g, ''), 10)
    return Number.isFinite(value) ? Math.max(highest, value) : highest
  }, START_NUMBER - 1)
  return `#${max + 1}`
}

export function placeOnlineOrder(input: Omit<OnlineOrder, 'id' | 'orderNumber' | 'placedAt' | 'status'>) {
  const orders = loadOrders()
  const order: OnlineOrder = {
    ...input,
    id: `onl-${Date.now()}`,
    orderNumber: nextOrderNumber(orders),
    placedAt: new Date().toISOString(),
    status: 'in-kitchen',
  }
  saveOrders([order, ...orders])
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(LAST_GUEST_KEY, order.id)
  }
  return order
}

export function getOnlineOrder(id: string) {
  return loadOrders().find((order) => order.id === id) ?? null
}

export function getLastGuestOrder() {
  if (typeof window === 'undefined') return null
  const id = sessionStorage.getItem(LAST_GUEST_KEY)
  return id ? getOnlineOrder(id) : loadOrders()[0] ?? null
}

export function updateOnlineOrderStatus(id: string, status: OnlineOrder['status']) {
  const orders = loadOrders().map((order) => (order.id === id ? { ...order, status } : order))
  saveOrders(orders)
}

export function ageMinutes(placedAt: string, now = Date.now()) {
  return Math.max(0, Math.floor((now - new Date(placedAt).getTime()) / 60_000))
}

export function stationForCategory(category: string): Station {
  if (category === 'Salads') return 'Salad'
  if (category === 'Drinks') return 'Bar'
  if (category === 'Starters' || category === 'Desserts') return 'Fry'
  return 'Grill'
}

export function labelForOnlineOrder(order: OnlineOrder) {
  if (order.tableNumber) return `Table ${order.tableNumber}`
  if (order.fulfillment === 'delivery') return order.guestName || 'Online delivery'
  return order.guestName || 'Online pickup'
}

export function kdsTypeForOrder(order: OnlineOrder): OrderType {
  if (order.tableNumber) return 'dine-in'
  return order.fulfillment === 'delivery' ? 'delivery' : 'takeout'
}

export function ticketsFromOnlineOrder(order: OnlineOrder, now = Date.now()): KitchenTicket[] {
  const grouped = new Map<Station, OnlineOrderLine[]>()
  for (const line of order.lines) {
    const station = stationForCategory(line.category)
    const current = grouped.get(station) ?? []
    current.push(line)
    grouped.set(station, current)
  }

  return Array.from(grouped.entries()).map(([station, lines]) => ({
    id: `${order.id}-${station}`,
    orderNumber: order.orderNumber,
    orderType: kdsTypeForOrder(order),
    tableOrName: labelForOnlineOrder(order),
    station,
    firedAt: new Date(order.placedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    ageMinutes: ageMinutes(order.placedAt, now),
    items: lines.map((line) => ({
      name: line.qty > 1 ? `${line.name} x${line.qty}` : line.name,
      qty: line.qty,
      modifiers: [line.modifiers?.join(', '), line.note].filter(Boolean) as string[],
    })),
  }))
}

export function useOnlineOrders() {
  const [orders, setOrders] = useState<OnlineOrder[]>([])
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    setOrders(loadOrders())
    return subscribeOnlineOrders(() => setOrders(loadOrders()))
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  return { orders, now }
}

export function useKitchenTickets() {
  const { orders, now } = useOnlineOrders()
  return useMemo(() => {
    const live = orders
      .filter((order) => order.status === 'in-kitchen')
      .flatMap((order) => ticketsFromOnlineOrder(order, now))
    return [...live, ...kitchenTickets]
  }, [orders, now])
}
