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

export default function MenuBrowsePage() {
  return (
    <Suspense>
      <MenuBrowseContent />
    </Suspense>
  )
}

function MenuBrowseContent() {
  const searchParams = useSearchParams()
  const initial = searchParams.get('category') ?? 'Burgers'
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
    <div className="min-h-dvh bg-background">
      <OrderHeader backHref="/order" tableLabel={tableNumber ? `Table ${tableNumber}` : undefined} />

      {/* Category quick nav */}
      <div className="sticky top-14 z-30 border-b border-border bg-background/95 backdrop-blur-sm md:top-[4.5rem]">
        <div className="flex gap-1 overflow-x-auto px-4 py-2.5 md:px-8">
          {menuCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
                activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground',
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2 px-4 pb-3 md:px-8">
          {dietFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setDietFilter(filter.id)}
              className={cn(
                'inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors',
                dietFilter === filter.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground',
              )}
            >
              {filter.id !== 'all' && <DietMark diet={filter.id} size="sm" />}
              {filter.label}
            </button>
          ))}
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the menu…"
            className="h-9 min-w-[10rem] flex-1 rounded-full border border-border bg-card px-4 text-sm outline-none focus:ring-2 focus:ring-ring md:max-w-md"
          />
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-5 md:px-8">
        <h1 className="mb-4 font-sans text-xl font-semibold tracking-tight text-foreground">{activeCategory}</h1>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.length === 0 && (
            <p className="col-span-full py-12 text-center text-sm text-muted-foreground">
              No items match {query ? `“${query}”` : dietFilter !== 'all' ? `this ${dietFilter === 'veg' ? 'veg' : 'non-veg'} filter` : 'this category'}.
            </p>
          )}
          {items
            .map((item) => (
              <Link
                key={item.id}
                href={`/order/menu/${item.id}`}
                className={cn(
                  'flex min-h-[7.5rem] gap-3 rounded-xl border border-border bg-card p-3.5 transition-colors hover:border-primary/40',
                  item.soldOut && 'pointer-events-none opacity-60',
                )}
              >
                <div className="relative size-28 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image src={item.image || '/placeholder.svg'} alt={item.name} fill className="object-cover" />
                  <span className="absolute left-1.5 top-1.5 rounded-md bg-white/95 p-1 shadow-sm">
                    <DietMark diet={getItemDiet(item)} />
                  </span>
                  {item.soldOut && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <span className="rounded-full bg-card px-2 py-0.5 text-[10px] font-semibold text-foreground">Sold Out</span>
                    </div>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold leading-tight text-foreground">{item.name}</p>
                      <DietMark diet={getItemDiet(item)} showLabel size="sm" className="shrink-0" />
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold tabular-nums text-foreground">${item.price.toFixed(2)}</span>
                    {item.spice && (
                      <span className="flex items-center gap-0.5 text-xs text-warning">
                        {Array.from({ length: item.spice }).map((_, i) => (
                          <Flame key={i} className="size-3" />
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
            ))}
        </div>
      </div>
    </div>
  )
}
