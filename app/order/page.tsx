'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { AirestsMark } from '@/components/shared/airests-mark'
import { AppSwitcher } from '@/components/shared/app-switcher'
import { restaurantProfile, menuCategories } from '@/lib/mock-data'
import { MapPin, Clock, AlertTriangle, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function OrderLandingPage() {
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup')

  return (
    <div className="min-h-dvh bg-background">
      <header className="flex items-center justify-between border-b border-border px-4 py-3 md:px-8">
        <Link href="/order" aria-label="Airests home">
          <AirestsMark size="lg" />
        </Link>
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <AppSwitcher variant="ghost-icon" />
        </div>
      </header>

      <div className="mx-auto max-w-5xl">
        {/* Hero */}
        <div className="relative h-48 w-full overflow-hidden sm:h-64 md:h-80">
          <Image src="/restaurant-hero.png" alt="Riverside Grill dining room" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
        </div>

        <div className="px-4 pb-28 md:px-8 md:pb-16">
          <div className="-mt-10 flex flex-col gap-4 md:-mt-14 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-sans text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  {restaurantProfile.name}
                </h1>
                <span
                  className={cn(
                    'rounded-full px-2.5 py-1 text-xs font-semibold',
                    restaurantProfile.isOpen ? 'bg-success/15 text-success' : 'bg-muted text-muted-foreground',
                  )}
                >
                  {restaurantProfile.isOpen ? 'Open Now' : 'Closed'}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{restaurantProfile.tagline}</p>
              <div className="mt-2 flex flex-col gap-1.5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-4">
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  {restaurantProfile.address}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  {restaurantProfile.hours}
                </span>
              </div>
            </div>
          </div>

          {restaurantProfile.isThrottled && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-foreground">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
              <p>Kitchen is busy — orders may be delayed {restaurantProfile.prepTime}. Thanks for your patience!</p>
            </div>
          )}

          {/* Order type toggle */}
          <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-muted p-1.5">
            <button
              onClick={() => setOrderType('pickup')}
              className={cn(
                'rounded-lg py-3 text-sm font-semibold transition-colors',
                orderType === 'pickup' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground',
              )}
            >
              Order Pickup
            </button>
            <button
              onClick={() => setOrderType('delivery')}
              className={cn(
                'rounded-lg py-3 text-sm font-semibold transition-colors',
                orderType === 'delivery' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground',
              )}
            >
              Order Delivery
            </button>
          </div>

          <Link
            href="/order/menu"
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            View Menu &amp; Start Order
          </Link>

          {/* Category quick nav */}
          <div className="mt-8">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Browse by Category</h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {menuCategories.map((cat) => (
                <Link
                  key={cat}
                  href={`/order/menu?category=${encodeURIComponent(cat)}`}
                  className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  {cat}
                  <ChevronRight className="size-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
