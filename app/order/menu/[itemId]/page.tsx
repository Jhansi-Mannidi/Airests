'use client'

import { useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { m } from 'framer-motion'
import { Check, Minus, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { OrderHeader } from '@/components/order/order-header'
import { useCart } from '@/components/order/cart-context'
import { getItemDiet, getItemModifierGroups, menuItems, type ModifierGroup } from '@/lib/mock-data'
import { DietMark } from '@/components/shared/diet-mark'
import { cn } from '@/lib/utils'
import { FadeSection } from '@/components/motion/primitives'

export default function ItemDetailPage() {
  const params = useParams<{ itemId: string }>()
  const router = useRouter()
  const { addLine } = useCart()
  const item = menuItems.find((m) => m.id === params.itemId)
  const modifierGroups = item ? getItemModifierGroups(item) : []

  const [quantity, setQuantity] = useState(1)
  const [selections, setSelections] = useState<Record<string, string[]>>({})
  const [instructions, setInstructions] = useState('')
  const [attempted, setAttempted] = useState(false)

  const priceDelta = useMemo(() => {
    if (!item) return 0
    let delta = 0
    for (const group of modifierGroups) {
      for (const optName of selections[group.name] ?? []) {
        const opt = group.options.find((o) => o.name === optName)
        if (opt) delta += opt.priceDelta
      }
    }
    return delta
  }, [item, selections, modifierGroups])

  const unitPrice = item ? item.price + priceDelta : 0
  const total = unitPrice * quantity

  const incompleteRequired = modifierGroups
    .filter((group) => group.required)
    .filter((group) => (selections[group.name] ?? []).length === 0)
    .map((group) => group.name)

  function toggleOption(group: ModifierGroup, optionName: string) {
    setSelections((prev) => {
      const current = prev[group.name] ?? []
      if (group.selectType === 'single') return { ...prev, [group.name]: [optionName] }
      if (current.includes(optionName)) {
        return { ...prev, [group.name]: current.filter((name) => name !== optionName) }
      }
      const max = group.max ?? group.options.length
      if (current.length >= max) {
        toast.message(`Pick up to ${max}`, { description: group.name })
        return prev
      }
      return { ...prev, [group.name]: [...current, optionName] }
    })
  }

  function handleAddToCart() {
    if (!item || item.soldOut) return
    if (incompleteRequired.length > 0) {
      setAttempted(true)
      toast.error('Finish required choices', { description: incompleteRequired.join(', ') })
      document.getElementById(`group-${incompleteRequired[0]}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    addLine({ item, quantity, selections, priceDelta, specialInstructions: instructions.trim() || undefined })
    toast.success(`Added ${quantity > 1 ? `${quantity} × ` : ''}${item.name}`)
    router.push('/order/menu')
  }

  if (!item) {
    return (
      <div className="min-h-dvh page-canvas">
        <OrderHeader backHref="/order/menu" />
        <div className="px-4 py-24 text-center">
          <p className="text-base font-semibold text-foreground">That dish is not on the menu.</p>
          <Link href="/order/menu" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
            Back to menu
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh page-canvas pb-32">
      <OrderHeader backHref="/order/menu" />

      <m.div
        className="relative h-52 w-full overflow-hidden sm:h-80 md:h-[28rem]"
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image src={item.image || '/placeholder.svg'} alt={item.name} fill priority className="object-cover" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
        {item.soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/45">
            <span className="rounded-full bg-card px-3 py-1 text-sm font-semibold text-foreground">Sold out</span>
          </div>
        )}
      </m.div>

      <FadeSection className="w-full px-4 pb-8 pt-5 md:px-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-sans text-2xl font-semibold tracking-tight text-foreground">{item.name}</h1>
              <DietMark diet={getItemDiet(item)} showLabel />
            </div>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">{item.description}</p>
          </div>
          <p className="shrink-0 font-mono text-lg font-semibold tabular-nums text-foreground">${item.price.toFixed(2)}</p>
        </div>

        {modifierGroups.map((group) => {
          const current = selections[group.name] ?? []
          const max = group.max ?? (group.selectType === 'single' ? 1 : group.options.length)
          const missing = attempted && group.required && current.length === 0
          return (
            <section
              id={`group-${group.name}`}
              key={group.name}
              className={cn('mt-8 rounded-2xl', missing && 'ring-2 ring-danger/40')}
            >
              <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    {group.name}
                    {group.required && <span className="ml-1 text-danger">*</span>}
                  </h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {group.required ? 'Required' : 'Optional'}
                    {group.selectType === 'single' ? ' · pick 1' : ` · pick up to ${max}`}
                  </p>
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {current.length}/{max} selected
                </span>
              </div>
              <div className="space-y-2.5">
                {group.options.map((opt) => {
                  const checked = current.includes(opt.name)
                  return (
                    <m.button
                      key={opt.name}
                      type="button"
                      onClick={() => toggleOption(group, opt.name)}
                      whileTap={{ scale: 0.99 }}
                      className={cn(
                        'flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left text-sm transition-colors',
                        checked
                          ? 'border-primary bg-accent text-accent-foreground shadow-[0_0_0_1px_var(--primary)]'
                          : 'border-border bg-card text-foreground hover:border-primary/30 hover:bg-secondary/60',
                      )}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span
                          className={cn(
                            'flex size-5 shrink-0 items-center justify-center border-2',
                            group.selectType === 'single' ? 'rounded-full' : 'rounded-md',
                            checked ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-transparent',
                          )}
                        >
                          {checked &&
                            (group.selectType === 'single' ? (
                              <span className="size-2 rounded-full bg-primary-foreground" />
                            ) : (
                              <Check className="size-3.5" strokeWidth={3} />
                            ))}
                        </span>
                        <span className="font-medium">{opt.name}</span>
                      </span>
                      <span className={cn('shrink-0 font-mono text-sm tabular-nums', checked ? 'text-accent-foreground' : 'text-muted-foreground')}>
                        {opt.priceDelta > 0 ? `+$${opt.priceDelta.toFixed(2)}` : opt.priceDelta < 0 ? `-$${Math.abs(opt.priceDelta).toFixed(2)}` : ''}
                      </span>
                    </m.button>
                  )
                })}
              </div>
            </section>
          )
        })}

        <section className="mt-8">
          <label htmlFor="special-instructions" className="mb-2 block text-base font-semibold text-foreground">
            Special Instructions
          </label>
          <textarea
            id="special-instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={4}
            maxLength={180}
            placeholder="e.g. No onions, extra napkins…"
            className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="mt-1.5 text-right text-[11px] text-muted-foreground">{instructions.length}/180</p>
        </section>
      </FadeSection>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 px-3 py-3 backdrop-blur-md md:px-8 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex w-full max-w-lg items-center gap-2 sm:justify-center sm:gap-3">
          <div className="flex shrink-0 items-center gap-1 rounded-full border border-border bg-background p-1">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex size-9 items-center justify-center rounded-full text-foreground hover:bg-secondary disabled:opacity-40"
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
            >
              <Minus className="size-4" />
            </button>
            <span className="w-7 text-center font-mono text-sm font-semibold tabular-nums">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(20, q + 1))}
              className="flex size-9 items-center justify-center rounded-full text-foreground hover:bg-secondary"
              aria-label="Increase quantity"
            >
              <Plus className="size-4" />
            </button>
          </div>
          <m.button
            type="button"
            onClick={handleAddToCart}
            disabled={item.soldOut}
            whileTap={item.soldOut ? undefined : { scale: 0.985 }}
            className="inline-flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-[0_8px_22px_rgba(255,122,53,0.28)] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:min-w-[11.5rem] sm:gap-3 sm:px-5"
          >
            <span>{item.soldOut ? 'Sold out' : 'Add to Cart'}</span>
            {!item.soldOut && <span className="font-mono tabular-nums">${total.toFixed(2)}</span>}
          </m.button>
        </div>
      </div>
    </div>
  )
}
