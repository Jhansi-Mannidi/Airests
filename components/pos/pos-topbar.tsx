'use client'

import Link from 'next/link'
import { ChevronLeft, Clock } from 'lucide-react'
import { ConnectivityChip } from '@/components/shared/status-pill'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { AppSwitcher } from '@/components/shared/app-switcher'
import { Button } from '@/components/ui/button'
import { AirestsMark } from '@/components/shared/airests-mark'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { brand, type ConnectivityState } from '@/lib/mock-data'
import { useSession } from '@/lib/session'
import { cn } from '@/lib/utils'
import * as React from 'react'

function LiveClock() {
  const [now, setNow] = React.useState(() => new Date())

  React.useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <span className="tabular-nums" suppressHydrationWarning>
      {now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
    </span>
  )
}

export function PosTopBar({
  title,
  backHref,
  staffName,
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
  const session = useSession()
  const name = staffName ?? session?.name ?? 'Maria Alvarez'
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border/80 bg-card/90 px-3 backdrop-blur-md md:h-[4.25rem] md:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-3">
        <Link href="/pos" aria-label="Airests POS home" className="shrink-0 rounded-xl py-0.5">
          <AirestsMark showWordmark size="md" className="hidden sm:flex" />
          <AirestsMark showWordmark={false} size="md" className="flex sm:hidden" />
        </Link>
        {(backHref || title) && (
          <>
            <div className="hidden h-7 w-px shrink-0 bg-border sm:block" />
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
      <div className="flex shrink-0 items-center gap-1.5 md:gap-2.5">
        {right}
        <div className="hidden items-center gap-2 rounded-full border border-border bg-background px-2 py-1 pr-3 lg:flex">
          <Avatar size="sm" className="bg-accent">
            <AvatarFallback className="bg-accent text-[10px] font-semibold text-accent-foreground">{initials}</AvatarFallback>
          </Avatar>
          <div className="leading-tight">
            <p className="text-xs font-semibold text-foreground">{name.split(' ')[0]}</p>
            <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="size-2.5" />
              <LiveClock />
            </p>
          </div>
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
