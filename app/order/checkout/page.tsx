'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { OrderHeader } from '@/components/order/order-header'
import { useCart } from '@/components/order/cart-context'
import { formatScheduleLabel } from '@/lib/order-schedule'
import { Lock, ShieldCheck, Clock } from 'lucide-react'
import { FadeSection } from '@/components/motion/primitives'
import { LayoutGroup, m } from 'framer-motion'
import { cn } from '@/lib/utils'

const tipPresets = [15, 18, 20, 25]

export default function CheckoutPage() {
  const { lines, subtotal, when, scheduledAt, fulfillment, deliveryAddress } = useCart()
  const router = useRouter()
  const [tipPct, setTipPct] = useState(18)
  const [submitting, setSubmitting] = useState(false)

  const tax = subtotal * 0.0825
  const tip = subtotal * (tipPct / 100)
  const total = subtotal + tax + tip

  function handlePlaceOrder() {
    setSubmitting(true)
    setTimeout(() => router.push('/order/status'), 900)
  }

  return (
    <div className="min-h-dvh page-canvas pb-32">
      <OrderHeader title="Checkout" backHref="/order/cart" />

      <div className="mx-auto max-w-2xl px-4 py-5 md:px-8">
        <FadeSection>
          <h2 className="mb-2 text-sm font-semibold text-foreground">
            {fulfillment === 'delivery' ? 'Delivery time' : 'Pickup time'}
          </h2>
          <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-3.5 shadow-surface">
            <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                {when === 'schedule' && scheduledAt ? formatScheduleLabel(scheduledAt) : fulfillment === 'delivery' ? 'ASAP · about 30–40 minutes' : 'ASAP · about 20 minutes'}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {when === 'schedule'
                  ? 'The kitchen will start this order so it is ready at your selected time.'
                  : fulfillment === 'delivery'
                    ? `We’ll cook first, then send it to ${deliveryAddress || 'your address'}.`
                    : 'We will start cooking as soon as you place the order.'}
              </p>
            </div>
          </div>
        </FadeSection>

        <FadeSection className="mt-6" delay={0.06}>
          <h2 className="mb-2 text-sm font-semibold text-foreground">Contact Info</h2>
          <div className="space-y-2.5">
            <input placeholder="Full Name" defaultValue="Jamie Rodriguez" className="w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
            <input placeholder="Phone Number" defaultValue="(512) 555-0148" className="w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
            <input placeholder="Email" defaultValue="jamie.rodriguez@email.com" className="w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </FadeSection>

        <FadeSection className="mt-6" delay={0.1}>
          <h2 className="mb-2 text-sm font-semibold text-foreground">Add a Tip</h2>
          <LayoutGroup id="checkout-tip">
            <div className="grid grid-cols-4 gap-2">
              {tipPresets.map((pct) => (
                <button
                  key={pct}
                  onClick={() => setTipPct(pct)}
                  className={cn(
                    'relative rounded-lg border py-2.5 text-sm font-semibold transition-colors',
                    tipPct === pct ? 'border-transparent text-accent-foreground' : 'border-border bg-card text-foreground hover:bg-secondary',
                  )}
                >
                  {tipPct === pct && (
                    <m.span
                      layoutId="checkout-tip-pill"
                      className="absolute inset-0 rounded-lg bg-accent"
                      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                    />
                  )}
                  <span className="relative z-10">{pct}%</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
        </FadeSection>

        <FadeSection className="mt-6" delay={0.14}>
          <h2 className="mb-2 text-sm font-semibold text-foreground">Payment</h2>
          <div className="rounded-lg border border-border bg-card p-3.5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="size-4" />
              Secure tokenized payment — card details never touch our servers
            </div>
            <div className="mt-3 space-y-2.5">
              <input placeholder="Card number" inputMode="numeric" className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm tracking-widest outline-none focus:ring-2 focus:ring-ring" />
              <div className="grid grid-cols-2 gap-2.5">
                <input placeholder="MM / YY" className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
                <input placeholder="CVC" className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
          </div>
        </FadeSection>

        <FadeSection className="mt-6 space-y-1.5 rounded-xl border border-border bg-card p-4 text-sm" delay={0.18}>
          <div className="flex justify-between text-muted-foreground">
            <span>Items ({lines.reduce((s, l) => s + l.quantity, 0)})</span>
            <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Tax</span>
            <span className="font-mono tabular-nums">${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Tip ({tipPct}%)</span>
            <span className="font-mono tabular-nums">${tip.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-1.5 font-semibold text-foreground">
            <span>Total</span>
            <span className="font-mono tabular-nums">${total.toFixed(2)}</span>
          </div>
        </FadeSection>

        <FadeSection className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground" delay={0.22}>
          <ShieldCheck className="size-3.5" />
          Your payment is processed securely and encrypted end-to-end.
        </FadeSection>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-card p-4">
        <div className="mx-auto max-w-2xl">
          <m.button
            onClick={handlePlaceOrder}
            disabled={submitting}
            whileTap={submitting ? undefined : { scale: 0.985 }}
            className="flex w-full items-center justify-between rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-70"
          >
            <span>{submitting ? 'Placing Order…' : 'Place Order'}</span>
            <span className="font-mono tabular-nums">${total.toFixed(2)}</span>
          </m.button>
        </div>
      </div>
    </div>
  )
}
