'use client'

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { MenuItem } from '@/lib/mock-data'
import { emptyUsAddress, formatUsAddress, type UsAddress } from '@/lib/us-address'

export type CartLine = {
  id: string
  item: MenuItem
  quantity: number
  selections: Record<string, string[]>
  priceDelta: number
  specialInstructions?: string
}

export type FulfillmentWhen = 'asap' | 'schedule'
export type FulfillmentType = 'pickup' | 'delivery'

type CartContextValue = {
  lines: CartLine[]
  addLine: (line: Omit<CartLine, 'id'>) => void
  removeLine: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  subtotal: number
  count: number
  tableNumber: string | null
  setTableNumber: (n: string | null) => void
  when: FulfillmentWhen
  setWhen: (value: FulfillmentWhen) => void
  scheduledAt: Date | null
  setScheduledAt: (value: Date | null) => void
  fulfillment: FulfillmentType
  setFulfillment: (value: FulfillmentType) => void
  deliveryDetails: UsAddress
  setDeliveryDetails: (value: UsAddress) => void
  deliveryAddress: string
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [tableNumber, setTableNumber] = useState<string | null>(null)
  const [when, setWhen] = useState<FulfillmentWhen>('asap')
  const [scheduledAt, setScheduledAt] = useState<Date | null>(null)
  const [fulfillment, setFulfillment] = useState<FulfillmentType>('pickup')
  const [deliveryDetails, setDeliveryDetails] = useState<UsAddress>(emptyUsAddress)
  const deliveryAddress = formatUsAddress(deliveryDetails)

  function addLine(line: Omit<CartLine, 'id'>) {
    setLines((prev) => [...prev, { ...line, id: `${line.item.id}-${Date.now()}` }])
  }
  function removeLine(id: string) {
    setLines((prev) => prev.filter((l) => l.id !== id))
  }
  function updateQuantity(id: string, quantity: number) {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, quantity: Math.max(1, quantity) } : l)))
  }
  function clearCart() {
    setLines([])
  }

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + (l.item.price + l.priceDelta) * l.quantity, 0),
    [lines],
  )
  const count = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines])

  return (
    <CartContext.Provider
      value={{
        lines,
        addLine,
        removeLine,
        updateQuantity,
        clearCart,
        subtotal,
        count,
        tableNumber,
        setTableNumber,
        when,
        setWhen,
        scheduledAt,
        setScheduledAt,
        fulfillment,
        setFulfillment,
        deliveryDetails,
        setDeliveryDetails,
        deliveryAddress,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
