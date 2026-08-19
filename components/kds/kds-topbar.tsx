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
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/80 bg-card/90 px-3 backdrop-blur-md md:h-[4.5rem] md:px-6">
      <div className="flex min-w-0 items-center gap-2 md:gap-5">
        <Link href="/kds" className="flex shrink-0 items-center" aria-label="Airests home">
          <AirestsMark size="md" className="hidden sm:flex" />
          <AirestsMark showWordmark={false} size="md" className="flex sm:hidden" />
        </Link>
        <span className="hidden shrink-0 rounded-full border border-border bg-background/60 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground lg:inline-flex">
          Kitchen Display
        </span>
        <div className="hidden h-7 w-px shrink-0 bg-border lg:block" />
        <nav className="flex min-w-0 items-center gap-1 overflow-x-auto">
          {stations.map((s) => (
            <Link
              key={s.id}
              href={s.id === 'expo' ? '/kds' : `/kds/${s.id}`}
              className={cn(
                'shrink-0 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors md:px-3 md:text-sm',
                active === s.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {s.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-3">
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
