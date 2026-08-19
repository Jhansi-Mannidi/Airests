'use client'

import * as React from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Search, ShoppingBag, UtensilsCrossed } from 'lucide-react'
import { PosTopBar } from '@/components/pos/pos-topbar'
import { CartRail, type CartLine } from '@/components/pos/cart-rail'
import { ModifierDialog } from '@/components/pos/modifier-dialog'
import { menuCategories, menuItems, getItemDiet, type DietType, type MenuItem } from '@/lib/mock-data'
import { DietMark, dietFilters } from '@/components/shared/diet-mark'
import { CategoryTabs } from '@/components/motion/category-tabs'
import { Stagger, StaggerItem } from '@/components/motion/primitives'
import { AnimatePresence, LayoutGroup, m } from 'framer-motion'
import { initialLinesForTable, loadPosOrder, resolvePosContext, savePosOrder } from '@/lib/pos-order'
import { seatTable } from '@/lib/table-status'
import { cn } from '@/lib/utils'

export default function OrderBuildingPage() {
  return (
    <React.Suspense>
      <OrderBuildingContent />
    </React.Suspense>
  )
}

function OrderBuildingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ctx = resolvePosContext(searchParams.get('table'), searchParams.get('type'))

  const [category, setCategory] = React.useState(menuCategories[0])
  const [query, setQuery] = React.useState('')
  const [dietFilter, setDietFilter] = React.useState<'all' | DietType>('all')
  const [lines, setLines] = React.useState<CartLine[]>([])
  const [activeItem, setActiveItem] = React.useState<MenuItem | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [ready, setReady] = React.useState(false)
  const [mobileTab, setMobileTab] = React.useState<'menu' | 'order'>('menu')
  const itemCount = lines.reduce((s, l) => s + l.qty, 0)
  const orderKey = `${ctx.table?.id ?? 'none'}:${ctx.orderType}`

  React.useEffect(() => {
    const saved = loadPosOrder()
    if (saved && (saved.tableId ?? null) === (ctx.table?.id ?? null) && saved.type === ctx.orderType) {
      setLines(saved.lines)
    } else {
      setLines(initialLinesForTable(ctx.table))
    }
    setQuery('')
    setReady(true)
    if (ctx.table?.status === 'open') {
      seatTable(ctx.table.id)
    }
  }, [orderKey, ctx.table, ctx.orderType])

  React.useEffect(() => {
    if (!ready) return
    savePosOrder({ tableId: ctx.table?.id ?? null, type: ctx.orderType, lines })
  }, [ctx.table?.id, ctx.orderType, lines, ready])

  const items = menuItems.filter((i) => {
    if (i.category !== category) return false
    if (dietFilter !== 'all' && getItemDiet(i) !== dietFilter) return false
    const q = query.trim().toLowerCase()
    if (!q) return true
    return i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
  })

  function handleItemTap(item: MenuItem) {
    if (item.soldOut) return
    setActiveItem(item)
    setDialogOpen(true)
  }

  function addWithModifiers(payload: { item: MenuItem; qty: number; delta: number; summary: string; note: string }) {
    const { item, qty, delta, summary, note } = payload
    setLines((prev) => [
      ...prev,
      {
        id: `${item.id}-${Date.now()}`,
        name: item.name,
        unitPrice: item.price + delta,
        qty,
        modifiers: summary || undefined,
        note: note || undefined,
      },
    ])
  }

  function inc(id: string) {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l)))
  }
  function dec(id: string) {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, qty: Math.max(1, l.qty - 1) } : l)))
  }
  function remove(id: string) {
    setLines((prev) => prev.filter((l) => l.id !== id))
  }

  return (
    <div className="pos-canvas flex h-dvh flex-col font-sans">
      <PosTopBar title={ctx.title} backHref={ctx.table ? '/pos/floor-plan' : '/pos'} />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
        <div className={cn('min-h-0 flex-1 flex-col overflow-hidden', mobileTab === 'menu' ? 'flex' : 'hidden lg:flex')}>
          <div className="border-b border-border bg-card px-3 py-2.5 md:px-6 md:py-3">
            <CategoryTabs items={[...menuCategories]} value={category} onChange={setCategory} layoutId="pos-menu-category" />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto border-b border-border px-3 py-2 md:px-6">
            <LayoutGroup id="pos-diet">
              {dietFilters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setDietFilter(filter.id)}
                  className={cn(
                    'relative inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
                    dietFilter === filter.id ? 'text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground',
                  )}
                >
                  {dietFilter === filter.id && (
                    <m.span
                      layoutId="pos-diet-pill"
                      className="absolute inset-0 rounded-full bg-primary shadow-sm"
                      transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                    />
                  )}
                  <span className="relative z-10 inline-flex items-center gap-1.5">
                    {filter.id !== 'all' && <DietMark diet={filter.id} size="sm" />}
                    {filter.label}
                  </span>
                </button>
              ))}
            </LayoutGroup>
            <div className="relative min-w-[10rem] flex-1 md:max-w-xs">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search menu…"
                className="h-9 w-full rounded-full border border-border bg-background py-1.5 pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 md:p-6">
            {items.length === 0 ? (
              <p className="py-16 text-center text-sm text-muted-foreground">
                No {category.toLowerCase()} match{query ? ` “${query}”` : dietFilter !== 'all' ? ` this ${dietFilter === 'veg' ? 'veg' : 'non-veg'} filter` : ''}.
              </p>
            ) : (
              <AnimatePresence mode="wait">
                <Stagger key={`${category}-${dietFilter}-${query}`} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" delay={0.035}>
                  {items.map((item) => (
                    <StaggerItem key={item.id} hover>
                      <m.button
                        type="button"
                        onClick={() => handleItemTap(item)}
                        disabled={item.soldOut}
                        whileHover={item.soldOut ? undefined : { y: -3 }}
                        whileTap={item.soldOut ? undefined : { scale: 0.98 }}
                        className={cn(
                          'group relative flex w-full flex-col overflow-hidden rounded-xl border border-border bg-card text-left shadow-sm',
                          item.soldOut ? 'opacity-60' : 'hover:border-primary/50 hover:shadow-elevated',
                        )}
                      >
                        <div className="relative h-28 w-full overflow-hidden bg-muted sm:h-36 lg:h-44">
                          <Image
                            src={item.image || '/placeholder.svg'}
                            alt={item.name}
                            fill
                            className={cn('object-cover transition-transform duration-500', !item.soldOut && 'group-hover:scale-105')}
                            sizes="200px"
                          />
                          {item.soldOut && (
                            <span className="absolute right-2 top-2 rounded-full bg-danger px-2 py-0.5 text-[10px] font-semibold text-danger-foreground">
                              Sold Out
                            </span>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col gap-1 px-2.5 py-2.5 sm:px-3 sm:py-4">
                          <p className="line-clamp-2 text-sm font-medium leading-tight text-foreground">{item.name}</p>
                          <div className="mt-auto flex items-center justify-between gap-2">
                            <p className="font-mono text-sm font-semibold tabular-nums text-foreground">
                              ${item.price.toFixed(2)}
                            </p>
                            <DietMark diet={getItemDiet(item)} showLabel size="sm" />
                          </div>
                        </div>
                      </m.button>
                    </StaggerItem>
                  ))}
                </Stagger>
              </AnimatePresence>
            )}
          </div>
        </div>

        <CartRail
          className={cn(mobileTab === 'order' ? 'flex flex-1' : 'hidden lg:flex')}
          lines={lines}
          onInc={inc}
          onDec={dec}
          onRemove={remove}
          onSend={() => {
            if (ctx.table) seatTable(ctx.table.id)
            toast.success('Order sent to kitchen', { description: `${ctx.title} notified` })
          }}
          onPay={() => router.push(`/pos/checkout?${ctx.query}`)}
        />

        <div className="grid grid-cols-2 border-t border-border bg-card pb-[env(safe-area-inset-bottom)] lg:hidden">
          <button
            type="button"
            onClick={() => setMobileTab('menu')}
            className={cn(
              'flex items-center justify-center gap-2 py-3 text-sm font-semibold',
              mobileTab === 'menu' ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            <UtensilsCrossed className="size-4" />
            Menu
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('order')}
            className={cn(
              'flex items-center justify-center gap-2 py-3 text-sm font-semibold',
              mobileTab === 'order' ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            <ShoppingBag className="size-4" />
            Order
            {itemCount > 0 && (
              <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <ModifierDialog item={activeItem} open={dialogOpen} onOpenChange={setDialogOpen} onAdd={addWithModifiers} />
    </div>
  )
}
