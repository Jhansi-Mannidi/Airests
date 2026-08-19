'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { OrderHeader } from '@/components/order/order-header'
import { useCart } from '@/components/order/cart-context'
import { ItemDietMark } from '@/components/shared/diet-mark'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function CartPage() {
  const { lines, updateQuantity, removeLine, subtotal } = useCart()
  const [when, setWhen] = useState<'asap' | 'schedule'>('asap')

  const tax = subtotal * 0.0825
  const total = subtotal + tax

  if (lines.length === 0) {
    return (
      <div className="min-h-dvh bg-background">
        <OrderHeader backHref="/order/menu" />
        <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-24 text-center">
          <ShoppingBag className="size-10 text-muted-foreground" />
          <p className="text-base font-semibold text-foreground">Your cart is empty</p>
          <p className="text-sm text-muted-foreground">Add items from the menu to get started.</p>
          <Link href="/order/menu" className="mt-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
            Browse Menu
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-background pb-40">
      <OrderHeader title="Your Order" backHref="/order/menu" />

      <div className="mx-auto max-w-2xl px-4 py-5 md:px-8">
        <div className="space-y-3">
          {lines.map((line) => (
            <div key={line.id} className="flex gap-3 rounded-xl border border-border bg-card p-3">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image src={line.item.image || '/placeholder.svg'} alt={line.item.name} fill className="object-cover" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                  <div className="flex items-start gap-2">
                    <p className="text-sm font-semibold text-foreground">{line.item.name}</p>
                    <ItemDietMark item={line.item} size="sm" className="mt-0.5 shrink-0" />
                  </div>
                  {Object.values(line.selections).flat().length > 0 && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{Object.values(line.selections).flat().join(', ')}</p>
                  )}
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(line.id, line.quantity - 1)}
                      className="flex size-7 items-center justify-center rounded-full border border-border text-foreground hover:bg-secondary"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-5 text-center font-mono text-sm tabular-nums text-foreground">{line.quantity}</span>
                    <button
                      onClick={() => updateQuantity(line.id, line.quantity + 1)}
                      className="flex size-7 items-center justify-center rounded-full border border-border text-foreground hover:bg-secondary"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
                    ${((line.item.price + line.priceDelta) * line.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
              <button onClick={() => removeLine(line.id)} className="self-start text-muted-foreground hover:text-danger" aria-label="Remove item">
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>

        <Link href="/order/menu" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
          + Add more items
        </Link>

        {/* Order time */}
        <div className="mt-6">
          <h2 className="mb-2 text-sm font-semibold text-foreground">When would you like this?</h2>
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1.5">
            <button
              onClick={() => setWhen('asap')}
              className={cn('rounded-lg py-2.5 text-sm font-medium transition-colors', when === 'asap' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground')}
            >
              ASAP (~20 min)
            </button>
            <button
              onClick={() => setWhen('schedule')}
              className={cn('rounded-lg py-2.5 text-sm font-medium transition-colors', when === 'schedule' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground')}
            >
              Schedule for Later
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 space-y-1.5 rounded-xl border border-border bg-card p-4 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Tax (8.25%)</span>
            <span className="font-mono tabular-nums">${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-1.5 font-semibold text-foreground">
            <span>Total</span>
            <span className="font-mono tabular-nums">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-card p-4">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/order/checkout"
            className="flex w-full items-center justify-between rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <span>Proceed to Checkout</span>
            <span className="font-mono tabular-nums">${total.toFixed(2)}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
