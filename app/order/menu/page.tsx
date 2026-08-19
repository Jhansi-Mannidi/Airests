'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { OrderHeader } from '@/components/order/order-header'
import { useCart } from '@/components/order/cart-context'
import { menuCategories, menuItems, getItemDiet, type DietType } from '@/lib/mock-data'
import { DietMark, dietFilters } from '@/components/shared/diet-mark'
import { Flame, Leaf } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CategoryTabs } from '@/components/motion/category-tabs'
import { Stagger, StaggerItem } from '@/components/motion/primitives'
import { AnimatePresence, LayoutGroup, m } from 'framer-motion'

export default function MenuBrowsePage() {
  return (
    <Suspense>
      <MenuBrowseContent />
    </Suspense>
  )
}

function MenuBrowseContent() {
  const searchParams = useSearchParams()
  const initial = searchParams.get('category') ?? menuCategories[0]
  const [activeCategory, setActiveCategory] = useState(initial)
  const [query, setQuery] = useState('')
  const [dietFilter, setDietFilter] = useState<'all' | DietType>('all')
  const { tableNumber } = useCart()

  const items = menuItems.filter((item) => {
    if (item.category !== activeCategory) return false
    if (dietFilter !== 'all' && getItemDiet(item) !== dietFilter) return false
    const q = query.trim().toLowerCase()
    if (!q) return true
    return item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
  })

  return (
    <div className="min-h-dvh page-canvas">
      <OrderHeader backHref="/order" tableLabel={tableNumber ? `Table ${tableNumber}` : undefined} />

      {/* Category quick nav */}
      <div className="sticky top-14 z-30 border-b border-border bg-background/95 backdrop-blur-sm md:top-[4.5rem]">
        <div className="flex gap-1 overflow-x-auto px-4 py-2.5 md:px-8">
          <CategoryTabs items={[...menuCategories]} value={activeCategory} onChange={setActiveCategory} layoutId="guest-menu-category" />
        </div>
        <div className="flex flex-wrap items-center gap-2 px-4 pb-3 md:px-8">
          <LayoutGroup id="guest-diet">
            {dietFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setDietFilter(filter.id)}
                className={cn(
                  'relative inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors',
                  dietFilter === filter.id
                    ? 'text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground',
                )}
              >
                {dietFilter === filter.id && (
                  <m.span
                    layoutId="guest-diet-pill"
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
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the menu…"
            className="h-9 min-w-[10rem] flex-1 rounded-full border border-border bg-card px-4 text-sm outline-none focus:ring-2 focus:ring-ring md:max-w-md"
          />
        </div>
      </div>

      <div className="w-full px-4 py-5 md:px-6 lg:px-8">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h1 className="font-sans text-xl font-semibold tracking-tight text-foreground">{activeCategory}</h1>
          <p className="text-sm text-muted-foreground">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </p>
        </div>
        <AnimatePresence mode="wait">
          <Stagger key={`${activeCategory}-${dietFilter}-${query}`} className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" delay={0.04}>
            {items.length === 0 && (
              <p className="col-span-full py-16 text-center text-sm text-muted-foreground">
                No items match {query ? `“${query}”` : dietFilter !== 'all' ? `this ${dietFilter === 'veg' ? 'veg' : 'non-veg'} filter` : 'this category'}.
              </p>
            )}
            {items.map((item) => (
              <StaggerItem key={item.id} hover>
                <Link
                  href={`/order/menu/${item.id}`}
                  className={cn(
                    'group flex h-full min-h-[12rem] gap-4 rounded-2xl border border-border bg-card p-4 shadow-surface transition-colors hover:border-primary/40 hover:shadow-hover',
                    item.soldOut && 'pointer-events-none opacity-60',
                  )}
                >
                <div className="relative size-36 shrink-0 overflow-hidden rounded-xl bg-muted sm:size-40">
                  <Image
                    src={item.image || '/placeholder.svg'}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {item.soldOut && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <span className="rounded-full bg-card px-2 py-0.5 text-[10px] font-semibold text-foreground">Sold Out</span>
                    </div>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[15px] font-semibold leading-snug text-foreground">{item.name}</p>
                      <DietMark diet={getItemDiet(item)} showLabel size="sm" className="shrink-0" />
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-base font-semibold tabular-nums text-foreground">${item.price.toFixed(2)}</span>
                    {item.spice && (
                      <span className="flex items-center gap-0.5 text-xs text-warning">
                        {Array.from({ length: item.spice }).map((_, i) => (
                          <Flame key={i} className="size-3.5" />
                        ))}
                      </span>
                    )}
                    {item.dietary?.map((d) => (
                      <span key={d} className="flex items-center gap-0.5 rounded-full bg-success/10 px-1.5 py-0.5 text-[10px] font-medium text-success">
                        <Leaf className="size-2.5" />
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </AnimatePresence>
      </div>
    </div>
  )
}
