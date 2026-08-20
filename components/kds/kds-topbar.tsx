'use client'

import { AirestsMark } from '@/components/shared/airests-mark'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { AppSwitcher } from '@/components/shared/app-switcher'
import { Wifi } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const stations = [
  { id: 'expo', label: 'Expo' },
  { id: 'grill', label: 'Grill' },
  { id: 'fry', label: 'Fry' },
  { id: 'salad', label: 'Salad / Cold' },
  { id: 'bar', label: 'Bar' },
]

export function KdsTopbar({ active }: { active: string }) {
  return (
    <header className="flex shrink-0 flex-col gap-2 border-b border-border/80 bg-card/90 px-3 py-2 backdrop-blur-md sm:h-14 sm:flex-row sm:items-center sm:justify-between sm:py-0 md:h-[4.5rem] md:px-6">
      <div className="flex min-w-0 items-center justify-between gap-2 md:gap-5">
        <div className="flex min-w-0 items-center gap-2">
        <Link href="/kds" className="flex shrink-0 items-center" aria-label="Airests home">
          <AirestsMark size="md" className="hidden sm:flex" />
          <AirestsMark showWordmark={false} size="md" className="flex sm:hidden" />
        </Link>
        <span className="hidden shrink-0 rounded-full border border-border bg-background/60 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground lg:inline-flex">
          Kitchen Display
        </span>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:hidden">
          <ThemeToggle />
          <AppSwitcher />
        </div>
      </div>
        <nav className="flex min-w-0 items-center gap-1 overflow-x-auto no-scrollbar pb-0.5 sm:flex-1">
          {stations.map((s) => (
            <Link
              key={s.id}
              href={s.id === 'expo' ? '/kds' : `/kds/${s.id}`}
              className={cn(
                'shrink-0 rounded-md px-2.5 py-2 text-xs font-medium transition-colors md:px-3 md:py-1.5 md:text-sm',
                active === s.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {s.label}
            </Link>
          ))}
        </nav>
      <div className="hidden items-center gap-3 sm:flex">
        <div className="hidden items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-xs font-medium text-success sm:flex">
          <Wifi className="size-3.5" />
          Synced
        </div>
        <ThemeToggle />
        <AppSwitcher />
      </div>
    </header>
  )
}
