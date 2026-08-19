'use client'

import { useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { OrderHeader } from '@/components/order/order-header'
import { useCart } from '@/components/order/cart-context'
import { getItemDiet, getItemModifierGroups, menuItems } from '@/lib/mock-data'
import { DietMark } from '@/components/shared/diet-mark'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function ItemDetailPage() {
  const params = useParams<{ itemId: string }>()
  const router = useRouter()
  const { addLine } = useCart()
  const item = menuItems.find((m) => m.id === params.itemId) ?? menuItems[0]
  const modifierGroups = getItemModifierGroups(item)

  const [quantity, setQuantity] = useState(1)
  const [selections, setSelections] = useState<Record<string, string[]>>({})
  const [instructions, setInstructions] = useState('')

  const priceDelta = useMemo(() => {
    let delta = 0
    for (const group of modifierGroups) {
      for (const optName of selections[group.name] ?? []) {
        const opt = group.options.find((o) => o.name === optName)
        if (opt) delta += opt.priceDelta
      }
    }
    return delta
  }, [selections, modifierGroups])

  const total = (item.price + priceDelta) * quantity

  function toggleOption(groupName: string, optionName: string, selectType: 'single' | 'multi', max?: number) {
    setSelections((prev) => {
      const current = prev[groupName] ?? []
      if (selectType === 'single') return { ...prev, [groupName]: [optionName] }
      if (current.includes(optionName)) {
        return { ...prev, [groupName]: current.filter((o) => o !== optionName) }
      }
      if (max && current.length >= max) return prev
      return { ...prev, [groupName]: [...current, optionName] }
    })
  }

  function requiredGroupsMet() {
    return modifierGroups
      .filter((g) => g.required)
      .every((g) => (selections[g.name] ?? []).length > 0)
  }

  function handleAddToCart() {
    if (!requiredGroupsMet()) {
      toast.error('Please complete required selections')
      return
    }
    addLine({ item, quantity, selections, priceDelta, specialInstructions: instructions })
    toast.success(`Added ${item.name} to cart`)
    router.push('/order/menu')
  }

  return (
    <div className="min-h-dvh bg-background pb-28">
      <OrderHeader backHref="/order/menu" />

      <div className="relative h-56 w-full sm:h-72 md:h-80">
        <Image src={item.image || '/placeholder.svg'} alt={item.name} fill priority className="object-cover" />
        <span className="absolute left-4 top-4 rounded-md bg-white/95 p-1.5 shadow-sm">
          <DietMark diet={getItemDiet(item)} />
        </span>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-5 md:px-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-sans text-xl font-semibold tracking-tight text-foreground md:text-2xl">{item.name}</h1>
              <DietMark diet={getItemDiet(item)} showLabel />
            </div>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
          </div>
          <span className="shrink-0 font-mono text-lg font-semibold tabular-nums text-foreground">${item.price.toFixed(2)}</span>
        </div>

        {modifierGroups.map((group) => {
          const current = selections[group.name] ?? []
          return (
            <div key={group.name} className="mt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">
                  {group.name} {group.required && <span className="text-danger">*</span>}
                </h2>
                <span className="text-xs text-muted-foreground">
                  {group.selectType === 'single' ? 'Pick 1' : `${current.length}/${group.max ?? group.options.length} selected`}
                </span>
              </div>
              <div className="mt-2 space-y-2">
                {group.options.map((opt) => {
                  const checked = current.includes(opt.name)
                  return (
                    <button
                      key={opt.name}
                      onClick={() => toggleOption(group.name, opt.name, group.selectType, group.max)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-lg border px-3.5 py-2.5 text-sm transition-colors',
                        checked ? 'border-primary bg-accent text-accent-foreground' : 'border-border bg-card text-foreground hover:bg-secondary',
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          className={cn(
                            'flex size-4 items-center justify-center border',
                            group.selectType === 'single' ? 'rounded-full' : 'rounded-sm',
                            checked ? 'border-primary bg-primary' : 'border-border',
                          )}
                        >
                          {checked && <span className={cn('bg-primary-foreground', group.selectType === 'single' ? 'size-1.5 rounded-full' : 'size-2 rounded-[1px]')} />}
                        </span>
                        {opt.name}
                      </span>
                      {opt.priceDelta > 0 && <span className="font-mono text-xs tabular-nums text-muted-foreground">+${opt.priceDelta.toFixed(2)}</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}

        <div className="mt-6">
          <label className="mb-1.5 block text-sm font-semibold text-foreground">Special Instructions</label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={3}
            placeholder="e.g. No onions, extra napkins…"
            className="w-full resize-none rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex size-10 items-center justify-center rounded-full border border-border text-foreground hover:bg-secondary"
            aria-label="Decrease quantity"
          >
            <Minus className="size-4" />
          </button>
          <span className="w-8 text-center font-mono text-lg font-semibold tabular-nums text-foreground">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="flex size-10 items-center justify-center rounded-full border border-border text-foreground hover:bg-secondary"
            aria-label="Increase quantity"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>

      {/* Sticky add to cart */}
      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-card p-4">
        <div className="mx-auto max-w-2xl">
          <button
            onClick={handleAddToCart}
            className="flex w-full items-center justify-between rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <span>Add to Cart</span>
            <span className="font-mono tabular-nums">${total.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
