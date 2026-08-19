'use client'

import { useMemo, type MouseEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { OrderHeader } from '@/components/order/order-header'
import { useCart } from '@/components/order/cart-context'
import { ItemDietMark } from '@/components/shared/diet-mark'
import { firstAvailableSlot, formatTime, getScheduleDays, getSlotsForDay } from '@/lib/order-schedule'
import { Minus, Plus, Trash2, ShoppingBag, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { AnimatePresence, LayoutGroup, m } from 'framer-motion'
import { FadeSection, Stagger, StaggerItem } from '@/components/motion/primitives'

export default function CartPage() {
  const { lines, updateQuantity, removeLine, subtotal, when, setWhen, scheduledAt, setScheduledAt, fulfillment } = useCart()
  const now = useMemo(() => new Date(), [])
  const days = useMemo(() => getScheduleDays(now), [now])
  const selectedDay = scheduledAt
    ? (days.find((d) => d.date.toDateString() === scheduledAt.toDateString()) ?? days[0])
    : days[0]
  const slots = useMemo(() => getSlotsForDay(selectedDay.date, now), [selectedDay.date, now])

  const tax = subtotal * 0.0825
  const total = subtotal + tax

  function chooseAsap() {
    setWhen('asap')
    setScheduledAt(null)
  }

  function chooseSchedule() {
    setWhen('schedule')
    if (!scheduledAt) setScheduledAt(firstAvailableSlot(now))
  }

  function chooseDay(day: (typeof days)[number]) {
    const nextSlots = getSlotsForDay(day.date, now)
    setScheduledAt(nextSlots[0] ?? null)
  }

  function handleCheckout(event: MouseEvent<HTMLAnchorElement>) {
    if (when === 'schedule' && !scheduledAt) {
      event.preventDefault()
      toast.error('Pick a time', { description: 'Choose a slot so the kitchen can start at the right moment.' })
    }
  }

  if (lines.length === 0) {
    return (
      <div className="min-h-dvh page-canvas">
        <OrderHeader backHref="/order/menu" />
        <FadeSection className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-24 text-center">
          <ShoppingBag className="size-10 text-muted-foreground" />
          <p className="text-base font-semibold text-foreground">Your cart is empty</p>
          <p className="text-sm text-muted-foreground">Add items from the menu to get started.</p>
          <Link href="/order/menu" className="mt-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
            Browse Menu
          </Link>
        </FadeSection>
      </div>
    )
  }

  return (
    <div className="min-h-dvh page-canvas pb-40">
      <OrderHeader title="Your Order" backHref="/order/menu" />

      <div className="mx-auto max-w-2xl px-4 py-5 md:px-8">
        <Stagger className="space-y-3" delay={0.05}>
          <AnimatePresence initial={false}>
            {lines.map((line) => (
              <StaggerItem key={line.id}>
                <div className="flex gap-3 rounded-xl border border-border bg-card p-3 shadow-surface">
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
              </StaggerItem>
            ))}
          </AnimatePresence>
        </Stagger>

        <Link href="/order/menu" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
          + Add more items
        </Link>

        {/* Order time */}
        <FadeSection className="mt-6" delay={0.08}>
          <h2 className="mb-2 text-sm font-semibold text-foreground">When would you like this?</h2>
          <LayoutGroup id="cart-when">
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1.5">
              <button
                type="button"
                onClick={chooseAsap}
                className={cn('relative rounded-lg py-2.5 text-sm font-medium transition-colors', when === 'asap' ? 'text-foreground' : 'text-muted-foreground')}
              >
                {when === 'asap' && (
                  <m.span
                    layoutId="cart-when-pill"
                    className="absolute inset-0 rounded-lg bg-card shadow-sm"
                    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                  />
                )}
                <span className="relative z-10">ASAP ({fulfillment === 'delivery' ? '~35 min' : '~20 min'})</span>
              </button>
              <button
                type="button"
                onClick={chooseSchedule}
                className={cn('relative rounded-lg py-2.5 text-sm font-medium transition-colors', when === 'schedule' ? 'text-foreground' : 'text-muted-foreground')}
              >
                {when === 'schedule' && (
                  <m.span
                    layoutId="cart-when-pill"
                    className="absolute inset-0 rounded-lg bg-card shadow-sm"
                    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                  />
                )}
                <span className="relative z-10">Schedule for Later</span>
              </button>
            </div>
          </LayoutGroup>

          <AnimatePresence initial={false}>
          {when === 'schedule' && (
            <m.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 overflow-hidden"
            >
            <div className="rounded-xl border border-border bg-card p-3.5">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Clock className="size-4 text-primary" />
                Choose a {fulfillment === 'delivery' ? 'delivery' : 'pickup'} time
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Open 11:00 AM – 10:00 PM. Earliest slot is 45 minutes from now.
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {days.map((day) => {
                  const count = getSlotsForDay(day.date, now).length
                  const active = selectedDay.id === day.id
                  return (
                    <button
                      key={day.id}
                      type="button"
                      disabled={count === 0}
                      onClick={() => chooseDay(day)}
                      className={cn(
                        'rounded-lg border px-3 py-2.5 text-left transition-colors disabled:opacity-40',
                        active ? 'border-primary bg-accent text-accent-foreground' : 'border-border bg-background text-foreground hover:bg-secondary',
                      )}
                    >
                      <p className="text-sm font-semibold">{day.label}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {count === 0 ? 'No times left' : `${count} times available`}
                      </p>
                    </button>
                  )
                })}
              </div>

              {slots.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  No more {fulfillment === 'delivery' ? 'delivery' : 'pickup'} times today. Choose tomorrow.
                </p>
              ) : (
                <div className="mt-3 grid max-h-52 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
                  {slots.map((slot) => {
                    const active = scheduledAt?.getTime() === slot.getTime()
                    return (
                      <button
                        key={slot.toISOString()}
                        type="button"
                        onClick={() => setScheduledAt(slot)}
                        className={cn(
                          'rounded-lg border px-2 py-2 text-sm font-medium tabular-nums transition-colors',
                          active
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-background text-foreground hover:border-primary/40 hover:bg-accent',
                        )}
                      >
                        {formatTime(slot)}
                      </button>
                    )
                  })}
                </div>
              )}

              {scheduledAt && (
                <p className="mt-3 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-foreground">
                  {fulfillment === 'delivery' ? 'Deliver by' : 'Pickup at'} {formatTime(scheduledAt)} · {selectedDay.label}
                </p>
              )}
            </div>
            </m.div>
          )}
          </AnimatePresence>
        </FadeSection>

        {/* Summary */}
        <FadeSection className="mt-6 space-y-1.5 rounded-xl border border-border bg-card p-4 text-sm" delay={0.12}>
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
        </FadeSection>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-card p-4">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/order/checkout"
            onClick={handleCheckout}
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
