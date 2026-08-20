'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatePresence, LayoutGroup, m } from 'framer-motion'
import { toast } from 'sonner'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { AppSwitcher } from '@/components/shared/app-switcher'
import { AirestsMark } from '@/components/shared/airests-mark'
import { useCart } from '@/components/order/cart-context'
import { restaurantProfile, menuCategories, menuItems } from '@/lib/mock-data'
import { US_STATES, usAddressError } from '@/lib/us-address'
import { MapPin, Clock, AlertTriangle, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Stagger, StaggerItem } from '@/components/motion/primitives'

export default function OrderLandingPage() {
  const router = useRouter()
  const { setFulfillment, fulfillment, deliveryDetails, setDeliveryDetails } = useCart()
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>(fulfillment)

  function chooseType(next: 'pickup' | 'delivery') {
    setOrderType(next)
    setFulfillment(next)
  }

  function requireDeliveryAddress() {
    if (orderType !== 'delivery') return true
    const error = usAddressError(deliveryDetails)
    if (error) {
      toast.error(error)
      return false
    }
    return true
  }

  function startOrder() {
    if (!requireDeliveryAddress()) return
    setFulfillment(orderType)
    router.push('/order/menu')
  }

  const fieldClass =
    'mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring'

  return (
    <div className="page-canvas min-h-dvh">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/80 bg-card/90 px-4 backdrop-blur-md md:h-[4.5rem] md:px-8 lg:px-12">
        <Link href="/order" aria-label="Airests home">
          <AirestsMark size="lg" />
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <AppSwitcher />
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-5 md:px-8 md:pb-20 md:pt-8 lg:px-12">
        <section className="grid overflow-hidden rounded-2xl border border-border bg-card shadow-surface lg:grid-cols-[minmax(0,1.35fr)_minmax(22rem,0.92fr)] lg:rounded-3xl">
          <div className="relative h-52 w-full sm:h-80 lg:h-auto lg:min-h-[38rem]">
            <Image
              src="/restaurant-hero.png"
              alt="Guests dining at Riverside Grill"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover object-[center_42%]"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent lg:hidden" />
            <div className="absolute inset-y-0 right-0 hidden w-28 bg-gradient-to-l from-card/70 to-transparent lg:block" />
            <div className="absolute bottom-8 left-8 hidden max-w-md lg:block">
              <p className="text-sm font-medium tracking-wide text-white/80">{restaurantProfile.tagline}</p>
              <h1 className="mt-1 font-sans text-4xl font-semibold tracking-tight text-white xl:text-5xl">
                {restaurantProfile.name}
              </h1>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/75">
                Smash burgers, bowls, and patio weather — order pickup or delivery in a few taps.
              </p>
            </div>
          </div>

          <div className="relative flex flex-col justify-center space-y-4 px-5 py-5 sm:space-y-5 sm:px-7 sm:py-7 lg:px-9 lg:py-10">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Order ahead</p>
              <h2 className="mt-1 font-sans text-2xl font-semibold tracking-tight text-foreground lg:hidden">
                {restaurantProfile.name}
              </h2>
              <h2 className="mt-1 hidden font-sans text-2xl font-semibold tracking-tight text-foreground lg:block xl:text-[1.75rem]">
                Pickup or delivery
              </h2>
              <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="size-4 shrink-0 text-muted-foreground" />
                  {restaurantProfile.address}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock className="size-4 shrink-0 text-muted-foreground" />
                  {restaurantProfile.hours}
                </span>
              </div>
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
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-foreground">Delivery address</p>
                    <label className="block text-xs font-medium text-muted-foreground">
                      Street address
                      <input
                        value={deliveryDetails.street}
                        onChange={(e) => setDeliveryDetails({ ...deliveryDetails, street: e.target.value })}
                        placeholder="123 Main St"
                        autoComplete="address-line1"
                        className={fieldClass}
                      />
                    </label>
                    <label className="block text-xs font-medium text-muted-foreground">
                      Apt, suite, unit <span className="font-normal">(optional)</span>
                      <input
                        value={deliveryDetails.apt}
                        onChange={(e) => setDeliveryDetails({ ...deliveryDetails, apt: e.target.value })}
                        placeholder="Apt 4B"
                        autoComplete="address-line2"
                        className={fieldClass}
                      />
                    </label>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-[minmax(0,1fr)_5.75rem_7rem]">
                      <label className="col-span-2 block text-xs font-medium text-muted-foreground sm:col-span-1">
                        City
                        <input
                          value={deliveryDetails.city}
                          onChange={(e) => setDeliveryDetails({ ...deliveryDetails, city: e.target.value })}
                          placeholder="Austin"
                          autoComplete="address-level2"
                          className={fieldClass}
                        />
                      </label>
                      <label className="block text-xs font-medium text-muted-foreground">
                        State
                        <select
                          value={deliveryDetails.state}
                          onChange={(e) => setDeliveryDetails({ ...deliveryDetails, state: e.target.value })}
                          autoComplete="address-level1"
                          className={fieldClass}
                        >
                          <option value="">ST</option>
                          {US_STATES.map((state) => (
                            <option key={state.code} value={state.code}>
                              {state.code}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block text-xs font-medium text-muted-foreground">
                        ZIP
                        <input
                          value={deliveryDetails.zip}
                          onChange={(e) => setDeliveryDetails({ ...deliveryDetails, zip: e.target.value.replace(/[^\d-]/g, '').slice(0, 10) })}
                          placeholder="78701"
                          inputMode="numeric"
                          autoComplete="postal-code"
                          className={fieldClass}
                        />
                      </label>
                    </div>
                  </div>
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

        <section className="mt-10 md:mt-14">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">Browse by Category</h2>
              <p className="mt-1 hidden text-sm text-muted-foreground md:block">Jump straight into a section of the menu.</p>
            </div>
          </div>
          <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4" delay={0.04}>
            {menuCategories.map((cat) => {
              const cover = menuItems.find((item) => item.category === cat)?.image
              return (
                <StaggerItem key={cat} hover>
                  <Link
                    href={`/order/menu?category=${encodeURIComponent(cat)}`}
                    onClick={(event) => {
                      if (!requireDeliveryAddress()) {
                        event.preventDefault()
                        return
                      }
                      setFulfillment(orderType)
                    }}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-surface transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-hover"
                  >
                    <div className="relative h-24 w-full overflow-hidden bg-muted sm:h-28 lg:h-32">
                      {cover && (
                        <Image
                          src={cover}
                          alt={cat}
                          fill
                          sizes="200px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/15" />
                    </div>
                    <div className="flex items-center justify-between px-3.5 py-3">
                      <span className="text-sm font-semibold text-foreground">{cat}</span>
                      <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                    </div>
                  </Link>
                </StaggerItem>
              )
            })}
          </Stagger>
        </section>
      </main>
    </div>
  )
}
