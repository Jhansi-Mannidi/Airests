import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

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
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        {Icon && <Icon className="size-4 text-muted-foreground" />}
      </div>
      <p className="mt-2 font-mono text-2xl font-semibold tabular-nums tracking-tight text-foreground">{value}</p>
      {delta && (
        <p className={cn('mt-1 text-xs font-medium', deltaTone === 'success' ? 'text-success' : 'text-danger')}>
          {delta}
        </p>
      )}
    </div>
  )
}
