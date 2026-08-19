'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatePresence, LayoutGroup, m } from 'framer-motion'
import { toast } from 'sonner'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { AirestsMark } from '@/components/shared/airests-mark'
import { useCart } from '@/components/order/cart-context'
import { restaurantProfile, menuCategories } from '@/lib/mock-data'
import { MapPin, Clock, AlertTriangle, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Stagger, StaggerItem } from '@/components/motion/primitives'

export default function OrderLandingPage() {
  const router = useRouter()
  const { setFulfillment, fulfillment, deliveryAddress, setDeliveryAddress } = useCart()
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>(fulfillment)

  function chooseType(next: 'pickup' | 'delivery') {
    setOrderType(next)
    setFulfillment(next)
  }

  function startOrder() {
    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      toast.error('Add a delivery address')
      return
    }
    setFulfillment(orderType)
    router.push('/order/menu')
  }

  return (
    <div className="page-canvas min-h-dvh">
      <header className="flex items-center justify-between px-4 py-3.5 sm:px-8">
        <Link href="/order" aria-label="Airests home">
          <AirestsMark size="lg" />
        </Link>
        <ThemeToggle />
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-2 sm:px-6 sm:pb-20 sm:pt-4">
        <h1 className="sr-only">{restaurantProfile.name} — order pickup or delivery</h1>

        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-surface">
          <div className="relative h-52 w-full sm:h-72 md:h-[22rem]">
            <Image
              src="/restaurant-hero.png"
              alt="Guests dining at Riverside Grill"
              fill
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/35 to-transparent" />
          </div>

          <div className="relative space-y-4 px-5 pb-5 pt-1 sm:space-y-5 sm:px-7 sm:pb-7">
            <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-1">
              <span className="inline-flex items-center gap-2">
                <MapPin className="size-4 shrink-0 text-muted-foreground" />
                {restaurantProfile.address}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="size-4 shrink-0 text-muted-foreground" />
                {restaurantProfile.hours}
              </span>
            </div>

            {restaurantProfile.isThrottled && (
              <div className="flex items-start gap-2.5 rounded-xl border border-primary/20 bg-accent px-3.5 py-3 text-sm leading-relaxed text-accent-foreground">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-primary" />
                <p>
                  Kitchen is busy — orders may be delayed {restaurantProfile.prepTime}. Thanks for your patience!
                </p>
              </div>
            )}

            <LayoutGroup id="guest-fulfillment">
              <div className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1.5">
                {(['pickup', 'delivery'] as const).map((type) => {
                  const active = orderType === type
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => chooseType(type)}
                      className={cn(
                        'relative rounded-lg py-3 text-sm font-semibold transition-colors',
                        active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {active && (
                        <m.span
                          layoutId="guest-fulfillment-pill"
                          className="absolute inset-0 rounded-lg bg-card shadow-sm"
                          transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                        />
                      )}
                      <span className="relative z-10">{type === 'pickup' ? 'Order Pickup' : 'Order Delivery'}</span>
                    </button>
                  )
                })}
              </div>
            </LayoutGroup>

            <AnimatePresence initial={false}>
              {orderType === 'delivery' && (
                <m.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <label className="block text-sm font-medium text-foreground">
                    Delivery address
                    <input
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Street, apartment, city"
                      className="mt-2 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </label>
                </m.div>
              )}
            </AnimatePresence>

            <m.button
              type="button"
              onClick={startOrder}
              whileTap={{ scale: 0.985 }}
              className="flex w-full items-center justify-center rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_8px_22px_rgba(255,122,53,0.28)] sm:text-[15px]"
            >
              View Menu &amp; Start Order
            </m.button>
          </div>
        </section>

        <section className="mt-8 sm:mt-10">
          <h2 className="mb-3.5 text-lg font-semibold tracking-tight text-foreground">Browse by Category</h2>
          <Stagger className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3" delay={0.04}>
            {menuCategories.map((cat) => (
              <StaggerItem key={cat} hover>
                <Link
                  href={`/order/menu?category=${encodeURIComponent(cat)}`}
                  onClick={() => setFulfillment(orderType)}
                  className="group flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3.5 text-sm font-medium text-foreground shadow-surface transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-hover"
                >
                  {cat}
                  <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      </main>
    </div>
  )
}
