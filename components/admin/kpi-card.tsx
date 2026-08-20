'use client'

import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import { m } from 'framer-motion'

export function KpiCard({
  label,
  value,
  delta,
  deltaTone = 'success',
  icon: Icon,
}: {
  label: string
  value: string
  delta?: string
  deltaTone?: 'success' | 'danger'
  icon?: LucideIcon
}) {
  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="min-w-0 rounded-2xl border border-border bg-card p-3.5 shadow-surface sm:p-4 hover:shadow-hover"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 text-[11px] font-medium leading-snug text-muted-foreground sm:text-sm">{label}</p>
        {Icon && (
          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground sm:size-8">
            <Icon className="size-3.5 sm:size-4" />
          </span>
        )}
      </div>
      <p className="mt-2.5 font-mono text-[1.35rem] font-semibold tabular-nums tracking-tight text-foreground sm:mt-3 sm:text-2xl">
        {value}
      </p>
      {delta && (
        <p
          className={cn(
            'mt-1.5 text-[11px] font-medium leading-snug sm:text-xs',
            deltaTone === 'success' ? 'text-success' : 'text-danger',
          )}
        >
          {delta}
        </p>
      )}
    </m.div>
  )
}
