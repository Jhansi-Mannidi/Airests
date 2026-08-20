'use client'

import { useParams, useRouter } from 'next/navigation'
import { PosTopBar } from '@/components/pos/pos-topbar'
import { Button } from '@/components/ui/button'
import { getOnlineOrder, updateOnlineOrderStatus, useOnlineOrders } from '@/lib/online-orders'
import { toast } from 'sonner'

export default function PosOnlineOrderPage() {
  const params = useParams<{ orderId: string }>()
  const router = useRouter()
  const { orders } = useOnlineOrders()
  const order = orders.find((entry) => entry.id === params.orderId) ?? getOnlineOrder(params.orderId)

  if (!order) {
    return (
      <div className="pos-canvas flex h-dvh flex-col font-sans">
        <PosTopBar title="Online order" backHref="/pos" />
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <p className="text-lg font-semibold text-foreground">Order not found</p>
          <p className="mt-1 text-sm text-muted-foreground">This online ticket is no longer on this register.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pos-canvas flex h-dvh flex-col font-sans">
      <PosTopBar title={`${order.orderNumber} · Online`} backHref="/pos" />
      <main className="mx-auto w-full max-w-xl flex-1 overflow-y-auto px-4 py-5 md:px-6">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-surface">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Online order</p>
          <h1 className="mt-1 text-xl font-semibold text-foreground">{order.guestName}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {order.fulfillment === 'delivery' ? 'Delivery' : order.tableNumber ? `Table ${order.tableNumber}` : 'Pickup'}
            {order.phone ? ` · ${order.phone}` : ''}
          </p>
          {order.address && (
            <p className="mt-3 text-sm leading-snug text-foreground">{order.address}</p>
          )}
        </div>

        <ul className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-surface">
          {order.lines.map((line, index) => (
            <li key={`${line.name}-${index}`} className="flex items-start justify-between gap-3 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {line.qty} × {line.name}
                </p>
                {line.modifiers && line.modifiers.length > 0 && (
                  <p className="mt-0.5 text-xs text-muted-foreground">{line.modifiers.join(', ')}</p>
                )}
                {line.note && <p className="mt-0.5 text-xs italic text-muted-foreground">{line.note}</p>}
              </div>
              <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
                ${(line.unitPrice * line.qty).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-surface">
          <span className="font-semibold text-foreground">Total</span>
          <span className="font-mono text-base font-semibold tabular-nums">${order.total.toFixed(2)}</span>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          This ticket is already on the kitchen display. Mark it ready when the bag is packed.
        </p>

        <div className="mt-4 flex flex-col gap-2.5">
          {order.status === 'in-kitchen' && (
            <Button
              size="lg"
              className="h-12 rounded-xl"
              onClick={() => {
                updateOnlineOrderStatus(order.id, 'ready')
                toast.success(`${order.orderNumber} marked ready`, { description: 'Guest status updates too.' })
              }}
            >
              Mark ready for {order.fulfillment === 'delivery' ? 'delivery' : 'pickup'}
            </Button>
          )}
          {order.status === 'ready' && (
            <Button
              size="lg"
              className="h-12 rounded-xl"
              onClick={() => {
                updateOnlineOrderStatus(order.id, 'completed')
                toast.success(`${order.orderNumber} completed`)
                router.push('/pos')
              }}
            >
              Complete order
            </Button>
          )}
          {order.status === 'completed' && (
            <p className="rounded-xl bg-success/10 px-4 py-3 text-center text-sm font-semibold text-success">Completed</p>
          )}
        </div>
      </main>
    </div>
  )
}
