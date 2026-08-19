'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { OrderHeader } from '@/components/order/order-header'
import { useCart } from '@/components/order/cart-context'
import { formatScheduleLabel, formatTime } from '@/lib/order-schedule'
import { CheckCircle2, ChefHat, PackageCheck, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FadeSection, Stagger, StaggerItem } from '@/components/motion/primitives'
import { m } from 'framer-motion'

export default function OrderStatusPage() {
  const { when, scheduledAt, fulfillment, deliveryAddress } = useCart()
  const [stageIndex, setStageIndex] = useState(0)
  const scheduled = when === 'schedule' && scheduledAt !== null
  const pickupAt = scheduled ? scheduledAt : null
  const stages = [
    { key: 'received', label: 'Order Received', icon: CheckCircle2 },
    { key: 'kitchen', label: 'In the Kitchen', icon: ChefHat },
    { key: 'ready', label: fulfillment === 'delivery' ? 'Out for delivery' : 'Ready for Pickup', icon: PackageCheck },
    { key: 'completed', label: 'Completed', icon: Clock },
  ]

  useEffect(() => {
    if (scheduled) return
    const timers = [
      setTimeout(() => setStageIndex(1), 2000),
      setTimeout(() => setStageIndex(2), 6000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [scheduled])

  const readyLabel = pickupAt
    ? formatScheduleLabel(pickupAt)
    : '12:32 PM – 12:40 PM'

  return (
    <div className="min-h-dvh page-canvas">
      <OrderHeader title="Order Status" backHref="/order" />

      <FadeSection className="mx-auto max-w-xl px-4 py-8 text-center md:px-8">
        <p className="text-sm font-medium text-primary">Order #4483</p>
        <h1 className="mt-1 font-sans text-2xl font-semibold tracking-tight text-foreground">
          {scheduled ? 'Scheduled — we will start on time' : stageIndex < 2 ? 'We\u2019re on it!' : 'Your order is ready!'}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {scheduled ? (fulfillment === 'delivery' ? 'Drop-off time' : 'Pickup time') : stageIndex < 2 ? 'Estimated ready time' : fulfillment === 'delivery' ? 'Delivery window' : 'Pickup window'}:{' '}
          <span className="font-medium text-foreground">{readyLabel}</span>
        </p>

        {/* Tracker */}
        <Stagger className="mt-10 flex flex-col gap-0" delay={0.08}>
          {stages.map((stage, i) => {
            const state = i < stageIndex ? 'done' : i === stageIndex ? 'active' : 'pending'
            return (
              <StaggerItem key={stage.key}>
                <div className="flex items-start gap-4 text-left">
                <div className="flex flex-col items-center">
                  <m.div
                    className={cn(
                      'flex size-10 shrink-0 items-center justify-center rounded-full',
                      state === 'done' && 'bg-success text-success-foreground',
                      state === 'active' && 'bg-primary text-primary-foreground',
                      state === 'pending' && 'bg-muted text-muted-foreground',
                    )}
                    animate={state === 'active' ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                    transition={state === 'active' ? { repeat: Infinity, duration: 1.6 } : { duration: 0.2 }}
                  >
                    <stage.icon className="size-5" />
                  </m.div>
                  {i < stages.length - 1 && <div className={cn('h-10 w-0.5', i < stageIndex ? 'bg-success' : 'bg-border')} />}
                </div>
                <div className="pt-2">
                  <p className={cn('text-sm font-semibold', state === 'pending' ? 'text-muted-foreground' : 'text-foreground')}>{stage.label}</p>
                  {state === 'active' && (
                    <p className="text-xs text-primary">
                      {pickupAt && i === 0 ? `Held until ${formatTime(pickupAt)}` : 'In progress…'}
                    </p>
                  )}
                </div>
                </div>
              </StaggerItem>
            )
          })}
        </Stagger>

        <div className="mt-10 rounded-xl border border-border bg-card p-4 text-left shadow-surface">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{fulfillment === 'delivery' ? 'Deliver to' : 'Pickup Location'}</span>
            <span className="max-w-[16rem] truncate text-right font-medium text-foreground">
              {fulfillment === 'delivery' ? deliveryAddress : 'Riverside Grill — Downtown'}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Order Total</span>
            <span className="font-mono font-medium tabular-nums text-foreground">$42.18</span>
          </div>
        </div>

        <Link href="/order" className="mt-6 inline-block text-sm font-medium text-primary hover:underline">
          Back to Restaurant Home
        </Link>
      </FadeSection>
    </div>
  )
}
