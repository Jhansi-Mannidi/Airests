'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { OrderHeader } from '@/components/order/order-header'
import { getLastGuestOrder, subscribeOnlineOrders, type OnlineOrder } from '@/lib/online-orders'
import { CheckCircle2, ChefHat, PackageCheck, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FadeSection, Stagger, StaggerItem } from '@/components/motion/primitives'
import { m } from 'framer-motion'

function stageFromStatus(order: OnlineOrder) {
  if (order.status === 'completed') return 3
  if (order.status === 'ready') return 2
  return 1
}

export default function OrderStatusPage() {
  const [order, setOrder] = useState<OnlineOrder | null>(null)

  useEffect(() => {
    function sync() {
      setOrder(getLastGuestOrder())
    }
    sync()
    return subscribeOnlineOrders(sync)
  }, [])

  const fulfillment = order?.fulfillment ?? 'pickup'
  const stageIndex = order ? stageFromStatus(order) : 1
  const stages = [
    { key: 'received', label: 'Order Received', icon: CheckCircle2 },
    { key: 'kitchen', label: 'In the Kitchen', icon: ChefHat },
    { key: 'ready', label: fulfillment === 'delivery' ? 'Out for delivery' : 'Ready for Pickup', icon: PackageCheck },
    { key: 'completed', label: 'Completed', icon: Clock },
  ]

  if (!order) {
    return (
      <div className="min-h-dvh page-canvas">
        <OrderHeader title="Order Status" backHref="/order" />
        <div className="mx-auto max-w-xl px-4 py-16 text-center">
          <h1 className="text-xl font-semibold text-foreground">No order yet</h1>
          <p className="mt-2 text-sm text-muted-foreground">Place an order and the kitchen will see it on POS and KDS.</p>
          <Link href="/order" className="mt-6 inline-block text-sm font-medium text-primary hover:underline">
            Back to Restaurant Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh page-canvas">
      <OrderHeader title="Order Status" backHref="/order" />

      <FadeSection className="mx-auto max-w-xl px-4 py-8 text-center md:px-8">
        <p className="text-sm font-medium text-primary">Order {order.orderNumber}</p>
        <h1 className="mt-1 font-sans text-2xl font-semibold tracking-tight text-foreground">
          {order.status === 'ready'
            ? fulfillment === 'delivery'
              ? 'Out for delivery'
              : 'Your order is ready!'
            : 'Sent to the kitchen'}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {order.scheduledLabel
            ? `${fulfillment === 'delivery' ? 'Drop-off time' : 'Pickup time'}: `
            : 'The restaurant has this ticket on POS and KDS. '}
          <span className="font-medium text-foreground">{order.scheduledLabel ?? 'They start cooking as soon as it arrives.'}</span>
        </p>

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
                  {state === 'active' && <p className="text-xs text-primary">In progress…</p>}
                </div>
                </div>
              </StaggerItem>
            )
          })}
        </Stagger>

        <div className="mt-10 rounded-xl border border-border bg-card p-4 text-left shadow-surface">
          <div className="flex items-start justify-between gap-3 text-sm">
            <span className="text-muted-foreground">{fulfillment === 'delivery' ? 'Deliver to' : 'Pickup Location'}</span>
            <span className="max-w-[16rem] text-right font-medium leading-snug text-foreground">
              {fulfillment === 'delivery' ? order.address || 'Delivery address' : 'Riverside Grill — Downtown'}
            </span>
          </div>
          <ul className="mt-3 space-y-1.5 border-t border-border pt-3 text-sm">
            {order.lines.map((line, index) => (
              <li key={`${line.name}-${index}`} className="flex justify-between gap-3">
                <span className="text-foreground">
                  {line.qty} × {line.name}
                </span>
                <span className="font-mono tabular-nums text-muted-foreground">${(line.unitPrice * line.qty).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm">
            <span className="text-muted-foreground">Order Total</span>
            <span className="font-mono font-medium tabular-nums text-foreground">${order.total.toFixed(2)}</span>
          </div>
        </div>

        <Link href="/order" className="mt-6 inline-block text-sm font-medium text-primary hover:underline">
          Back to Restaurant Home
        </Link>
      </FadeSection>
    </div>
  )
}
