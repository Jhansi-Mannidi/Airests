'use client'

import * as React from 'react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { getItemDiet, getItemModifierGroups, type MenuItem } from '@/lib/mock-data'
import { DietMark } from '@/components/shared/diet-mark'
import { cn } from '@/lib/utils'
import { Minus, Plus, Check, Flame, Leaf, X } from 'lucide-react'

export type ModifierSelection = Record<string, string[]>

export function ModifierDialog({
  item,
  open,
  onOpenChange,
  onAdd,
}: {
  item: MenuItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (payload: { item: MenuItem; qty: number; delta: number; summary: string; note: string }) => void
}) {
  const [qty, setQty] = React.useState(1)
  const [selections, setSelections] = React.useState<ModifierSelection>({})
  const [note, setNote] = React.useState('')

  const groups = item ? getItemModifierGroups(item) : []

  React.useEffect(() => {
    if (item && open) {
      const initial: ModifierSelection = {}
      getItemModifierGroups(item).forEach((g) => {
        initial[g.name] = g.selectType === 'single' && g.required ? [g.options[0].name] : []
      })
      setSelections(initial)
      setQty(1)
      setNote('')
    }
  }, [item, open])

  if (!item) return null

  function toggle(group: (typeof groups)[number], optionName: string) {
    setSelections((prev) => {
      const current = prev[group.name] ?? []
      if (group.selectType === 'single') {
        return { ...prev, [group.name]: [optionName] }
      }
      const has = current.includes(optionName)
      if (has) return { ...prev, [group.name]: current.filter((o) => o !== optionName) }
      if (group.max && current.length >= group.max) return prev
      return { ...prev, [group.name]: [...current, optionName] }
    })
  }

  const delta = groups.reduce((sum, g) => {
    const chosen = selections[g.name] ?? []
    return sum + chosen.reduce((s, name) => s + (g.options.find((o) => o.name === name)?.priceDelta ?? 0), 0)
  }, 0)

  const unitPrice = item.price + delta
  const canAdd = groups.every((g) => !g.required || (selections[g.name]?.length ?? 0) > 0)

  function handleAdd() {
    const summary = groups.flatMap((g) => selections[g.name] ?? []).join(', ')
    onAdd({ item, qty, delta, summary, note })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden rounded-2xl p-0 shadow-elevated ring-0 max-sm:inset-x-2 max-sm:bottom-2 max-sm:top-auto max-sm:left-2 max-sm:max-h-[90dvh] max-sm:w-auto max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 sm:max-w-4xl"
      >
        <div className="grid max-h-[90vh] grid-cols-1 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
          <div className="relative h-36 overflow-hidden bg-muted sm:h-44 md:h-auto md:min-h-[32rem]">
            <Image
              src={item.image || '/placeholder.svg'}
              alt={item.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 352px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
            <span className="absolute left-4 top-4 rounded-md bg-white/95 p-1.5 shadow-sm">
              <DietMark diet={getItemDiet(item)} />
            </span>
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/70">{item.category}</p>
              <DialogHeader className="mt-1 gap-1">
                <DialogTitle className="text-left text-xl font-semibold leading-tight text-white md:text-2xl">
                  {item.name}
                </DialogTitle>
                <DialogDescription className="line-clamp-2 text-left text-sm leading-relaxed text-white/80">
                  {item.description}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="rounded-full bg-white/95 px-2.5 py-1 font-mono text-sm font-semibold tabular-nums text-foreground">
                  ${item.price.toFixed(2)}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2 py-1">
                  <DietMark diet={getItemDiet(item)} showLabel size="sm" />
                </span>
                {item.dietary?.map((d) => (
                  <span
                    key={d}
                    className="inline-flex items-center gap-1 rounded-full bg-white/18 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm"
                  >
                    <Leaf className="size-3" />
                    {d}
                  </span>
                ))}
                {item.spice ? (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-white/18 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                    {Array.from({ length: item.spice }).map((_, i) => (
                      <Flame key={i} className="size-3 fill-current" />
                    ))}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex min-h-0 flex-col bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
              <div>
                <p className="text-sm font-semibold text-foreground">Customize item</p>
                <p className="text-xs text-muted-foreground">Choose options, then set quantity</p>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
              <div className="flex flex-col gap-6">
                {groups.map((group) => {
                  const chosen = selections[group.name] ?? []
                  return (
                    <section key={group.name}>
                      <div className="mb-2.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-foreground">{group.name}</h3>
                          {group.required ? (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                              Required
                            </span>
                          ) : (
                            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                              Optional
                            </span>
                          )}
                        </div>
                        {group.selectType === 'multi' && (
                          <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                            {chosen.length}/{group.max}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {group.options.map((opt) => {
                          const active = chosen.includes(opt.name)
                          return (
                            <button
                              key={opt.name}
                              type="button"
                              onClick={() => toggle(group, opt.name)}
                              className={cn(
                                'flex min-h-12 items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-all',
                                active
                                  ? 'border-primary bg-accent shadow-[inset_0_0_0_1px_var(--primary)]'
                                  : 'border-border bg-background hover:border-primary/30 hover:bg-secondary/70',
                              )}
                            >
                              <span className="flex min-w-0 items-center gap-2.5">
                                <span
                                  className={cn(
                                    'flex size-4 shrink-0 items-center justify-center border',
                                    group.selectType === 'single' ? 'rounded-full' : 'rounded-[4px]',
                                    active
                                      ? 'border-primary bg-primary text-primary-foreground'
                                      : 'border-muted-foreground/35 bg-card',
                                  )}
                                >
                                  {active && <Check className="size-2.5" strokeWidth={3} />}
                                </span>
                                <span className="truncate text-sm font-medium text-foreground">{opt.name}</span>
                              </span>
                              <span
                                className={cn(
                                  'shrink-0 font-mono text-xs tabular-nums',
                                  opt.priceDelta > 0 ? 'text-foreground' : 'text-muted-foreground',
                                )}
                              >
                                {opt.priceDelta > 0 ? `+$${opt.priceDelta.toFixed(2)}` : 'Incl.'}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </section>
                  )
                })}

                <section>
                  <label htmlFor="special-instructions" className="mb-2.5 block text-sm font-semibold text-foreground">
                    Special instructions
                    <span className="ml-2 text-xs font-normal text-muted-foreground">Optional</span>
                  </label>
                  <Textarea
                    id="special-instructions"
                    placeholder="Allergies, no onions, extra napkins…"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="min-h-[4.5rem] resize-none rounded-xl bg-background"
                    rows={2}
                  />
                </section>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-border bg-background/80 px-5 py-4">
              <div className="flex items-center rounded-xl border border-border bg-card p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-lg"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus className="size-4" />
                </Button>
                <span className="w-8 text-center font-mono text-base font-semibold tabular-nums">{qty}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-lg"
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus className="size-4" />
                </Button>
              </div>
              <Button
                size="lg"
                className="h-11 flex-1 rounded-xl text-sm font-semibold"
                disabled={!canAdd}
                onClick={handleAdd}
              >
                <span>Add to order</span>
                <span className="ml-2 font-mono tabular-nums">${(unitPrice * qty).toFixed(2)}</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
