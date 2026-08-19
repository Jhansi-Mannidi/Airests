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
      className="rounded-xl border border-border bg-card p-4 hover:shadow-hover"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{label}</p>
        {Icon && (
          <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Icon className="size-4" />
          </span>
        )}
      </div>
      <p className="mt-3 font-mono text-2xl font-semibold tabular-nums tracking-tight text-foreground">{value}</p>
      {delta && (
        <p className={cn('mt-1.5 text-xs font-medium', deltaTone === 'success' ? 'text-success' : 'text-danger')}>
          {delta}
        </p>
      )}
    </m.div>
  )
}
