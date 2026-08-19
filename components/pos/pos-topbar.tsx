'use client'

import Link from 'next/link'
import { ChevronLeft, Clock } from 'lucide-react'
import { ConnectivityChip } from '@/components/shared/status-pill'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { AppSwitcher } from '@/components/shared/app-switcher'
import { Button } from '@/components/ui/button'
import { AirestsMark } from '@/components/shared/airests-mark'
import { brand, type ConnectivityState } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export function PosTopBar({
  title,
  backHref,
  staffName = 'Maria Alvarez',
  connectivity = 'online',
  pendingSync,
  right,
}: {
  title?: string
  backHref?: string
  staffName?: string
  connectivity?: ConnectivityState
  pendingSync?: number
  right?: React.ReactNode
}) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border bg-card px-3 md:h-[4.5rem] md:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-3">
        <Link href="/pos" aria-label="Airests POS home" className="shrink-0 rounded-xl py-0.5">
          <AirestsMark showWordmark size="md" className="hidden sm:flex" />
          <AirestsMark showWordmark={false} size="md" className="flex sm:hidden" />
        </Link>
        {(backHref || title) && (
          <>
            <div className="hidden h-8 w-px shrink-0 bg-border sm:block" />
            {backHref && (
              <Button
                variant="secondary"
                size="icon"
                className="size-8 shrink-0 rounded-full border border-border md:size-9"
                nativeButton={false}
                render={
                  <Link href={backHref} aria-label="Back">
                    <ChevronLeft className="size-5" />
                  </Link>
                }
              />
            )}
            {title && (
              <span className="min-w-0 truncate text-sm font-semibold leading-tight text-foreground md:text-[15px]">
                {title}
              </span>
            )}
          </>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1 md:gap-3">
        {right}
        <div className="hidden items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground lg:flex">
          <Clock className="size-3.5 text-muted-foreground" />
          {staffName}
        </div>
        <ConnectivityChip state={connectivity} pendingCount={pendingSync} className="hidden sm:inline-flex" />
        <ThemeToggle />
        <AppSwitcher />
      </div>
    </header>
  )
}

export function OfflineBanner({ pendingCount = 3 }: { pendingCount?: number }) {
  return (
    <div className="flex flex-col gap-1 border-b border-warning/30 bg-warning/10 px-4 py-2.5 text-sm md:flex-row md:items-center md:justify-between md:px-6">
      <p className="font-medium text-warning">
        Offline Mode — Orders are being saved locally and will sync automatically when connection returns.
      </p>
      <div className="flex items-center gap-3 text-xs text-warning/90">
        <span className="rounded-full bg-warning/20 px-2.5 py-1 font-semibold">{pendingCount} orders pending sync</span>
        <span className="hidden md:inline">Card payments depend on your terminal&apos;s own connection.</span>
      </div>
    </div>
  )
}

export function PosFooterStatus({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-between px-6 py-2 text-xs text-muted-foreground', className)}>
      <span>{brand.registerName} — {brand.activeLocation}</span>
      <span suppressHydrationWarning>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
    </div>
  )
}
