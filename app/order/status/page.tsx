'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { OrderHeader } from '@/components/order/order-header'
import { CheckCircle2, ChefHat, PackageCheck, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

const stages = [
  { key: 'received', label: 'Order Received', icon: CheckCircle2 },
  { key: 'kitchen', label: 'In the Kitchen', icon: ChefHat },
  { key: 'ready', label: 'Ready for Pickup', icon: PackageCheck },
  { key: 'completed', label: 'Completed', icon: Clock },
]

export default function OrderStatusPage() {
  const [stageIndex, setStageIndex] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setStageIndex(1), 2000),
      setTimeout(() => setStageIndex(2), 6000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="min-h-dvh bg-background">
      <OrderHeader title="Order Status" backHref="/order" />

      <div className="mx-auto max-w-xl px-4 py-8 text-center md:px-8">
        <p className="text-sm font-medium text-primary">Order #4483</p>
        <h1 className="mt-1 font-sans text-2xl font-semibold tracking-tight text-foreground">
          {stageIndex < 2 ? 'We\u2019re on it!' : 'Your order is ready!'}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Estimated {stageIndex < 2 ? 'ready time' : 'pickup window'}: <span className="font-medium text-foreground">12:32 PM – 12:40 PM</span>
        </p>

        {/* Tracker */}
        <div className="mt-10 flex flex-col gap-0">
          {stages.map((stage, i) => {
            const state = i < stageIndex ? 'done' : i === stageIndex ? 'active' : 'pending'
            return (
              <div key={stage.key} className="flex items-start gap-4 text-left">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'flex size-10 shrink-0 items-center justify-center rounded-full',
                      state === 'done' && 'bg-success text-success-foreground',
                      state === 'active' && 'bg-primary text-primary-foreground',
                      state === 'pending' && 'bg-muted text-muted-foreground',
                    )}
                  >
                    <stage.icon className="size-5" />
                  </div>
                  {i < stages.length - 1 && <div className={cn('h-10 w-0.5', i < stageIndex ? 'bg-success' : 'bg-border')} />}
                </div>
                <div className="pt-2">
                  <p className={cn('text-sm font-semibold', state === 'pending' ? 'text-muted-foreground' : 'text-foreground')}>{stage.label}</p>
                  {state === 'active' && <p className="text-xs text-primary">In progress…</p>}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-10 rounded-xl border border-border bg-card p-4 text-left">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Pickup Location</span>
            <span className="font-medium text-foreground">Riverside Grill — Downtown</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Order Total</span>
            <span className="font-mono font-medium tabular-nums text-foreground">$42.18</span>
          </div>
        </div>

        <Link href="/order" className="mt-6 inline-block text-sm font-medium text-primary hover:underline">
          Back to Restaurant Home
        </Link>
      </div>
    </div>
  )
}
