'use client'

import Link from 'next/link'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { AppSwitcher } from '@/components/shared/app-switcher'
import { AirestsMark } from '@/components/shared/airests-mark'
import { useCart } from '@/components/order/cart-context'

export function OrderHeader({
  title,
  backHref,
  tableLabel,
}: {
  title?: string
  backHref?: string
  tableLabel?: string
}) {
  const { count } = useCart()

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-border bg-card/95 px-3 backdrop-blur-sm md:h-[4.5rem] md:px-8">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <Link href="/order" aria-label="Airests home" className="shrink-0">
          <AirestsMark size="lg" className="hidden sm:flex" />
          <AirestsMark showWordmark={false} size="lg" className="flex sm:hidden" />
        </Link>
        {backHref && (
          <>
            <div className="hidden h-6 w-px shrink-0 bg-border sm:block" />
            <Link
              href={backHref}
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-secondary/70"
              aria-label="Back"
            >
              <ArrowLeft className="size-4.5" />
            </Link>
          </>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{title ?? 'Riverside Grill'}</p>
          {tableLabel && <p className="truncate text-xs text-primary">{tableLabel}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <AppSwitcher variant="ghost-icon" />
        <Link
          href="/order/cart"
          className="relative flex size-9 items-center justify-center rounded-full text-foreground hover:bg-secondary"
          aria-label="View cart"
        >
          <ShoppingBag className="size-5" />
          {count > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}
